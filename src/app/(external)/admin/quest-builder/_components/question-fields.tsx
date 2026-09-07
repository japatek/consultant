"use client";

import { useFormContext } from "react-hook-form";
import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { QuestFormValues } from "@/types/quest";
import { translations, type Language } from "@/translate/language-data";
import { AnswerConfigFields } from "./answer-config-fields";

/** One question card within the quest's questions list — prompt, points,
 *  and that question's own dynamic answer configuration. */
export function QuestionFields({
  lang,
  index,
  onRemove,
  canRemove,
}: {
  lang: Language;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const t = translations[lang];
  const { register, formState } = useFormContext<QuestFormValues>();
  const errors = formState.errors.questions?.[index];

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <GripVertical className="h-4 w-4" />
          {t.questionLabel} {index + 1}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={t.questionRemoveQuestion}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`question-prompt-${index}`}>{t.questionPrompt}</Label>
        <Textarea
          id={`question-prompt-${index}`}
          rows={3}
          {...register(`questions.${index}.prompt` as const)}
        />
        {errors?.prompt && <p className="text-sm text-destructive">{errors.prompt.message}</p>}
      </div>

      <div className="w-40 space-y-2">
        <Label htmlFor={`question-points-${index}`}>{t.questFieldPoints}</Label>
        <Input
          id={`question-points-${index}`}
          type="number"
          min={1}
          {...register(`questions.${index}.points` as const, { valueAsNumber: true })}
        />
      </div>

      <AnswerConfigFields lang={lang} index={index} />
    </div>
  );
}
