/**
 * src/app/(external)/login/_components/CheckEmailNotice.tsx
 * + src/app/(external)/login/page.tsx  (combined in this file)
 *
 * Note: CheckEmailNotice is a separate file in practice.
 *       It is inlined here for reference only.
 */

// ============================================================================
// FILE: src/app/(external)/login/_components/CheckEmailNotice.tsx
// ============================================================================

"use client";

import React from "react";
import Link  from "next/link";
import { MailCheck } from "lucide-react";
import { Button }    from "@/components/ui/button";

export function CheckEmailNotice(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-teal-400/20 to-sky-600/20">
        <MailCheck className="size-10 text-sky-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Check your inbox
        </h2>
        <p className="max-w-[280px] text-sm text-muted-foreground">
          If that email is registered, a sign-in link is on its way. It
          expires in&nbsp;
          <strong className="text-foreground">30&nbsp;minutes</strong> and
          can only be used once.
        </p>
      </div>

      <Button variant="ghost" size="sm" asChild>
        <Link href="/auth/v4/login">Use a different email</Link>
      </Button>
    </div>
  );
}
