"use client";

import React, { useRef, useState } from "react";
import { Bold, Italic, Underline, Palette, Heading1, List, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImageToS3 } from "../_lib/upload-s3"; 

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

  const notifyError = (message: string) => {
    if (onError) onError(message);
    else console.error(message);
  };

  // Menyisipkan teks/sintaks di posisi kursor
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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyFormat(`<span style="color: ${e.target.value}">`, `</span>`);
  };

  // Logika Pemrosesan Upload Gambar ke AWS S3
  const processImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      notifyError("Format file tidak didukung. Harap unggah gambar.");
      return;
    }

    setIsUploading(true);
    
    // Sisipkan teks sementara saat loading
    const placeholderText = `\n![Mengunggah ${file.name}...]()\n`;
    applyFormat(placeholderText);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadImageToS3(formData);
      
      const currentText = textareaRef.current?.value || "";
      if (res.success) {
        // Ganti teks sementara dengan URL asli dari S3
        const newText = currentText.replace(placeholderText, `\n![${file.name}](${res.url})\n`);
        onChange(newText);
      } else {
        notifyError("Gagal mengunggah gambar.");
        // Hapus teks sementara jika gagal
        onChange(currentText.replace(placeholderText, ""));
      }
    } catch (error) {
      notifyError("Terjadi kesalahan sistem saat mengunggah.");
    } finally {
      setIsUploading(false);
    }
  };

  // Menangani klik ikon gambar
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Menangani file yang dipilih lewat dialog
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageUpload(file);
    }
    // Reset input agar bisa memilih file yang sama berulang kali jika perlu
    if (e.target) e.target.value = '';
  };

  // Menangani Drag and Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageUpload(file);
    }
  };

  return (
    <div 
      className="border rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all relative"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* File Input Tersembunyi */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        <button type="button" onClick={() => applyFormat("**", "**")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Bold"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat("*", "*")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Italic"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat("<u>", "</u>")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Underline"><Underline className="w-4 h-4" /></button>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <button type="button" onClick={() => applyFormat("### ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Heading 3"><Heading1 className="w-4 h-4" /></button>
        <button type="button" onClick={() => applyFormat("- ", "")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded" title="Bullet List"><List className="w-4 h-4" /></button>

        <div className="w-px h-4 bg-border mx-1" />

        <div className="relative flex items-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded cursor-pointer" title="Text Color">
          <Palette className="w-4 h-4" />
          <input type="color" onChange={handleColorChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Upload Image Button */}
        <button 
          type="button" 
          onClick={handleImageButtonClick} 
          disabled={isUploading}
          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded flex items-center gap-1 disabled:opacity-50" 
          title="Upload or Drag Image"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <ImageIcon className="w-4 h-4" />}
        </button>
      </div>

      {/* Text Area */}
      <textarea
        ref={textareaRef}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Ketik artikel Anda di sini... (Drag & Drop gambar ke area ini)"}
        className="w-full p-4 min-h-[400px] resize-y bg-background focus:outline-none font-mono text-sm leading-relaxed"
      />
    </div>
  );
}