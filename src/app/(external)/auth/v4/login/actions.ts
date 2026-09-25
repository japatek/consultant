"use server";

import { signIn } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers"; // <-- Tambahkan untuk remoteip

export interface LoginActionState {
  error: string | null;
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" && error !== null && "digest" in error &&
    typeof (error as any).digest === "string" &&
    (error as any).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = ((formData.get("email") as string | null) ?? "").trim().toLowerCase();
  const turnstileToken = formData.get("turnstile-token") as string | null; 
  const rawCallback = ((formData.get("callbackUrl") as string | null) ?? "");
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/marketplace";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  // ── STANDAR SPIN: Validasi Token Ketat ───────────────────────────────────
  const expectedAction = "login";
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  if (
    typeof turnstileToken !== "string" ||
    turnstileToken.length === 0 ||
    turnstileToken.length > 2048 ||
    expectedHostnames.size === 0
  ) {
    return { error: "Security check forbidden or misconfigured." };
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY!;
  const headersList = await headers();
  const clientIp = headersList.get("x-forwarded-for") ?? "";

  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000), // Standar timeout 10 detik
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
        remoteip: clientIp,
      }),
    });

    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    const result = await r.json();

    // Verifikasi aksi dan kecocokan domain
    if (
      !result.success ||
      result.action !== expectedAction ||
      !expectedHostnames.has(result.hostname)
    ) {
      return { error: "Security verification failed or expired. Please try again." };
    }
  } catch (error) {
    console.error("[loginAction] Turnstile verification error:", error);
    return { error: "Security service is temporarily unavailable." };
  }

  // ── Lanjutkan ke Auth.js ─────────────────────────────────────────────────
  try {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
  } catch (err) {}

  try {
    await signIn("nodemailer", { email, redirect: false, redirectTo: callbackUrl });
  } catch (err) {
    if (!isNextRedirect(err)) return { error: "Failed to send magic link." };
  }

  redirect(`/auth/v4/login?state=verify&callbackUrl=${encodeURIComponent(callbackUrl)}`);
}

export async function googleAction(formData: FormData): Promise<void> {
  const rawCallback = (formData.get("callbackUrl") as string | null) ?? "";
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/interface";
  await signIn("google", { redirectTo: callbackUrl });
}