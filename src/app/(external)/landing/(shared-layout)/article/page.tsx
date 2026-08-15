import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";
import  {prisma} from "@/lib/database/prisma"; // Sesuaikan path Prisma Anda

// Menggunakan revalidate agar halaman diperbarui secara berkala jika ada artikel baru (ISR)
export const revalidate = 60;

export default async function ArticleListPage() {
  // 1. Ambil semua artikel dari database, urutkan dari yang terbaru
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      id_title: true,
      desc: true,
      id_desc: true,
      imageUrl: true,
      createdAt: true,
    }
  });

  // 2. Baca bahasa dari cookies (Pastikan menggunakan await untuk Next.js 15)
  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "en";

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
            {lang === "id" ? "Artikel & Wawasan" : "Articles & Insights"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "id" 
              ? "Jelajahi pemikiran terbaru, panduan teknis, dan inovasi industri dari tim engineering JaPaTek." 
              : "Explore the latest thoughts, technical guides, and industry innovations from the JaPaTek engineering team."}
          </p>
        </div>

        {/* Empty State */}
        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-dashed rounded-2xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {lang === "id" ? "Belum Ada Artikel" : "No Articles Yet"}
            </h3>
            <p className="text-muted-foreground">
              {lang === "id" 
                ? "Konten baru sedang dipersiapkan. Silakan periksa kembali nanti." 
                : "New content is being prepared. Please check back later."}
            </p>
          </div>
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              // Penentuan Bahasa Dinamis
              const displayTitle = lang === "id" && article.id_title ? article.id_title : article.title;
              const displayDesc = lang === "id" && article.id_desc ? article.id_desc : article.desc;

              return (
                <Link 
                  key={article.id} 
                  href={`/landing/article/${article.slug}`}
                  className="group flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Image */}
                  <div className="relative w-full h-56 bg-muted overflow-hidden">
                    {article.imageUrl ? (
                      <img 
                        src={article.imageUrl} 
                        alt={displayTitle || "Article image"} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full bg-secondary/30 text-muted-foreground">
                        <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-40">JaPaTek</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col flex-1 p-6 md:p-8">
                    
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      <time dateTime={article.createdAt.toISOString()}>
                        {new Date(article.createdAt).toLocaleDateString(lang === "id" ? "id-ID" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {displayTitle}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                      {displayDesc}
                    </p>
                    
                    {/* Read More Button */}
                    <div className="mt-auto flex items-center gap-2 text-primary text-sm font-bold">
                      {lang === "id" ? "Baca Selengkapnya" : "Read More"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}