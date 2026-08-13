"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { getArticles, saveArticle, deleteArticle } from "./_lib/action"; // Sesuaikan path ini

const emptyForm = {
  id: "",
  slug: "",
  title: "",
  desc: "",
  content: "",
  id_title: "",
  id_desc: "",
  id_content: "",
  imageUrl: "",
};

export default function ArticleAdminPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [activeTab, setActiveTab] = useState<"en" | "id">("en");

  // Fetch data awal
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getArticles();
    setArticles(data);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (article: any) => {
    setFormData({
      id: article.id,
      slug: article.slug || "",
      title: article.title || "",
      desc: article.desc || "",
      content: article.content || "",
      id_title: article.id_title || "",
      id_desc: article.id_desc || "",
      id_content: article.id_content || "",
      imageUrl: article.imageUrl || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    await deleteArticle(id);
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const res = await saveArticle(formData);
    
    if (res.success) {
      setIsFormOpen(false);
      setFormData(emptyForm);
      fetchData();
    } else {
      alert("Failed to save article: " + res.error);
    }
    
    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Article Manager</h1>
          <p className="text-muted-foreground mt-1">Create and manage content for JaPaTek</p>
        </div>
        <button
          onClick={() => { setFormData(emptyForm); setIsFormOpen(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      {/* Form Modal / Section */}
      {isFormOpen && (
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-muted px-6 py-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">{formData.id ? "Edit Article" : "Create New Article"}</h2>
            <button onClick={() => setIsFormOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug (Unique)</label>
                <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="e.g. future-heavy-machinery" className="w-full p-2 border rounded-md bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image/Cover URL</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://..." className="w-full p-2 border rounded-md bg-background" />
                  </div>
                  {formData.imageUrl && (
                    <div className="w-10 h-10 rounded border overflow-hidden shrink-0">
                      <img src={formData.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Language Tabs */}
            <div className="border-b mb-4 flex gap-4">
              <button type="button" onClick={() => setActiveTab("en")} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "en" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                🇬🇧 English (Default)
              </button>
              <button type="button" onClick={() => setActiveTab("id")} className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "id" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                🇮🇩 Bahasa Indonesia
              </button>
            </div>

            {/* English Fields */}
            <div className={`space-y-4 ${activeTab === "en" ? "block" : "hidden"}`}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input required={activeTab === "en"} type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description (For Menu)</label>
                <input required={activeTab === "en"} type="text" name="desc" value={formData.desc} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Content (Markdown/HTML supported)</label>
                <textarea required={activeTab === "en"} name="content" value={formData.content} onChange={handleInputChange} rows={8} className="w-full p-2 border rounded-md bg-background font-mono text-sm" />
              </div>
            </div>

            {/* Indonesian Fields */}
            <div className={`space-y-4 ${activeTab === "id" ? "block" : "hidden"}`}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Judul</label>
                <input type="text" name="id_title" value={formData.id_title} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deskripsi Singkat</label>
                <input type="text" name="id_desc" value={formData.id_desc} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Konten Utama</label>
                <textarea name="id_content" value={formData.id_content} onChange={handleInputChange} rows={8} className="w-full p-2 border rounded-md bg-background font-mono text-sm" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-muted transition">
                Cancel
              </button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? "Saving..." : "Save Article"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <p>No articles found. Click "New Article" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Cover</th>
                  <th className="px-6 py-4 font-medium">Article</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-3">
                      {article.imageUrl ? (
                        <img src={article.imageUrl} alt="" className="w-12 h-12 rounded object-cover border" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center border">
                          <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <div className="font-semibold text-foreground line-clamp-1">{article.title}</div>
                      <div className="text-muted-foreground text-xs line-clamp-1">{article.id_title || "No ID translation"}</div>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">
                      /{article.slug}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button onClick={() => handleEdit(article)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}