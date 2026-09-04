import { z } from "zod";

/**
 * Single source of truth for quest metadata options. Import these into both
 * the admin form (<Select> options) and anywhere you validate/display a quest,
 * so the two never drift apart.
 */
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const CATEGORIES = [
  "2D Drafting",
  "3D Modeling",
  "Assembly",
  "GD&T",
  "Simulation",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const ANSWER_TYPES = ["MULTIPLE_CHOICE", "TEXT_INPUT", "FILE_UPLOAD"] as const;
export type AnswerType = (typeof ANSWER_TYPES)[number];

export const MEDIA_TYPES = ["IMAGE", "VIDEO", "PDF"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

/* -------------------------------------------------------------------------
 * Answer configuration — a discriminated union keyed on `type`.
 * This is what makes the Quest Builder's "Answer Configuration" section
 * dynamic: the form reads `answerConfig.type` and swaps in the matching
 * sub-schema, and grading later switches on the exact same field.
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

/** Sensible starting value when the admin switches the answer-type <Select>. */
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
 * Media + the full quest form
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
  points: z.number().int().min(1).max(1000).default(10),
  media: z.array(questMediaSchema).max(10, "10 attachments max").default([]),
  answerConfig: answerConfigSchema,
  isPublished: z.boolean().default(false),
});

export type QuestFormValues = z.infer<typeof questFormSchema>;

/** Shape of a submitted answer — validated against the quest's own
 *  answerConfig at grading time (see src/lib/quest/grade-answer.ts). */
export const submittedAnswerSchema = z.union([
  z.object({ type: z.literal("MULTIPLE_CHOICE"), selectedIndex: z.number().int().min(0) }),
  z.object({ type: z.literal("TEXT_INPUT"), value: z.string() }),
  z.object({ type: z.literal("FILE_UPLOAD"), fileUrl: z.string().url(), fileName: z.string() }),
]);
export type SubmittedAnswer = z.infer<typeof submittedAnswerSchema>;
