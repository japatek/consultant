"use client";

import { useState, useTransition } from "react";
import { useFormContext } from "react-hook-form";
import { FileImage, FileVideo, FileText, X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadMediaFile } from "../_lib/actions";
import type { MediaType, QuestFormValues, QuestMediaInput } from "@/types/quest";
import { translations, type Language } from "@/translate/language-data";

const ACCEPT = "image/*,video/*,application/pdf";

function mediaTypeFor(file: File): MediaType {
  if (file.type.startsWith("image/")) return "IMAGE";
  if (file.type.startsWith("video/")) return "VIDEO";
  return "PDF";
}

const ICONS: Record<MediaType, typeof FileImage> = {
  IMAGE: FileImage,
  VIDEO: FileVideo,
  PDF: FileText,
};

/** Reference-file uploader for the quest brief (image, video, or PDF). */
export function MediaUploadField({ lang }: { lang: Language }) {
  const t = translations[lang];
  const { watch, setValue } = useFormContext<QuestFormValues>();
  const media = watch("media");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    // startTransition's callback must return void, not a Promise (this is
    // enforced by React's types on React 18) — the async work runs in an
    // IIFE inside it instead of being returned directly.
    startTransition(() => {
      void (async () => {
        for (const file of Array.from(files)) {
          try {
            const formData = new FormData();
            formData.set("file", file);
            const uploaded = await uploadMediaFile(formData, "quest-media");
            const next: QuestMediaInput = {
              type: mediaTypeFor(file),
              url: uploaded.url,
              fileName: uploaded.fileName,
            };
            setValue("media", [...watch("media"), next], { shouldValidate: true });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
          }
        }
      })();
    });
  }

  function removeAt(index: number) {
    setValue(
      "media",
      media.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  }

  return (
    <div className="space-y-3">
      <Label>{t.questFieldMedia}</Label>
      <p className="text-sm text-muted-foreground">{t.questMediaHint}</p>

      <label
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Upload className="h-6 w-6" />
        )}
        <span className="text-sm">{isPending ? t.questUploading : t.questUploadFile}</span>
        <input
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          disabled={isPending}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {media.length > 0 && (
        <ul className="space-y-2">
          {media.map((item, i) => {
            const Icon = ICONS[item.type];
            return (
              <li
                key={`${item.url}-${i}`}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{item.fileName}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => removeAt(i)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
