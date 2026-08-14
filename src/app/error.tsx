"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-sans text-foreground">
      <div className="mx-auto max-w-[480px] px-6 text-center">
        <h1 className="mb-2 text-5xl font-bold text-primary">Oops!</h1>
        <h2 className="mb-3 text-xl font-semibold text-[var(--color-chart-4)]">Something went wrong</h2>
        
        {/* Displays the specific error message, or a fallback if none exists */}
        <p className="mb-7 leading-relaxed text-[#888] text-sm">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => reset()}
            className="cursor-pointer h-auto rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] transition hover:brightness-110"
          >
            Try again
          </Button>

          <Link prefetch={false} replace href="/">
            <Button
              variant="outline"
                 className="cursor-pointer h-auto rounded-lg border border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-chart-2 hover:text-white"
            >
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}