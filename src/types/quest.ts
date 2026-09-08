import { z } from "zod";

/**
 * Single source of truth for quest metadata options. Import these into both
 * the admin form (<Select> options) and anywhere you validate/display a quest,
 * so the two never drift apart.
 */
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/**
 * Subject tags, aligned with the two certification families:
 *   - "General Drawing Reading (ISO/ASME)" feeds the Associate Drawing
 *     Inspector certification.
 *   - The rest each feed their matching specific-type Drawing Inspector
 *     certification (Welding Annotation, P&ID, Sheet Metal, Architectural).
 * A quest's category is just a tag for browsing/filtering — which
 * certification(s) it actually counts toward is set explicitly in the
 * builder (see `certificationIds` below) since a quest can feed more than
 * one certification, or none (pure training).
 */
export const CATEGORIES = [
  "General Drawing Reading (ISO/ASME)",
  "Welding Annotation",
  "P&ID",
  "Sheet Metal",
  "Architectural Drawing",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const ANSWER_TYPES = ["MULTIPLE_CHOICE", "TEXT_INPUT", "FILE_UPLOAD"] as const;
export type AnswerType = (typeof ANSWER_TYPES)[number];

export const MEDIA_TYPES = ["IMAGE", "VIDEO", "PDF"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

/* -------------------------------------------------------------------------
 * Answer configuration — a discriminated union keyed on `type`. This is
 * what makes each Question's "Answer Configuration" section dynamic: the
 * form reads `answerConfig.type` and swaps in the matching sub-schema, and
 * grading later switches on the exact same field.
 * ---------------------------------------------------------------------- */

export const multipleChoiceConfigSchema = z
  .object({
    type: z.literal("MULTIPLE_CHOICE"),
    options: z
      .array(z.string().trim().min(1, "Option can't be empty"))
      .min(2, "Add at least 2 options")
      .max(8, "Keep it to 8 options or fewer"),
    correctIndex: z.number().int().min(0),
  })
  .refine((val) => val.correctIndex < val.options.length, {
    message: "Correct answer must point at one of the options above",
    path: ["correctIndex"],
  });

export const textInputConfigSchema = z.object({
  type: z.literal("TEXT_INPUT"),
  expectedValue: z.string().trim().min(1, "Expected answer is required"),
  caseSensitive: z.boolean().default(false),
  // For numeric/tolerance-style answers, e.g. a force calculation accepted
  // within +/- 0.05. Leave blank for exact string matching.
  tolerance: z.number().nonnegative().optional(),
});

export const fileUploadConfigSchema = z.object({
  type: z.literal("FILE_UPLOAD"),
  allowedExtensions: z
    .array(z.enum([".sldprt", ".step", ".stp", ".stl"]))
    .min(1, "Allow at least one file type"),
  maxSizeMB: z.number().int().positive().max(500),
});

export const answerConfigSchema = z.discriminatedUnion("type", [
  multipleChoiceConfigSchema,
  textInputConfigSchema,
  fileUploadConfigSchema,
]);

export type MultipleChoiceConfig = z.infer<typeof multipleChoiceConfigSchema>;
export type TextInputConfig = z.infer<typeof textInputConfigSchema>;
export type FileUploadConfig = z.infer<typeof fileUploadConfigSchema>;
export type AnswerConfig = z.infer<typeof answerConfigSchema>;

/** Sensible starting value when the admin switches a question's answer-type <Select>. */
export function defaultAnswerConfigFor(type: AnswerType): AnswerConfig {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return { type: "MULTIPLE_CHOICE", options: ["", ""], correctIndex: 0 };
    case "TEXT_INPUT":
      return { type: "TEXT_INPUT", expectedValue: "", caseSensitive: false };
    case "FILE_UPLOAD":
      return { type: "FILE_UPLOAD", allowedExtensions: [".step"], maxSizeMB: 50 };
  }
}

/* -------------------------------------------------------------------------
 * A single Question within a Quest
 * ---------------------------------------------------------------------- */

export const questionFormSchema = z.object({
  id: z.string().optional(), // present when editing an existing question
  prompt: z.string().trim().min(5, "Give the question some real text"),
  points: z.number().int().min(1).max(1000).default(10),
  answerConfig: answerConfigSchema,
});
export type QuestionFormValues = z.infer<typeof questionFormSchema>;

/** Shape of a submitted answer to ONE question — validated against that
 *  question's own answerConfig at grading time (lib/quest/grade-answer.ts). */
export const submittedAnswerSchema = z.union([
  z.object({ type: z.literal("MULTIPLE_CHOICE"), selectedIndex: z.number().int().min(0) }),
  z.object({ type: z.literal("TEXT_INPUT"), value: z.string() }),
  z.object({ type: z.literal("FILE_UPLOAD"), fileUrl: z.string().url(), fileName: z.string() }),
]);
export type SubmittedAnswer = z.infer<typeof submittedAnswerSchema>;

/** Submitting a whole quest attempt = one answer per question, all at once. */
export const submitQuestAnswersSchema = z
  .array(z.object({ questionId: z.string(), answer: submittedAnswerSchema }))
  .min(1);
export type SubmitQuestAnswersInput = z.infer<typeof submitQuestAnswersSchema>;

/* -------------------------------------------------------------------------
 * Media + the full quest form — a Quest is a titled SET of Questions
 * ---------------------------------------------------------------------- */

export const questMediaSchema = z.object({
  type: z.enum(MEDIA_TYPES),
  url: z.string().url(),
  fileName: z.string(),
});
export type QuestMediaInput = z.infer<typeof questMediaSchema>;

export const questFormSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
  difficulty: z.enum(DIFFICULTIES),
  category: z.enum(CATEGORIES),
  description: z.string().trim().min(20, "Give the quest a real description"),
  instructions: z.string().trim().min(10, "Instructions are required"),
  media: z.array(questMediaSchema).max(10, "10 attachments max").default([]),
  questions: z.array(questionFormSchema).min(1, "Add at least one question"),
  // Which certification(s) this quest counts toward — empty = pure
  // training, not tied to any certification. Set of Certification ids.
  certificationIds: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export type QuestFormValues = z.infer<typeof questFormSchema>;
