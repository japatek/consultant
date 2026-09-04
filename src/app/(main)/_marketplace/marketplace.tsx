"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { Lock, Copy, Check, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// 1. Declare the Midtrans Snap global interface to satisfy TypeScript
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

// 2. Define full Tool type matching your Prisma Schema and marketplace-data.ts output
export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: string;
  docNo: string;
  icon: string;
  priceUSD: number;
  priceIDR: number;
  tagline: string;
  examplePrompt: string;
  exampleCode: string;
  exampleResult: string;
  how: string;
  forWhat: string;
  where: string;
  whenBuilt: string;
  why: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface MarketplaceClientProps {
  initialTools: Tool[];
  categories: string[];
  totalPages: number;
  currentPage: number;
  currentCategory: string;
  currentUser: { id: string; email: string } | null;
  userLicenses: Record<string, string>; // Maps toolId -> licenseKey
}

export default function MarketplaceClient({
  initialTools,
  categories,
  totalPages,
  currentPage,
  currentCategory,
  currentUser,
  userLicenses,
}: MarketplaceClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track purchased states locally
  const [purchased, setPurchased] = useState<Record<string, string>>(userLicenses || {});
  const [docHint, setDocHint] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Sync local state when server revalidates userLicenses via router.refresh()
  useEffect(() => {
    setPurchased(userLicenses);
  }, [userLicenses]);

  // --- Search & Filter Handlers for marketplace-data.ts ---

  function handleCategoryChange(cat: string) {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (cat === "All") {
      params.delete("category");
    } else {
      params.set("category", cat);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  }

  function showDocHint(toolId: string) {
    setDocHint(toolId);
    setTimeout(() => setDocHint(null), 2000);
  }

  // --- Payment Handler ---

  async function handleBuy(tool: Tool) {
    if (!currentUser) {
      alert("Please log in to purchase tools.");
      return;
    }

    setIsProcessing(tool.id);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId: tool.id,
          toolName: tool.name,
          priceIDR: tool.priceIDR,
          userEmail: currentUser.email,
          userId: currentUser.id,
        }),
      });

      const { token, error } = await res.json();

      if (error || !token) {
        throw new Error(error || "Failed to generate payment token.");
      }

      window.snap.pay(token, {
        onSuccess: function () {
          alert("Payment Success! Generating your license key...");
          router.refresh();
          setIsProcessing(null);
        },
        onPending: function () {
          alert("Waiting for payment...");
          setIsProcessing(null);
        },
        onError: function () {
          alert("Payment failed. Please try again.");
          setIsProcessing(null);
        },
        onClose: function () {
          setIsProcessing(null);
        },
      });
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Something went wrong while initiating checkout.");
      setIsProcessing(null);
    }
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Header Section */}
        <section className="px-20 pt-14 pb-10 md:px-10 md:pt-20 md:pb-14 max-w-6xl mx-auto">
          <div className="border-l-2 pl-5 md:pl-6 border-[var(--primary)] mt-8">
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--teal)]">
              Engineering AI Tools Bank
            </span>
            <h1 className="font-sans text-3xl md:text-5xl font-bold leading-tight mt-3 mb-4">
              Turn a general LLM into a licensed specialist.
            </h1>
          </div>
        </section>

        {/* Category Filters (populated via getAllCategories) */}
        <section className="px-6 md:px-10 max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`border border-border text-muted-foreground bg-transparent transition-all duration-150 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-mono uppercase tracking-wide hover:border-[var(--primary)] hover:text-foreground ${
                  currentCategory === cat ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]" : ""
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid (populated via getToolsPaginated) */}
        <section className="px-6 md:px-10 pb-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {initialTools.map((tool) => {
              const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Box;
              const licenseKey = purchased[tool.id];
              const hasPurchased = !!licenseKey;

              return (
                <div key={tool.id} className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
                  
                  {/* Card Header & Details */}
                  <div className="p-5 pb-4 border-b border-border">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-md flex items-center justify-center shrink-0 bg-secondary border border-border">
                        <IconComponent size={20} className="text-[var(--primary)]" />
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
                      <span className="font-sans text-2xl font-bold text-[var(--primary)]">
                        ${tool.priceUSD.toLocaleString("en-US")}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        Rp {tool.priceIDR.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>

                  {/* Body Content & Lock Overlay */}
                  <div className="p-5 pt-4 flex-1 flex flex-col relative">
                    <div className="rounded-md p-3 bg-secondary border border-border mb-2">
                      <span className="text-xs tracking-widest uppercase font-mono text-[var(--teal)] block mb-1">
                        Example Prompt
                      </span>
                      <p className="text-xs font-mono text-foreground line-clamp-3">{tool.examplePrompt}</p>
                    </div>

                    {!hasPurchased && (
                      <div className="absolute inset-0 rounded-lg overflow-hidden flex flex-col bg-background/80 backdrop-blur-md items-center justify-center gap-2 z-10">
                        <Lock size={18} className="text-[var(--chart-1)]" />
                        <p className="text-xs font-mono text-foreground">Purchase to unlock.</p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Config Snippet */}
                  <div className="p-5 pt-0 flex flex-col gap-2.5 relative z-20 mt-4">
                    {!hasPurchased ? (
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => showDocHint(tool.id)}
                          className="border border-border rounded-md px-3.5 py-2 text-xs font-mono flex-1 transition-colors hover:bg-secondary cursor-pointer"
                        >
                          {docHint === tool.id ? `→ Docs` : "View Docs"}
                        </button>
                        <button
                          onClick={() => handleBuy(tool)}
                          disabled={isProcessing === tool.id}
                          className="bg-emerald-700 text-foreground rounded-md px-3.5 py-2 text-xs font-mono font-semibold flex-1 flex items-center justify-center gap-1.5 transition-opacity disabled:opacity-70 cursor-pointer hover:bg-emerald-600"
                        >
                          {isProcessing === tool.id ? (
                            "Processing..."
                          ) : (
                            <><ArrowRight size={13} /> Purchase</>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2 bg-secondary border border-border p-3 rounded-md">
                        <span className="text-xs font-mono text-[var(--gold)] flex items-center gap-1 font-semibold">
                          <Check size={13} /> Tool Unlocked
                        </span>
                        <p className="text-[10px] text-muted-foreground font-mono leading-tight mb-1">
                          Add this to your AI client configuration:
                        </p>

                        <div
                          className="relative group cursor-pointer"
                          onClick={() => {
                            const configStr = `{
  "mcpServers": {
    "${tool.slug}": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/sse-client", "https://api.yourdomain.com/mcp?token=${licenseKey}"]
    }
  }
}`;
                            navigator.clipboard.writeText(configStr);
                            alert("Configuration copied to clipboard!");
                          }}
                        >
                          <pre className="text-[10px] font-mono bg-background p-2 rounded border border-border overflow-x-auto text-green-400">
                            {`"${tool.slug}": {
  "command": "npx",
  ...
}`}
                          </pre>
                          <Copy size={14} className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 text-[var(--gold)] transition-opacity" />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-2 border border-border rounded-md hover:border-[var(--teal)] transition-colors disabled:opacity-30 disabled:hover:border-border cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-mono text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-2 border border-border rounded-md hover:border-[var(--teal)] transition-colors disabled:opacity-30 disabled:hover:border-border cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}