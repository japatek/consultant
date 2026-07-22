"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    // Memastikan background penuh dan sejajar dengan desain global-error
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-sans text-foreground">
      <div className="mx-auto max-w-[480px] px-6 text-center">
        <h1 className="mb-2 text-5xl font-bold">404</h1>
        <h2 className="mb-3 text-xl font-semibold">Page not found</h2>
        <p className="mb-7 leading-relaxed text-[#888] text-sm">
          The page you are looking for could not be found.
        </p>
        <div className="flex justify-center">
          <Link prefetch={false} replace href="/dashboard">
            <Button 
              variant="outline" 
              className="h-auto rounded-lg border border-[#333] bg-transparent px-6 py-2.5 text-sm font-semibold text-[#ccc] transition-colors hover:bg-[#111] hover:text-white"
            >
              Go back home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}