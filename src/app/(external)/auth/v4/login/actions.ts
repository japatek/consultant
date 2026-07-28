"use server";

import { signIn }   from "@/lib/auth/auth";
import { prisma }   from "@/lib/database/prisma";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LoginActionState {
  error: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VERIFY_URL = "/auth/v4/login?state=verify" as const;

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

// ---------------------------------------------------------------------------
// loginAction — magic-link sign-in / sign-up
// ---------------------------------------------------------------------------

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  // ── 1. Parse form fields ───────────────────────────────────────────────────
  const email        = ((formData.get("email") as string | null) ?? "").trim().toLowerCase();
  const captchaToken = formData.get("cap-token") as string | null; 
  const rawCallback  = ((formData.get("callbackUrl") as string | null) ?? "");

  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/marketplace";

  // ── 2. Email format validation ─────────────────────────────────────────────
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // ── 3. Server-side Cap Widget verification ─────────────────────────────────
  if (!captchaToken) {
    return { error: "Please complete the security verification." };
  }

  const capBackendUrl = process.env.CAP_BACKEND_URL || "http://localhost:8080";
  const siteKey       = process.env.NEXT_PUBLIC_CAP_SITE_KEY;
  const secretKey     = process.env.CAP_SECRET_KEY;

  try {
    const verifyResponse = await fetch(`${capBackendUrl}/siteverify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: captchaToken,
      }),
    });

    const verificationResult = await verifyResponse.json();

    if (!verificationResult.success) {
      return { error: "Security verification failed or expired. Please try again." };
    }
  } catch (error) {
    console.error("[loginAction] Cap verification error:", error);
    return { error: "Security service is temporarily unavailable. Please try again later." };
  }

  // ── 4. Invalidate any stale pending tokens for this email ──────────────────
  try {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  } catch (err) {
    console.error("[loginAction] Token cleanup failed:", err);
  }

  // ── 5. Trigger Auth.js magic-link email ────────────────────────────────────
  try {
    await signIn("resend", {
      email,
      redirectTo: callbackUrl, 
    });
  } catch (err) {
    // Memanfaatkan helper isNextRedirect untuk menangani arsitektur bypass Next.js
    if (isNextRedirect(err)) {
      throw err;
    }
    console.error("[loginAction] signIn error:", err);
    return { error: "Failed to send magic link. Please try again." };
  }

  return { error: null };
}

// ---------------------------------------------------------------------------
// googleAction — OAuth sign-in
// ---------------------------------------------------------------------------

export async function googleAction(formData: FormData): Promise<void> {
  const rawCallback = (formData.get("callbackUrl") as string | null) ?? "";
  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/marketplace";

  await signIn("google", { redirectTo: callbackUrl });
}