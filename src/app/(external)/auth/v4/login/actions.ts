"use server";

import { signIn }   from "@/lib/auth/auth";
import { prisma }   from "@/lib/database/prisma";
import { redirect } from "next/navigation";

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
  const rawCallback  = ((formData.get("callbackUrl") as string | null) ?? "");

  const callbackUrl =
    rawCallback.startsWith("/") && !rawCallback.startsWith("//")
      ? rawCallback
      : "/marketplace";

  // ── 2. Email format validation ─────────────────────────────────────────────
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // ── 3. Invalidate any stale pending tokens for this email ──────────────────
  try {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  } catch (err) {
    console.error("[loginAction] Token cleanup failed:", err);
  }

// ── 4. Trigger Auth.js magic-link email (Diubah ke SMTP/Email) ─────────────
 try {
    // UBAH "email" MENJADI "nodemailer"
    await signIn("nodemailer", { 
      email,
      redirect: false, // Kita matikan redirect otomatis bawaan NextAuth
      redirectTo: callbackUrl, 
    });
  } catch (err) {
    if (!isNextRedirect(err)) {
      console.error("[loginAction] signIn error:", err);
      return { error: "Failed to send magic link. Please try again." };
    }
  }

  // ── 5. PAKSA REDIRECT KE HALAMAN NOTIFIKASI ────────────────────────────────
  redirect(`/auth/v4/login?state=verify&callbackUrl=${encodeURIComponent(callbackUrl)}`);
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