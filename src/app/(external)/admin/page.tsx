"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { getArticles, saveArticle, deleteArticle } from "./_lib/action";
import { MarkdownEditor } from "./_components/markdown-editor"; // Sesuaikan path import

const emptyForm = {
  id: "", slug: "", title: "", desc: "", content: "",
  id_title: "", id_desc: "", id_content: "", imageUrl: "",
};

export default function ArticleAdminPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState<"en" | "id">("en");
  const [dialog, setDialog] = useState<any>({ isOpen: false, type: "alert", title: "", message: "" });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getArticles();
    setArticles(data);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === "slug") {
      finalValue = value.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  // Fungsi khusus untuk menangani perubahan dari MarkdownEditor
  const handleContentChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (article: any) => {
    setFormData({ ...emptyForm, ...article });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDialog({
      isOpen: true, type: "confirm", title: "Hapus Artikel",
      message: "Apakah Anda yakin ingin menghapus artikel ini?",
      onConfirm: async () => {
        setDialog((prev: any) => ({ ...prev, isOpen: false }));
        await deleteArticle(id);
        fetchData();
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = formData.slug.toLowerCase().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    if (!finalSlug) return setDialog({ isOpen: true, type: "alert", title: "Peringatan", message: "URL Slug tidak boleh kosong!" });
    
    setIsSaving(true);
    const res = await saveArticle({ ...formData, slug: finalSlug });
    if (res.success) {
      setIsFormOpen(false); setFormData(emptyForm); fetchData();
    } else {
      setDialog({ isOpen: true, type: "alert", title: "Gagal Menyimpan", message: res.error });
    }
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Article Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage content</p>
        </div>
        <button onClick={() => { setFormData(emptyForm); setIsFormOpen(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-muted px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">{formData.id ? "Edit Article" : "Create New Article"}</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug (Unique)</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
              </div>
            </div>

            <div className="border-b mb-4 flex gap-4">
              <button type="button" onClick={() => setActiveTab("en")} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "en" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>🇬🇧 English</button>
              <button type="button" onClick={() => setActiveTab("id")} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "id" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>🇮🇩 Indonesia</button>
            </div>

            <div className={`space-y-4 ${activeTab === "en" ? "block" : "hidden"}`}>
              <div className="space-y-2"><label className="text-sm font-medium">Title</label><input required={activeTab === "en"} type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Short Description</label><input required={activeTab === "en"} type="text" name="desc" value={formData.desc} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Content</label>
                {/* Menggunakan MarkdownEditor */}
                <MarkdownEditor name="content" value={formData.content} onChange={(val) => handleContentChange("content", val)} />
              </div>
            </div>

            <div className={`space-y-4 ${activeTab === "id" ? "block" : "hidden"}`}>
              <div className="space-y-2"><label className="text-sm font-medium">Judul</label><input type="text" name="id_title" value={formData.id_title} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" /></div>
              <div className="space-y-2"><label className="text-sm font-medium">Deskripsi Singkat</label><input type="text" name="id_desc" value={formData.id_desc} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Konten Utama</label>
                {/* Menggunakan MarkdownEditor */}
                <MarkdownEditor name="id_content" value={formData.id_content} onChange={(val) => handleContentChange("id_content", val)} />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition">Cancel</button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isSaving ? "Saving..." : "Save Article"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data dan Dialog sama seperti sebelumnya... */}
      {/* (Tetap gunakan kode Data Table dan Modal Anda yang sudah berjalan sempurna) */}
    </div>
  );
}