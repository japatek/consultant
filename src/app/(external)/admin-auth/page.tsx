import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import NotifLogin from './_components/notif'
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Admin Login - JaPaTek",
  description: "Sign in with admin credentials below."
};

// ---------------------------------------------------------------------------
// Props — Next.js 16 passes searchParams as a Promise
// ---------------------------------------------------------------------------

interface LoginPageProps {
  searchParams: Promise<{
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
  const urlError = params.error ?? null;

  // Guard callbackUrl against open-redirect attacks
  const rawCallback = params.callbackUrl ?? "";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : '/admin';

  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 gap-2">
        {/* <NotifLogin/> */}
        
        {/* ── Card ──────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-[400px] space-y-6 rounded-2xl border border-border/40 bg-card/90 px-8 py-10 shadow-xl backdrop-blur-md">
          
          {/* ── Branding ──────────────────────────────────────────────────── */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Admin Access
            </h1>
            <p className="text-sm text-muted-foreground">
              {metadata.description}
            </p>
          </div>
          
          {/* ── Login form ────────────────────────────────────────  */}
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
            <Link prefetch={false} replace href="/">
            <Button
              variant="outline"
              className="cursor-pointer h-auto rounded-lg border border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-[var(--color-primary)] transition-colors hover:bg-primary hover:text-white"
            >
              Go back
            </Button>   
          </Link>
          </Suspense>

        </div>
      </main>

      <footer className="relative z-10 bg-transparent text-foreground/80">
        <Footer />
      </footer>
    </>
  );
}