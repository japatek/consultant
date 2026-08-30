"use server";

import { signIn } from "@/lib/auth/auth-admin";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export interface LoginActionState {
  error: string | null;
}

// ── HARDCODED ADMIN DICTIONARY ───────────────────────────────────────────
const ADMIN_DATA: Record<string, string> = {
  "devwriter": "devadmin"
};

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
  const username = ((formData.get("username") as string | null) ?? "").trim();
  const password = ((formData.get("password") as string | null) ?? "");
  const turnstileToken = formData.get("turnstile-token") as string | null; 
  const rawCallback = ((formData.get("callbackUrl") as string | null) ?? "");
  const callbackUrl = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/marketplace";

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  // 1. Verify credentials against the hardcoded dictionary
  if (ADMIN_DATA[username] !== password) {
    return { error: "Invalid username or password." };
  }

  // 2. STANDAR SPIN: Validasi Token Ketat
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
      signal: AbortSignal.timeout(10_000), 
      body: new URLSearchParams({
        secret: secretKey,
        response: turnstileToken,
        remoteip: clientIp,
      }),
    });

    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    const result = await r.json();

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

  // 3. Lanjutkan ke Auth.js dengan Credentials Provider
  try {
    await signIn("credentials", { 
      username, 
      password, 
      redirect: false 
    });
  } catch (err) {
    // If NextAuth throws a redirect on successful login, allow it to pass through
    if (isNextRedirect(err)) {
      throw err;
    }
    return { error: "Authentication failed." };
  }

  redirect(callbackUrl);
}