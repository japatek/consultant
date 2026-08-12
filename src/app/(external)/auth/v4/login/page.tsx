
import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "../_components/login-form";
import { SignInGoogle } from "../_components/child/google-auth";
import { CheckEmailNotice } from "../_components/child/check-email-notif";
import NotifLogin from '../_components/notif'
import Footer from "@/components/Footer";


// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Welcome to JaPaTek",
  description: "Sign in or create account below."
};

// ---------------------------------------------------------------------------
// Props — Next.js 16 passes searchParams as a Promise
// ---------------------------------------------------------------------------

interface LoginPageProps {
  searchParams: Promise<{
    state?: string;
    error?: string;
    callbackUrl?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.JSX.Element> {
  const params = await searchParams;

  const isVerifyState = params.state === "verify";
  const urlError = params.error ?? null;

  // Guard callbackUrl against open-redirect attacks
  const rawCallback = params.callbackUrl ?? "";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : '/marketplace';

  return (
    <>
      {/* <StarsBackground className="relative flex flex-colw-full h-screen font-sans text-foreground selection:bg-primary selection:text-primary-foreground"> */}
      
        <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 gap-2">
          <NotifLogin/>
          {/* ── Card ──────────────────────────────────────────────────────────── */}
          <div className="w-full max-w-[400px] space-y-6 rounded-2xl border border-border/40 bg-card/90 px-8 py-10 shadow-xl backdrop-blur-md">
            
            {/* ── Branding ──────────────────────────────────────────────────── */}
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {isVerifyState ? "Email Sent." : (metadata.description)}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isVerifyState
                  ? "A magic link is on its way."
                  : (metadata.description)}
              </p>
            </div>
            

            {isVerifyState ? (
              /* ── "Check your inbox" state ─────────────────────────────────── */
              <CheckEmailNotice />
            ) : (
              /* ── Login / signup form ────────────────────────────────────────  */
              <>
                <Suspense
                  fallback={
                    <div className="space-y-5 animate-pulse opacity-50">
                      <div className="h-12 w-full rounded-md bg-muted" />
                      <div className="h-[74px] w-full rounded-md bg-muted" />
                      <div className="h-12 w-full rounded-md bg-muted" />
                    </div>
                  }
                >
                  <LoginForm urlError={urlError} callbackUrl={callbackUrl} />
                </Suspense>

                {/* ── Divider ──────────────────────────────────────────────── */}
                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-border/50" />
                  <span className="mx-3 shrink-0 text-xs uppercase text-muted-foreground">
                    or
                  </span>
                  <div className="flex-1 border-t border-border/50" />
                </div>

                {/* ── Google OAuth ─────────────────────────────────────────── */}
                <SignInGoogle callbackUrl={callbackUrl} />

                {/* ── Legal ────────────────────────────────────────────────── */}
                <p className="text-center text-xs text-muted-foreground">
                  By continuing you agree to our{" "}
                  <a
                    href="/terms"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-foreground"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </>
            )}
          </div>
        </main>
          {/* </StarsBackground> */}
        <footer className="relative z-10 bg-transparent text-foreground/80">
          <Footer />
        </footer>
    
    </>
  );
}
