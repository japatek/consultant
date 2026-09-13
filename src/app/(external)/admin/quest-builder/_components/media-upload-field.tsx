"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FileImage, FileVideo, FileText, X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api-client";
import type { UploadedFile } from "@/lib/storage";
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

export function MediaUploadField({ lang }: { lang: Language }) {
  const t = translations[lang];
  const { watch, setValue, getValues, formState } = useFormContext<QuestFormValues>();
  
  // Menggunakan getValues untuk mencegah data hilang saat re-render
  const media = watch("media") || [];
  
  // MENGGANTI useTransition dengan useState agar status loading (isUploading) akurat
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mengambil error spesifik dari Zod untuk field 'media'
  const mediaZodError = formState.errors.media;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setIsUploading(true);

    try {
      // Selalu ambil nilai paling baru dari form untuk mencegah stale data
      const currentMedia = getValues("media") || [];
      const newMedia = [...currentMedia];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("folder", "quest-media");
        
        const uploaded = await apiRequest<UploadedFile>("/api/media/upload", { formData });
        
        // Menambahkan properti "name" sebagai fallback apabila schema Zod Anda tidak menggunakan "fileName"
        const next: any = {
          type: mediaTypeFor(file),
          url: uploaded.url,
          fileName: uploaded.fileName,
          name: uploaded.fileName, // Tambahan asuransi skema Zod
        };
        
        newMedia.push(next);
      }
      
      setValue("media", newMedia, { shouldValidate: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  function removeAt(index: number) {
    const currentMedia = getValues("media") || [];
    setValue(
      "media",
      currentMedia.filter((_, i) => i !== index),
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
        {isUploading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Upload className="h-6 w-6" />
        )}
        <span className="text-sm">{isUploading ? t.questUploading : t.questUploadFile}</span>
        <input
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* +++ KOTAK DEBUG ZOD ERROR +++ 
          Akan langsung menampilkan teks alasan kenapa Zod menolak gambar ini */}
      {mediaZodError && (
        <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive overflow-auto border border-destructive/20">
          <p className="font-bold mb-1">Zod Validation Error Details:</p>
          <pre>{JSON.stringify(mediaZodError, null, 2)}</pre>
        </div>
      )}

      {media.length > 0 && (
        <ul className="space-y-2">
          {media.map((item, i) => {
            const Icon = ICONS[item.type as MediaType] || FileText;
            return (
              <li
                key={`${item.url}-${i}`}
                className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate">{item.fileName || (item as any).name}</span>
                <Button
                  type="button" // PENTING: Mencegah tombol silang (hapus) melakukan submit form!
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.preventDefault();
                    removeAt(i);
                  }}
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