"use client";

import { useState } from "react";
import { useForm, FormProvider, type Resolver } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useLanguage } from "@/hooks/use-language";
import { createQuest, updateQuest } from "./_lib/actions";
import {
  questFormSchema,
  DIFFICULTIES,
  CATEGORIES,
  type QuestFormValues,
} from "@/types/quest";
import { AnswerConfigFields } from "./answer-config-fields";
import { MediaUploadField } from "./media-upload-field";

const DEFAULT_VALUES: QuestFormValues = {
  title: "",
  difficulty: "Beginner",
  category: "2D Drafting",
  description: "",
  instructions: "",
  points: 10,
  media: [],
  answerConfig: { type: "MULTIPLE_CHOICE", options: ["", ""], correctIndex: 0 },
  isPublished: false,
};


export function QuestBuilderForm({
  questId,
  initialValues,
}: {
  /** Pass both when editing an existing quest; omit both to create a new one. */
  questId?: string;
  initialValues?: QuestFormValues;
}) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

const form = useForm<QuestFormValues>({
    resolver: zodResolver(questFormSchema) as any,
    defaultValues: initialValues ?? DEFAULT_VALUES,
    mode: "onBlur",
  });

  async function onSubmit(values: QuestFormValues, publish: boolean) {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = { ...values, isPublished: publish };
      const saved = questId ? await updateQuest(questId, payload) : await createQuest(payload);
      router.push(`/admin/quests/${saved.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.questSaveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{t.questBuilderTitle}</CardTitle>
        <CardDescription>{t.questBuilderSubtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <Tabs defaultValue="metadata">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="metadata">{t.questFieldTitle}</TabsTrigger>
                <TabsTrigger value="content">{t.questFieldDescription}</TabsTrigger>
                <TabsTrigger value="media">{t.questFieldMedia}</TabsTrigger>
                <TabsTrigger value="answer">{t.questFieldAnswerType}</TabsTrigger>
              </TabsList>

              {/* --- Metadata --- */}
              <TabsContent value="metadata" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.questFieldTitle}</Label>
                  <Input id="title" {...form.register("title")} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.questFieldDifficulty}</Label>
                    <Select
                      value={form.watch("difficulty")}
                      onValueChange={(v) => form.setValue("difficulty", v as (typeof DIFFICULTIES)[number])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t.questFieldCategory}</Label>
                    <Select
                      value={form.watch("category")}
                      onValueChange={(v) => form.setValue("category", v as (typeof CATEGORIES)[number])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">{t.questFieldPoints}</Label>
                  <Input
                    id="points"
                    type="number"
                    min={1}
                    {...form.register("points", { valueAsNumber: true })}
                  />
                </div>
              </TabsContent>

              {/* --- Content --- */}
              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">{t.questFieldDescription}</Label>
                  {/* TODO: swap for a rich text editor (Tiptap/Lexical) — kept
                      as a plain textarea placeholder per the brief. */}
                  <Textarea id="description" rows={5} {...form.register("description")} />
                  {form.formState.errors.description && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">{t.questFieldInstructions}</Label>
                  <Textarea id="instructions" rows={5} {...form.register("instructions")} />
                </div>
              </TabsContent>

              {/* --- Media --- */}
              <TabsContent value="media" className="pt-4">
                <MediaUploadField lang={lang} />
              </TabsContent>

              {/* --- Answer configuration --- */}
              <TabsContent value="answer" className="pt-4">
                <AnswerConfigFields lang={lang} />
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="publish-toggle"
                  checked={form.watch("isPublished")}
                  onCheckedChange={(v) => form.setValue("isPublished", v)}
                />
                <Label htmlFor="publish-toggle" className="font-normal">
                  {t.questPublish}
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((v) => onSubmit(v, false))}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.questSaveDraft}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((v) => onSubmit(v, true))}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? t.questSaving : t.questPublish}
                </Button>
              </div>
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
