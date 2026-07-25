"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { Lock, Copy, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export default function MarketplaceClient({
  initialTools,
  categories,
  totalPages,
  currentPage,
  currentCategory,
}: {
  initialTools: any[];
  categories: string[];
  totalPages: number;
  currentPage: number;
  currentCategory: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [purchased, setPurchased] = useState<Record<string, boolean>>({});
  const [docHint, setDocHint] = useState<string | null>(null);

  function handleCategoryChange(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", cat);
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  }

  function togglePurchase(id: string) {
    setPurchased((prev) => ({ ...prev, [id]: true }));
  }

  function showDocHint(slug: string) {
    setDocHint(slug);
    setTimeout(() => setDocHint(null), 2000);
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <section className="px-6 pt-14 pb-10 md:px-10 md:pt-20 md:pb-14 max-w-6xl mx-auto">
        <div className="border-l-2 pl-5 md:pl-6 border-[var(--gold)]">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--teal)]">
            Engineering AI Tools Bank (Prisma Database)
          </span>
          <h1 className="font-sans text-3xl md:text-5xl font-bold leading-tight mt-3 mb-4">
            Turn a general LLM into a licensed specialist.
          </h1>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-6 md:px-10 max-w-6xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`border border-border text-muted-foreground bg-transparent transition-all duration-150 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-mono uppercase tracking-wide hover:border-[var(--gold)] hover:text-foreground ${
                currentCategory === cat ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of 33 Items max per page */}
      <section className="px-6 md:px-10 pb-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialTools.map((tool) => {
            const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Box;
            const hasPurchased = !!purchased[tool.id];

            return (
              <div key={tool.id} className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                <div className="p-5 pb-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 bg-secondary border border-border">
                      <IconComponent size={20} className="text-[var(--gold)]" />
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]">
                      {tool.docNo}
                    </span>
                  </div>
                  <h3 className="font-sans text-lg font-semibold leading-tight mb-1">{tool.name}</h3>
                  <p className="text-xs font-mono uppercase tracking-wide mb-3 text-muted-foreground">
                    {tool.category}
                  </p>
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-sans text-2xl font-bold text-[var(--gold)]">
                      ${tool.priceUSD.toLocaleString("en-US")}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Rp {tool.priceIDR.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-4 flex-1 flex flex-col relative">
                  <div className="rounded-md p-3 bg-secondary border border-border mb-2">
                    <span className="text-xs tracking-widest uppercase font-mono text-[var(--teal)] block mb-1">Example Prompt</span>
                    <p className="text-xs font-mono text-foreground">{tool.examplePrompt}</p>
                  </div>
                  {!hasPurchased && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden flex flex-col bg-background/80 backdrop-blur-md items-center justify-center gap-2">
                      <Lock size={18} className="text-[var(--gold)]" />
                      <p className="text-xs font-mono text-foreground">Purchase to unlock.</p>
                    </div>
                  )}
                </div>

                <div className="p-5 pt-0 flex items-center gap-2.5">
                  <button onClick={() => showDocHint(tool.id)} className="border border-border rounded-md px-3.5 py-2 text-xs font-mono flex-1">
                    {docHint === tool.id ? `→ Docs` : "View Docs"}
                  </button>
                  <button onClick={() => togglePurchase(tool.id)} disabled={hasPurchased} className="bg-[var(--gold)] text-background rounded-md px-3.5 py-2 text-xs font-mono font-semibold flex-1 flex items-center justify-center gap-1.5">
                    {hasPurchased ? <><Check size={13} /> Owned</> : <><ArrowRight size={13} /> Buy</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Database Server Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 border border-border rounded-md hover:border-[var(--teal)] disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-mono text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 border border-border rounded-md hover:border-[var(--teal)] disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}