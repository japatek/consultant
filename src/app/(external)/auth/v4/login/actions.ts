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

  // FALLBACK LOKAL: Jika .env masih cap-service, kita paksa pakai 127.0.0.1 di dev stage
  let capBackendUrl = process.env.CAP_BACKEND_URL || "http://127.0.0.1:8080/api/cap";
  if (capBackendUrl.includes("cap-service") && process.env.NODE_ENV !== "production") {
    capBackendUrl = "http://127.0.0.1:8080/api/cap"; 
  }
  
  const secretKey = process.env.CAP_SECRET_KEY;

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

// ── 5. Trigger Auth.js magic-link email (Diubah ke SMTP/Email) ─────────────
  try {
    // ID standar bawaan NextAuth untuk SMTP adalah "email" (bukan "nodemailer")
    // Jika di file auth.ts Anda secara spesifik menamainya "smtp", ubah "email" di bawah menjadi "smtp".
    await signIn("email", { 
      email,
      redirect: false, // Kita matikan redirect otomatis bawaan NextAuth
      redirectTo: callbackUrl, 
    });
  } catch (err) {
    // Jika NextAuth tetap memaksa melempar NEXT_REDIRECT (karena ini Server Action)
    // kita tangkap error-nya agar tidak dieksekusi NextAuth.
    if (!isNextRedirect(err)) {
      console.error("[loginAction] signIn error:", err);
      return { error: "Failed to send magic link. Please try again." };
    }
  }

  // ── 6. PAKSA REDIRECT KE HALAMAN NOTIFIKASI ────────────────────────────────
  // Kita arahkan sendiri secara manual ke halaman UI "Check Email" milik Anda
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