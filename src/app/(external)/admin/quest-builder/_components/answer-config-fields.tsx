"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  defaultAnswerConfigFor,
  type AnswerType,
  type QuestFormValues,
  type MultipleChoiceConfig,
  type TextInputConfig,
  type FileUploadConfig,
} from "@/types/quest";
import { translations, type Language } from "@/translate/language-data";

type T = (typeof translations)["en"];

const FILE_EXTENSIONS = [".sldprt", ".step", ".stp", ".stl"] as const;

/**
 * Renders a different set of inputs depending on this question's
 * `answerConfig.type` — the "dynamic fields" part of the brief, now scoped
 * to one question at `index` within the quest's `questions` array (a quest
 * holds a list of questions; each has its own answer type). Switching the
 * type via the <Select> replaces the whole answerConfig object with a
 * fresh default shape (defaultAnswerConfigFor) so stale fields from the
 * previous type never linger in the form state.
 */
export function AnswerConfigFields({ lang, index }: { lang: Language; index: number }) {
  const t = translations[lang];
  const { control, setValue } = useFormContext<QuestFormValues>();
  const config = useWatch({ control, name: `questions.${index}.answerConfig` });
  const answerType = (config?.type ?? "") as AnswerType | "";

  function changeType(next: AnswerType) {
    setValue(`questions.${index}.answerConfig`, defaultAnswerConfigFor(next), {
      shouldValidate: true,
    });
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>{t.questFieldAnswerType}</Label>
        <Select value={answerType} onValueChange={(v) => changeType(v as AnswerType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MULTIPLE_CHOICE">{t.questAnswerMultipleChoice}</SelectItem>
            <SelectItem value="TEXT_INPUT">{t.questAnswerTextInput}</SelectItem>
            <SelectItem value="FILE_UPLOAD">{t.questAnswerFileUpload}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-muted/30 p-4">
        {config.type === "MULTIPLE_CHOICE" && (
          <MultipleChoiceFields t={t} index={index} config={config as MultipleChoiceConfig} />
        )}
        {config.type === "TEXT_INPUT" && <TextInputFields t={t} index={index} config={config as TextInputConfig} />}
        {config.type === "FILE_UPLOAD" && <FileUploadFields t={t} index={index} config={config as FileUploadConfig} />}
      </div>
    </div>
  );
}

function MultipleChoiceFields({
  t,
  index,
  config,
}: {
  t: T;
  index: number;
  config: MultipleChoiceConfig;
}) {
  const { setValue } = useFormContext<QuestFormValues>();

  function update(partial: Partial<MultipleChoiceConfig>) {
    setValue(`questions.${index}.answerConfig`, { ...config, ...partial }, { shouldValidate: true });
  }
  function updateOption(i: number, value: string) {
    const options = [...config.options];
    options[i] = value;
    update({ options });
  }
  function addOption() {
    update({ options: [...config.options, ""] });
  }
  function removeOption(i: number) {
    const options = config.options.filter((_, idx) => idx !== i);
    update({ options, correctIndex: config.correctIndex >= options.length ? 0 : config.correctIndex });
  }

  return (
    <div className="space-y-3">
      <Label>{t.questOptionsLabel}</Label>
      <div className="space-y-2">
        {config.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`mc-correct-answer-${index}`}
              checked={config.correctIndex === i}
              onChange={() => update({ correctIndex: i })}
              aria-label={t.questCorrectAnswer}
              className="h-4 w-4 accent-primary"
            />
            <Input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`${t.questOptionsLabel} ${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOption(i)}
              disabled={config.options.length <= 2}
              aria-label={t.questRemoveOption}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addOption}>
        <Plus className="mr-1 h-4 w-4" />
        {t.questAddOption}
      </Button>
    </div>
  );
}

function TextInputFields({ t, index, config }: { t: T; index: number; config: TextInputConfig }) {
  const { setValue } = useFormContext<QuestFormValues>();
  function update(partial: Partial<TextInputConfig>) {
    setValue(`questions.${index}.answerConfig`, { ...config, ...partial }, { shouldValidate: true });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t.questExpectedValue}</Label>
        <Input
          value={config.expectedValue}
          onChange={(e) => update({ expectedValue: e.target.value })}
        />
        <p className="text-sm text-muted-foreground">{t.questExpectedValueHint}</p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`case-sensitive-${index}`}
          checked={config.caseSensitive}
          onCheckedChange={(v) => update({ caseSensitive: v === true })}
        />
        <Label htmlFor={`case-sensitive-${index}`} className="cursor-pointer font-normal">
          {t.questCaseSensitive}
        </Label>
      </div>

      <div className="space-y-2">
        <Label>{t.questTolerance}</Label>
        <Input
          type="number"
          step="any"
          value={config.tolerance ?? ""}
          onChange={(e) =>
            update({ tolerance: e.target.value === "" ? undefined : Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}

function FileUploadFields({ t, index, config }: { t: T; index: number; config: FileUploadConfig }) {
  const { setValue } = useFormContext<QuestFormValues>();
  function update(partial: Partial<FileUploadConfig>) {
    setValue(`questions.${index}.answerConfig`, { ...config, ...partial }, { shouldValidate: true });
  }
  function toggleExtension(ext: (typeof FILE_EXTENSIONS)[number]) {
    const has = config.allowedExtensions.includes(ext);
    const next = has
      ? config.allowedExtensions.filter((e) => e !== ext)
      : [...config.allowedExtensions, ext];
    if (next.length > 0) update({ allowedExtensions: next });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t.questAllowedFileTypes}</Label>
        <div className="flex flex-wrap gap-2">
          {FILE_EXTENSIONS.map((ext) => {
            const active = config.allowedExtensions.includes(ext);
            return (
              <button
                key={ext}
                type="button"
                onClick={() => toggleExtension(ext)}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-foreground/30"
                )}
              >
                {ext}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t.questMaxFileSize}</Label>
        <Input
          type="number"
          min={1}
          value={config.maxSizeMB}
          onChange={(e) => update({ maxSizeMB: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
