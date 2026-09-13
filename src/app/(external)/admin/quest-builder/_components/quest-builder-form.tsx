"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useLanguage } from "@/hooks/use-language";
import { apiRequest } from "@/lib/api-client";
import { questFormSchema, DIFFICULTIES, CATEGORIES, type QuestFormValues } from "@/types/quest";
import { QuestionFields } from "./question-fields";
import { MediaUploadField } from "./media-upload-field";

const DEFAULT_VALUES: QuestFormValues = {
  title: "",
  difficulty: "Beginner",
  category: "General Drawing Reading (ISO/ASME)",
  description: "",
  instructions: "",
  media: [],
  questions: [{ prompt: "", points: 10, answerConfig: { type: "MULTIPLE_CHOICE", options: ["", ""], correctIndex: 0 } }],
  certificationIds: [],
  isPublished: false,
};

export type CertificationOption = { id: string; title: string };

export function QuestBuilderForm({
  questId,
  initialValues,
  certifications,
}: {
  questId?: string;
  initialValues?: QuestFormValues;
  certifications: CertificationOption[];
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

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "questions" });
  const selectedCertificationIds = form.watch("certificationIds");

  function toggleCertification(id: string) {
    const current = form.getValues("certificationIds");
    const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
    form.setValue("certificationIds", next, { shouldValidate: true });
  }

  async function onSubmit(values: QuestFormValues, publish: boolean) {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const payload = { ...values, isPublished: publish };
      const saved = questId
        ? await apiRequest<{ id: string }>(`/api/quests/${questId}`, { method: "PATCH", body: payload })
        : await apiRequest<{ id: string }>("/api/quests", { method: "POST", body: payload });
      router.push(`/admin/quests/${saved.id}`);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : t.questSaveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Fungsi untuk memetakan error agar lebih mudah dibaca manusia
  const generateErrorMessage = (errors: any) => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length === 0) return "Validation failed. Please check your inputs.";
    
    const fields = errorKeys.map(key => {
      if (key === 'title') return 'Title (Metadata Tab)';
      if (key === 'description') return 'Description (Content Tab)';
      if (key === 'questions') return 'Questions (Questions Tab)';
      return key;
    });
    
    return `Cannot save! You must fill in: ${fields.join(", ")}`;
  };

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
                <TabsTrigger value="questions">{t.questionsLabel}</TabsTrigger>
              </TabsList>

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
                  <Label>{t.questFieldCertifications}</Label>
                  {certifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t.questNoCertifications}</p>
                  ) : (
                    <div className="space-y-2 rounded-lg border p-3">
                      {certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`cert-${cert.id}`}
                            checked={selectedCertificationIds.includes(cert.id)}
                            onCheckedChange={() => toggleCertification(cert.id)}
                          />
                          <Label htmlFor={`cert-${cert.id}`} className="cursor-pointer font-normal">
                            {cert.title}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="description">{t.questFieldDescription}</Label>
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

              <TabsContent value="media" className="pt-4">
                <MediaUploadField lang={lang} />
              </TabsContent>

              <TabsContent value="questions" className="space-y-4 pt-4">
                {form.formState.errors.questions?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.questions.message}</p>
                )}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <QuestionFields
                      key={field.id}
                      lang={lang}
                      index={index}
                      canRemove={fields.length > 1}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      prompt: "",
                      points: 10,
                      answerConfig: { type: "MULTIPLE_CHOICE", options: ["", ""], correctIndex: 0 },
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {t.questionAddQuestion}
                </Button>
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
                  onClick={form.handleSubmit(
                    (v) => onSubmit(v, false),
                    (errors) => setFormError(generateErrorMessage(errors))
                  )}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.questSaveDraft}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit(
                    (v) => onSubmit(v, true),
                    (errors) => setFormError(generateErrorMessage(errors))
                  )}
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? t.questSaving : t.questPublish}
                </Button>
              </div>
            </div>

            {(formError || Object.keys(form.formState.errors).length > 0) && (
              <div className="rounded-md bg-destructive/10 p-4 border border-destructive/20">
                <p className="text-sm font-medium text-destructive">
                  {formError || "Please fix the red errors in the tabs above before submitting."}
                </p>
              </div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}