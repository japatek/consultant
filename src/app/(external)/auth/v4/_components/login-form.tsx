"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction, type LoginActionState } from "../login/actions";
import { CheckEmailNotice } from "./child/check-email-notif";
import { CapWidget } from "./child/cap-widget";
import { CheckCircle } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"


interface LoginFormProps {
  urlError: string | null;
  callbackUrl: string;
}

const INITIAL_STATE: LoginActionState = { error: null };

export function LoginForm({ urlError, callbackUrl }: LoginFormProps): React.JSX.Element {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, INITIAL_STATE);

  // Local State
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [widgetKey, setWidgetKey] = useState<number>(0);
  const [email, setEmail] = useState<string>("");

  const isEmailInputValid = email.trim().length > 3 && email.includes("@");

  // URL State
  const searchParams = useSearchParams();
  const isEmailSent = searchParams.get("provider") === "resend" || searchParams.get("state") === "verify";

  // ── ERROR HANDLING LOGIC ───────────────────────────────────────────────────
  let displayError = state.error;

  if (!displayError && urlError) {
    switch (urlError) {
      case "Configuration":
        displayError = "Server configuration error. Please try again later.";
        break;
      case "AccessDenied":
        displayError = "Access denied. You do not have permission to sign in.";
        break;
      case "Verification":
        displayError = "The verification link is invalid or has expired.";
        break;
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "EmailCreateAccount":
      case "Callback":
      case "OAuthAccountNotLinked":
      case "EmailSignin":
      case "CredentialsSignin":
      case "SessionRequired":
        displayError = "An authentication error occurred. Please try again.";
        break;
      default:
        displayError = `Authentication error: ${urlError}`;
    }
  }

  // ── LIFECYCLE HOOKS ────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");
    channel.onmessage = (event) => {
      if (event.data === "login_success") {
        router.replace(callbackUrl || `/dashboard/platoverview/`);
      }
    };
    return () => {
      channel.close();
    };
  }, [callbackUrl, router]);

  useEffect(() => {
    if (state.error) {
      setCaptchaToken("");
      setWidgetKey((prev) => prev + 1);
    }
  }, [state.error]);

  useEffect(() => {
    if (!isEmailInputValid) {
      setCaptchaToken("");
    }
  }, [email, isEmailInputValid]);

  // ── RENDER ─────────────────────────────────────────────────────────────────
  if (isEmailSent) {
    return <CheckEmailNotice />;
  }

  return (
    <form action={formAction} className="w-full space-y-5">
      <input type="hidden" name="cap-token" value={captchaToken} />
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
            {captchaToken && <span className="ml-2 text-xs font-medium text-emerald-400"><CheckCircle />Verified</span>}
          </span>
        </Label>

        {isEmailInputValid && (
          <div className="animate-in fade-in duration-200">
            <CapWidget
              key={widgetKey}
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken("")}
            />
          </div>
        )}
      </div>
      <TooltipProvider>
  
        <Tooltip >
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 bg-gradient-to-br from-rose-400 to-emerald-600 font-semibold text-white cursor-pointer"
                disabled={!captchaToken || isPending}
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

          {/* Tooltip hanya muncul jika tombol disabled karena captchaToken belum diisi */}
          {!captchaToken && !isPending && (
            <TooltipContent side="right" className="bg-background text-foreground">
              <p>Enter email first or Check the box</p>
            </TooltipContent>
          )}
        </Tooltip>

      </TooltipProvider>
    </form>
  );
}