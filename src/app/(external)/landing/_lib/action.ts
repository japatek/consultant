"use server";

import { cookies, headers } from "next/headers";

export async function verifyTurnstileGateway(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const expectedAction = "gateway";
  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  // 1. Cek konfigurasi server
  if (!secretKey) {
    console.error("[Turnstile] ERROR: TURNSTILE_SECRET_KEY is missing in .env");
    return { success: false };
  }
  if (expectedHostnames.size === 0) {
    console.error("[Turnstile] ERROR: TURNSTILE_HOSTNAMES is missing in .env");
    return { success: false };
  }
  if (!token) {
    console.error("[Turnstile] ERROR: Token is empty");
    return { success: false };
  }

  const headersList = await headers();
  const clientIp = headersList.get("x-forwarded-for") ?? "";

  try {
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: clientIp,
      }),
    });
    
    if (!r.ok) throw new Error(`HTTP Error from Cloudflare: ${r.status}`);
    const result = await r.json();
    
    // Debug: Tampilkan respons dari Cloudflare di terminal Anda
    console.log("[Turnstile] Cloudflare Response:", result);

    if (!result.success) {
      console.error("[Turnstile] Verification failed:", result["error-codes"]);
      return { success: false };
    }

    if (result.action !== expectedAction) {
      console.error(`[Turnstile] Action mismatch. Expected: ${expectedAction}, Got: ${result.action}`);
      return { success: false };
    }

    if (!expectedHostnames.has(result.hostname)) {
      console.error(`[Turnstile] Hostname mismatch. Expected one of: ${Array.from(expectedHostnames)}, Got: ${result.hostname}`);
      return { success: false };
    }

    // Jika semua lolos, set cookie
    console.log("[Turnstile] Gateway Passed! Setting cookie.");
    const cookieStore = await cookies();
    cookieStore.set("verified_human", "true", { 
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Akan bernilai false di localhost
      sameSite: "lax",
      path: "/",
    });
    return { success: true };
    
  } catch (error) {
    console.error("[Turnstile] Fetch error:", error);
  }
  
  return { success: false };
}