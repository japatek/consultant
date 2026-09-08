// No "use server" here — these are plain functions, called from the thin
// route handlers under app/api/quests and app/api/media, not directly from
// client components. See the README for why.

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import {
  questFormSchema,
  submitQuestAnswersSchema,
  answerConfigSchema,
  type QuestFormValues,
  type AnswerConfig,
} from "@/types/quest";
import { gradeAnswer } from "./grade-answer";
import { uploadFile, assertAllowedExtension } from "@/lib/storage";
import { unlockEligibleCertifications } from "@/lib/certificate/certification-actions";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (session.user.role !== "ADMIN") throw new Error("Admin access required");
  return session.user;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Create a quest (with its questions and certification links) from the Quest Builder form. */
export async function createQuest(values: QuestFormValues) {
  const admin = await requireAdmin();
  const data = questFormSchema.parse(values); // re-validate server-side, never trust the client

  const quest = await prisma.quest.create({
    data: {
      slug: `${slugify(data.title)}-${Date.now().toString(36)}`,
      title: data.title,
      difficulty: data.difficulty,
      category: data.category,
      description: data.description,
      instructions: data.instructions,
      isPublished: data.isPublished,
      authorId: admin.id,
      media: { create: data.media },
      questions: {
        create: data.questions.map((q, index) => ({
          order: index,
          prompt: q.prompt,
          points: q.points,
          answerType: q.answerConfig.type,
          answerConfig: q.answerConfig,
        })),
      },
      certifications: {
        create: data.certificationIds.map((certificationId) => ({ certificationId })),
      },
    },
  });

  revalidatePath("/admin/quests");
  return quest;
}

/** Edit an existing quest. Same validation path as create; questions and
 *  certification links are fully replaced rather than diffed — simplest
 *  correct approach for a builder form that always submits the full set. */
export async function updateQuest(questId: string, values: QuestFormValues) {
  await requireAdmin();
  const data = questFormSchema.parse(values);

  const quest = await prisma.quest.update({
    where: { id: questId },
    data: {
      title: data.title,
      difficulty: data.difficulty,
      category: data.category,
      description: data.description,
      instructions: data.instructions,
      isPublished: data.isPublished,
      media: { deleteMany: {}, create: data.media },
      questions: {
        deleteMany: {},
        create: data.questions.map((q, index) => ({
          order: index,
          prompt: q.prompt,
          points: q.points,
          answerType: q.answerConfig.type,
          answerConfig: q.answerConfig,
        })),
      },
      certifications: {
        deleteMany: {},
        create: data.certificationIds.map((certificationId) => ({ certificationId })),
      },
    },
  });

  revalidatePath("/admin/quests");
  revalidatePath(`/admin/quests/${questId}`);
  revalidatePath(`/quests/${quest.slug}`);
  return quest;
}

/** Fetch one quest with its questions, media, and linked certifications —
 *  shaped for QuestBuilderForm's `initialValues` prop (the edit path). */
export async function getQuestById(questId: string) {
  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: {
      media: true,
      certifications: { select: { certificationId: true } },
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!quest) return null;

  const initialValues: QuestFormValues = {
    title: quest.title,
    difficulty: quest.difficulty as QuestFormValues["difficulty"],
    category: quest.category as QuestFormValues["category"],
    description: quest.description,
    instructions: quest.instructions,
    media: quest.media.map((m) => ({ type: m.type as any, url: m.url, fileName: m.fileName })),
    questions: quest.questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      points: q.points,
      answerConfig: answerConfigSchema.parse(q.answerConfig) as AnswerConfig,
    })),
    certificationIds: quest.certifications.map((c) => c.certificationId),
    isPublished: quest.isPublished,
  };

  return { id: quest.id, slug: quest.slug, initialValues };
}

/**
 * Upload one reference file (image/video/PDF) for a quest, or one answer
 * file (.sldprt/.step/.stl) for a submission. `folder` keeps the two kinds
 * of upload separated in storage.
 */
export async function uploadMediaFile(formData: FormData, folder: "quest-media" | "answer-files") {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file provided");

  const uploaded = await uploadFile(file, folder);
  return uploaded;
}

/**
 * Grade an entire quest attempt in one go — one answer per question,
 * submitted together. Records the attempt, updates the user's progress
 * totals, and unlocks any certification that attempt just completed.
 */
export async function submitQuestAnswers(questId: string, rawAnswers: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const userId = session.user.id;

  const answers = submitQuestAnswersSchema.parse(rawAnswers);

  const quest = await prisma.quest.findUniqueOrThrow({
    where: { id: questId },
    include: { questions: true },
  });

  if (answers.length !== quest.questions.length) {
    throw new Error(`Expected ${quest.questions.length} answers, got ${answers.length}`);
  }

  const questionsById = new Map(quest.questions.map((q) => [q.id, q]));
  const graded = answers.map(({ questionId, answer }) => {
    const question = questionsById.get(questionId);
    if (!question) throw new Error(`Question ${questionId} does not belong to this quest`);

    if (answer.type === "FILE_UPLOAD") {
      const config = question.answerConfig as { allowedExtensions?: string[] };
      if (config.allowedExtensions) assertAllowedExtension(answer.fileName, config.allowedExtensions);
    }

    const result = gradeAnswer(
      answerConfigSchema.parse(question.answerConfig),
      answer,
      question.points
    );
    return { questionId, answer, result };
  });

  const isCorrect = graded.every((g) => g.result.isCorrect);
  const pointsEarned = graded.reduce((sum, g) => sum + g.result.pointsEarned, 0);
  const previousAttempts = await prisma.questCompletion.count({ where: { userId, questId } });

  const completion = await prisma.$transaction(async (tx) => {
    const created = await tx.questCompletion.create({
      data: {
        userId,
        questId,
        attempt: previousAttempts + 1,
        isCorrect,
        pointsEarned,
        answers: {
          create: graded.map((g) => ({
            questionId: g.questionId,
            submittedAnswer: g.answer,
            isCorrect: g.result.isCorrect,
            pointsEarned: g.result.pointsEarned,
          })),
        },
      },
      include: { answers: true },
    });

    if (isCorrect && pointsEarned > 0) {
      await tx.userProgress.upsert({
        where: { userId },
        create: { userId, totalPoints: pointsEarned, questsCompleted: 1, lastActivityAt: new Date() },
        update: {
          totalPoints: { increment: pointsEarned },
          questsCompleted: { increment: 1 },
          lastActivityAt: new Date(),
        },
      });
    }

    return created;
  });

  const newlyUnlocked = isCorrect ? await unlockEligibleCertifications(userId) : [];

  return {
    isCorrect,
    pointsEarned,
    completionId: completion.id,
    perQuestion: graded.map((g) => ({ questionId: g.questionId, ...g.result })),
    newlyUnlockedCertificationIds: newlyUnlocked,
  };
}
