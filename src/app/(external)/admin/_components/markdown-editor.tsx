"use client";

import React, { useRef, useState } from "react";
import { Bold, Italic, Underline, Palette, Heading1, List, Image as ImageIcon, Loader2, Eye, PenLine } from "lucide-react";
import { uploadImageToS3 } from "../_lib/upload-s3"; 
import ReactMarkdown from "react-markdown"; // You need to run: npm install react-markdown

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  onError?: (message: string) => void;
}

export function MarkdownEditor({ value, onChange, name, placeholder, onError }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"write" | "preview">("write"); // State for tabs

  const notifyError = (message: string) => {
    if (onError) onError(message);
    else console.error(message);
  };

  const applyFormat = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const processImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      notifyError("Format file tidak didukung. Harap unggah gambar.");
      return;
    }

    setIsUploading(true);
    const placeholderText = `\n![Mengunggah ${file.name}...]()\n`;
    applyFormat(placeholderText);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageToS3(formData);
      const currentText = textareaRef.current?.value || "";
      if (res.success) {
        const newText = currentText.replace(placeholderText, `\n![${file.name}](${res.url})\n`);
        onChange(newText);
      } else {
        notifyError("Gagal mengunggah gambar.");
        onChange(currentText.replace(placeholderText, ""));
      }
    } catch (error) {
      notifyError("Terjadi kesalahan sistem saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageUpload(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all relative">
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* Toolbar with Tabs */}
      <div className="flex flex-wrap items-center justify-between p-2 border-b bg-muted/30">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setMode("write")} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${mode === "write" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <PenLine className="w-4 h-4" /> Write
          </button>
          <button type="button" onClick={() => setMode("preview")} className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${mode === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-muted"}`}>
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {mode === "write" && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => applyFormat("**", "**")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat("*", "*")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"><Italic className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" onClick={() => applyFormat("### ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"><Heading1 className="w-4 h-4" /></button>
            <button type="button" onClick={() => applyFormat("- ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"><List className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-border mx-1" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded disabled:opacity-50">
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Editor / Preview Area */}
      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Ketik artikel Anda di sini..."}
          className="w-full p-4 min-h-[400px] resize-y bg-background focus:outline-none font-mono text-sm leading-relaxed"
        />
      ) : (
        <div className="w-full p-4 min-h-[400px] prose prose-sm sm:prose-base max-w-none bg-background">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <span className="text-muted-foreground italic">Nothing to preview yet...</span>
          )}
        </div>
      )}
    </div>
  );
}