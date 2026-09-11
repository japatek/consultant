"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Smile} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background font-sans text-foreground">
      <div className="mx-auto max-w-[480px] px-6 text-center">
        <h1 className="mb-2 text-5xl font-bold text-chart-4">I'm Sorry</h1>
        <h2 className="mb-3 text-xl font-semibold text-[var(--color-chart-1)]">The Page currently not ready</h2>
        <p className="mb-7 leading-relaxed text-[#888] text-sm">
          But you can explore another page  
          <Smile/>
        </p>

        <div className="flex justify-center">
          <Link prefetch={false} replace href="/">
            <Button
              variant="outline"
              className="cursor-pointer h-auto rounded-lg border border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-primary hover:text-white"
            >
              Go back
            </Button>   
          </Link>
        </div>
      </div>
    </div>
  );
}

