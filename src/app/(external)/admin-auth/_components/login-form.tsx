"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

import { loginAction, type LoginActionState } from "../actions";

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
  
  // New states for Username and Password
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const isInputValid = username.trim().length > 0 && password.length > 0;

  let displayError = state.error;
  if (!displayError && urlError) {
    displayError = `Authentication error: ${urlError}`;
  }

  useEffect(() => {
    const channel = new BroadcastChannel("auth_channel");
    channel.onmessage = (event) => {
      if (event.data === "login_success") {
        router.replace(callbackUrl || `/marketplace`);
      }
    };
    return () => channel.close();
  }, [callbackUrl, router]);

  useEffect(() => {
    if (state.error) {
      setTurnstileToken("");
      setWidgetKey((prev) => prev + 1); // Reset Captcha on error
    }
  }, [state.error]);

  useEffect(() => {
    if (!isInputValid) setTurnstileToken("");
  }, [username, password, isInputValid]);

  return (
    <form action={formAction} className="w-full space-y-5">
      <input type="hidden" name="turnstile-token" value={turnstileToken} />
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {displayError && (
        <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {displayError}
        </div>
      )}

      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          required
          placeholder="Enter admin username"
          className="h-12"
          disabled={isPending}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="h-12"
          disabled={isPending}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center justify-between">
          <span>
            Security verification
            {turnstileToken && <span className="ml-2 text-xs font-medium text-emerald-400"><CheckCircle className="inline size-3 mr-1"/>Verified</span>}
          </span>
        </Label>

        {isInputValid && !turnstileToken && (
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
                    <span>Verifying…</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {!turnstileToken && !isPending && (
            <TooltipContent side="bottom" className="bg-background text-foreground">
              <p>Enter credentials first and complete security check</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </form>
  );
}