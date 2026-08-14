import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/database/prisma"; // Sesuaikan dengan path instance Prisma Anda

// Mendefinisikan tipe parameter dinamis
interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

// Fitur Next.js untuk memperbarui halaman setiap kali ada artikel baru (ISR)
export const revalidate = 60; 

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params;

  // 1. Ambil data artikel dari database berdasarkan slug
  const article = await prisma.article.findUnique({
    where: { slug: slug },
  });

  // Jika artikel tidak ditemukan, otomatis arahkan ke halaman 404
  if (!article) {
    notFound();
  }

  // 2. Baca bahasa dari cookies (default ke 'en')
 const cookieStore = await cookies(); // <-- Tambahkan await di sini
  const lang = cookieStore.get("language")?.value || "en";

  // 3. Tentukan konten mana yang ditampilkan berdasarkan bahasa
  const displayTitle = lang === "id" && article.id_title ? article.id_title : article.title;
  const displayContent = lang === "id" && article.id_content ? article.id_content : article.content;
  const displayDesc = lang === "id" && article.id_desc ? article.id_desc : article.desc;

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <article className="max-w-4xl mx-auto px-6 sm:px-8">
        
        {/* Header Artikel */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {displayTitle}
          </h1>
          {displayDesc && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {displayDesc}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium">
            <span>{new Date(article.createdAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>JaPaTek Engineering</span>
          </div>
        </header>

        {/* Gambar Cover */}
        {article.imageUrl && (
          <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
            <img 
              src={article.imageUrl} 
              alt={displayTitle} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* 
          Konten Utama (Markdown) 
          Class 'prose' dari @tailwindcss/typography secara ajaib akan menata gaya
          semua h1, h2, p, ul, li, dan blockquote hasil dari konversi Markdown.
        */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <ReactMarkdown>
            {displayContent}
          </ReactMarkdown>
        </div>

      </article>
    </main>
  );
}