"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Bold, Italic, Heading1, List, Image as ImageIcon, 
  Loader2, Eye, PenLine 
} from "lucide-react";
import { uploadImageToS3 } from "../_lib/upload-s3";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex"; 
import 'katex/dist/katex.min.css'; 
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";

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
  const [mode, setMode] = useState<"write" | "preview">("write");

  // Pelacak value terbaru yang kebal terhadap pergantian tab (Mencegah bug placeholder)
  const latestValueRef = useRef(value);
  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  const notifyError = (message: string) => {
    if (onError) onError(message);
    else console.error(message);
  };

  // Fungsi menyisipkan format teks di posisi kursor
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

  // Logika Upload Gambar ke S3
  const processImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      notifyError("Format file tidak didukung. Harap unggah gambar.");
      return;
    }

    setIsUploading(true);
    
    // 1. Sisipkan teks sementara (placeholder)
    const placeholderText = `\n![Mengunggah ${file.name}...]()\n`;
    
    // Jika sedang di tab preview, kita tidak bisa pakai applyFormat (karena textarea hilang),
    // jadi kita langsung tambahkan ke akhir teks.
    if (mode === "preview" || !textareaRef.current) {
      onChange(latestValueRef.current + placeholderText);
    } else {
      applyFormat(placeholderText);
    }

    const formData = new FormData();
    formData.append("file", file);
    // Tambahkan parameter folder agar backend tahu di mana harus menyimpannya
    formData.append("folder", "Consultant/articles");

    try {
      const res = await uploadImageToS3(formData);
      
      // 2. Ambil teks paling baru dari ref (bukan dari state lama)
      const currentText = latestValueRef.current || ""; 

      if (res.success) {
        // 3. Ganti teks sementara dengan URL asli dari S3
        const newText = currentText.replace(placeholderText, `\n![${file.name}](${res.url})\n`);
        onChange(newText);
      } else {
        notifyError("Gagal mengunggah gambar.");
        onChange(currentText.replace(placeholderText, ""));
      }
    } catch (error) {
      notifyError("Terjadi kesalahan sistem saat mengunggah.");
      const currentText = latestValueRef.current || "";
      onChange(currentText.replace(placeholderText, ""));
    } finally {
      setIsUploading(false);
    }
  };

  // Handler interaksi UI
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageUpload(file);
    if (e.target) e.target.value = ''; // Reset input
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processImageUpload(file);
  };

  return (
    <div 
      className="border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between p-2 border-b bg-muted/30">
        
        {/* Toggle Tabs (Write / Preview) */}
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            onClick={() => setMode("write")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${mode === "write" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            <PenLine className="w-4 h-4" /> Write
          </button>
          <button 
            type="button" 
            onClick={() => setMode("preview")} 
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${mode === "preview" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:bg-muted"}`}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
        </div>

        {/* Formatting Buttons (Hanya muncul di mode Write) */}
        {mode === "write" && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => applyFormat("**", "**")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Bold">
              <Bold className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => applyFormat("*", "*")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Italic">
              <Italic className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <button type="button" onClick={() => applyFormat("### ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Heading">
              <Heading1 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => applyFormat("- ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="List">
              <List className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-border mx-1" />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading} 
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded disabled:opacity-50"
              title="Upload Image"
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* AREA EDITOR / PREVIEW */}
      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Ketik artikel Anda di sini... (Bisa Drag & Drop gambar ke area ini)"}
          className="w-full p-4 min-h-[400px] resize-y bg-background focus:outline-none font-mono text-sm leading-relaxed"
        />
      ) : (
        <div className="w-full p-6 min-h-[400px] bg-background prose prose-sm sm:prose-base dark:prose-invert max-w-none">
          {value ? (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                // Custom renderer untuk gambar agar rapi dan responsif
                img: ({ node, ...props }) => (
                  <img 
                    {...props} 
                    className="rounded-xl mx-auto shadow-md max-h-[500px] object-cover my-6" 
                    alt={props.alt || "Article image"} 
                  />
                )
              }}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <span className="text-muted-foreground italic">Belum ada konten untuk dipratinjau...</span>
          )}
        </div>
      )}
    </div>
  );
}