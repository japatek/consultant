"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { verifyTurnstileGateway } from "../_lib/action"; // Adjust path if needed

export function TurnstileGateway() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-slate-900 selection:bg-[royalblue] selection:text-white">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Checking your browser</h1>
          <p className="text-sm text-slate-500">
            Please complete the security check to access JaPaTek.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[100px]">
          {isVerifying ? (
            <div className="flex flex-col items-center gap-3 text-slate-600 animate-in fade-in">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-sm font-medium">Verifying connection...</span>
            </div>
          ) : (
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{ action: "login" }}
              onSuccess={async (token) => {
                setIsVerifying(true);
                setError(false);
                
                // Verify the token on the server and set the cookie
                const result = await verifyTurnstileGateway(token);
                
                if (result.success) {
                  router.refresh();
                } else {
                  setError(true);
                  setIsVerifying(false);
                }
              }}
              onError={() => setError(true)}
              onExpire={() => setError(true)}
            />
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50/50 p-3 rounded-md border border-red-100">
            Security check failed or expired. Please refresh the page and try again.
          </p>
        )}
      </div>
    </div>
  );
}