"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import { loginAction, type LoginActionState } from "../login/actions";
import { CheckEmailNotice } from "./child/check-email-notif";

interface LoginFormProps {
  urlError: string | null;
  callbackUrl: string;
}

const INITIAL_STATE: LoginActionState = { error: null };

export function LoginForm({ urlError, callbackUrl }: LoginFormProps): React.JSX.Element {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [widgetKey, setWidgetKey] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const isEmailInputValid = email.trim().length > 3 && email.includes("@");

  const searchParams = useSearchParams();
  const isEmailSent = searchParams.get("provider") === "resend" || searchParams.get("state") === "verify";

  let displayError = state.error;
  if (!displayError && urlError) {
    displayError = `Authentication error: ${urlError}`;
  }

  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");
    channel.onmessage = (event) => {
      if (event.data === "login_success") {
        router.replace(callbackUrl || `/chat`);
      }
    };
    return () => channel.close();
  }, [callbackUrl, router]);

  useEffect(() => {
    if (state.error) {
      setTurnstileToken("");
      setWidgetKey((prev) => prev + 1);
    }
  }, [state.error]);

  useEffect(() => {
    if (!isEmailInputValid) setTurnstileToken("");
  }, [email, isEmailInputValid]);

  if (isEmailSent) {
    return <CheckEmailNotice />;
  }

  return (
    <form action={formAction} className="w-full space-y-5">
      <input type="hidden" name="turnstile-token" value={turnstileToken} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {displayError && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {displayError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-12"
          disabled={isPending}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          <span>
            Security verification
            {turnstileToken && <span className="ml-2 text-xs font-medium text-emerald-400"><CheckCircle className="inline size-3 mr-1"/>Verified</span>}
          </span>
        </Label>

        {isEmailInputValid && !turnstileToken && (
          <div className="animate-in fade-in duration-200">
            <Turnstile
              key={widgetKey}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              options={{ action: "login" }}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken("")}
              onExpire={() => setTurnstileToken("")}
            />
          </div>
        )}
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 bg-gradient-to-br from-rose-400 to-emerald-600 font-semibold text-white cursor-pointer"
                disabled={!turnstileToken || isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Sending link…</span>
                  </>
                ) : (
                  <>
                    <span>Send Link</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {!turnstileToken && !isPending && (
            <TooltipContent side="bottom" className="bg-background text-foreground">
              <p>Enter email first or complete security check</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </form>
  );
}