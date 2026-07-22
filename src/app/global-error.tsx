"use client";
/**
 * src/app/global-error.tsx
 *
 * Root-level error boundary — catches errors in the root layout.tsx and
 * template.tsx. Must define its own <html> and <body> tags.
 * Source: https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
 *
 * "Error boundaries must be Client Components."
 *
 * Next.js 16: uses `unstable_retry` (renamed from `reset`).
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Forward to your error reporting service (Sentry, LogRocket, etc.)
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 flex min-h-screen items-center justify-center bg-background font-sans text-foreground">
        <div className="mx-auto max-w-[480px] px-6 text-center">
          <h1 className="mb-2 text-5xl font-bold">500</h1>
          <h2 className="mb-3 text-xl font-semibold">Something went wrong</h2>
          <p className="mb-7 leading-relaxed text-[#888] text-sm">
            An unexpected error occurred. Our team has been notified.
            {error.digest !== undefined ? (
              <>
                <br />
                Reference: <code className="text-xs text-[#aaa]">{error.digest}</code>
              </>
            ) : null}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => unstable_retry()}
              className="rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0ea5e9] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Try again
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="rounded-lg border border-[#333] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#ccc] transition-colors hover:bg-[#111] hover:text-white"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}