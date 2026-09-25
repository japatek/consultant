import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/database/prisma";
import Footer from "@/components/Footer";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css';
import rehypeRaw from "rehype-raw";

interface ArticleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug: slug },
  });

  if (!article) {
    notFound();
  }

  const cookieStore = await cookies();
  const lang = cookieStore.get("language")?.value || "en";

  const displayTitle = lang === "id" && article.id_title ? article.id_title : article.title;
  const displayDesc = lang === "id" && article.id_desc ? article.id_desc : article.desc;

  const rawContent = lang === "id" && article.id_content ? article.id_content : article.content;
  const displayContent = rawContent || "";

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
              alt={displayTitle || "Article cover"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}

        {/* Konten Utama (Markdown) */}
        <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeRaw]}
            components={{
              // Interceptor untuk merender tag gambar
              img: ({ node, src, alt, ...props }) => {
                if (!src) return null;

                // 1. Beritahu TypeScript secara tegas bahwa src adalah string
                const srcString = src as string;
                let finalSrc = srcString;
                
                // 2. Sekarang TypeScript tahu ini string, error startsWith dan split akan hilang!
                if (!srcString.startsWith("http")) {
                  // Ambil hanya nama file murninya untuk menghindari path ganda jika ada
                  const fileName = srcString.split('/').pop();
                  
                  // Sisipkan domain CloudFront dan folder articles secara paksa
                  finalSrc = `https://zrag0isxqbcebeen.public.blob.vercel-storage.com/articles/${fileName}`;
                }

                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={finalSrc}
                    alt={alt || "Article image"}
                    className="rounded-xl mx-auto shadow-md max-h-[500px] object-cover my-6"
                    {...props}
                  />
                );
              }
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>

      </article>
      <Footer />
    </main>
  );
}