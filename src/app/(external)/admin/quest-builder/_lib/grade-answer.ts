import type { AnswerConfig, SubmittedAnswer } from "@/types/quest";

export type GradeResult = {
  isCorrect: boolean;
  pointsEarned: number;
  /** Short, user-facing reason — shown in the quest UI after submitting. */
  feedback: string;
};

/**
 * Pure grading function: (config, submission) -> result. No DB, no auth, no
 * Next.js imports, so it's trivial to unit test and safe to call from both
 * the submitQuestAnswers server action and, later, a queue worker if grading
 * ever needs to move off the request path (e.g. FILE_UPLOAD review).
 */
type MultipleChoiceConfig = AnswerConfig & {
  type: "MULTIPLE_CHOICE";
  correctIndex: number;
};

type TextInputConfig = AnswerConfig & {
  type: "TEXT_INPUT";
  expectedValue: string;
  tolerance?: number;
  caseSensitive?: boolean;
};

export function gradeAnswer(
  config: AnswerConfig,
  submission: SubmittedAnswer,
  questPoints: number
): GradeResult {
  if (config.type !== submission.type) {
    return {
      isCorrect: false,
      pointsEarned: 0,
      feedback: "Submitted answer doesn't match this quest's answer type.",
    };
  }

  switch (config.type) {
    case "MULTIPLE_CHOICE": {
      const cfg = config as MultipleChoiceConfig;
      const sub = submission as SubmittedAnswer & {
        type: "MULTIPLE_CHOICE";
        selectedIndex: number;
      };
      const isCorrect = sub.selectedIndex === cfg.correctIndex;
      return {
        isCorrect,
        pointsEarned: isCorrect ? questPoints : 0,
        feedback: isCorrect ? "Correct." : "That's not the right option — try again.",
      };
    }

    case "TEXT_INPUT": {
      const cfg = config as TextInputConfig;
      const sub = submission as SubmittedAnswer & {
        type: "TEXT_INPUT";
        value: string;
      };
      const isCorrect = matchesTextAnswer(sub.value, cfg);
      return {
        isCorrect,
        pointsEarned: isCorrect ? questPoints : 0,
        feedback: isCorrect ? "Correct." : "Doesn't match the expected value yet.",
      };
    }

    case "FILE_UPLOAD": {
      // A 3D model file can't be graded correct/incorrect automatically — it
      // goes in as "submitted, ungraded" and an instructor reviews it. Points
      // are awarded when the review flips isCorrect via a separate action.
      return {
        isCorrect: false,
        pointsEarned: 0,
        feedback: "File received — an instructor will review your submission.",
      };
    }

    default: {
      return {
        isCorrect: false,
        pointsEarned: 0,
        feedback: "This answer type is not supported for grading.",
      };
    }
  }
}

function matchesTextAnswer(submittedValue: string, config: TextInputConfig): boolean {
  const expectedNum = Number(config.expectedValue);
  const submittedNum = Number(submittedValue);
  const bothNumeric = !Number.isNaN(expectedNum) && !Number.isNaN(submittedNum);

  if (bothNumeric && config.tolerance !== undefined) {
    return Math.abs(submittedNum - expectedNum) <= config.tolerance;
  }

  const a = config.caseSensitive ? submittedValue.trim() : submittedValue.trim().toLowerCase();
  const b = config.caseSensitive
    ? config.expectedValue.trim()
    : config.expectedValue.trim().toLowerCase();
  return a === b;
}
