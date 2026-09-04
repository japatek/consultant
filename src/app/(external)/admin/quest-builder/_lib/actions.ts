"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth-admin";
import { prisma } from "@/lib/database/prisma";
import { questFormSchema, submittedAnswerSchema, type QuestFormValues } from "@/types/quest";
import { gradeAnswer } from "./grade-answer";
import { uploadFile, assertAllowedExtension } from "./storage";
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

/** Create a quest from the Quest Builder form. */
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
      points: data.points,
      isPublished: data.isPublished,
      answerType: data.answerConfig.type,
      answerConfig: data.answerConfig,
      authorId: admin.id,
      media: { create: data.media },
    },
  });

  revalidatePath("/admin/quests");
  return quest;
}

/** Edit an existing quest. Same validation path as create. */
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
      points: data.points,
      isPublished: data.isPublished,
      answerType: data.answerConfig.type,
      answerConfig: data.answerConfig,
      media: {
        deleteMany: {}, // simplest correct approach: replace the set on every save
        create: data.media,
      },
    },
  });

  revalidatePath("/admin/quests");
  revalidatePath(`/quests/${quest.slug}`);
  return quest;
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
 * Grade a submitted answer, record it, update the user's progress totals,
 * and unlock any certification that submission just completed. This is the
 * one place those four things happen together, so callers (the quest page)
 * only need one round trip.
 */
export async function submitQuestAnswer(questId: string, rawSubmission: unknown) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const userId = session.user.id;

  const submission = submittedAnswerSchema.parse(rawSubmission);

  if (submission.type === "FILE_UPLOAD") {
    const quest = await prisma.quest.findUniqueOrThrow({ where: { id: questId } });
    const config = quest.answerConfig as { allowedExtensions?: string[] };
    if (config.allowedExtensions) {
      assertAllowedExtension(submission.fileName, config.allowedExtensions);
    }
  }

  const quest = await prisma.quest.findUniqueOrThrow({ where: { id: questId } });

  const previousAttempts = await prisma.questCompletion.count({ where: { userId, questId } });
  const result = gradeAnswer(
    quest.answerConfig as Parameters<typeof gradeAnswer>[0],
    submission,
    quest.points
  );

  const completion = await prisma.$transaction(async (tx) => {
    const created = await tx.questCompletion.create({
      data: {
        userId,
        questId,
        submittedAnswer: submission,
        isCorrect: result.isCorrect,
        pointsEarned: result.pointsEarned,
        attempt: previousAttempts + 1,
      },
    });

    if (result.isCorrect && result.pointsEarned > 0) {
      await tx.userProgress.upsert({
        where: { userId },
        create: {
          userId,
          totalPoints: result.pointsEarned,
          questsCompleted: 1,
          lastActivityAt: new Date(),
        },
        update: {
          totalPoints: { increment: result.pointsEarned },
          questsCompleted: { increment: 1 },
          lastActivityAt: new Date(),
        },
      });
    }

    return created;
  });

  const newlyUnlocked = result.isCorrect ? await unlockEligibleCertifications(userId) : [];

  return { ...result, completionId: completion.id, newlyUnlockedCertificationIds: newlyUnlocked };
}





