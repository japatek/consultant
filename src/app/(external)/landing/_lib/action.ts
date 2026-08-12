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

  if (
    !secretKey ||
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    expectedHostnames.size === 0
  ) {
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
    
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    const result = await r.json();
    
    if (
      result.success &&
      result.action === expectedAction &&
      expectedHostnames.has(result.hostname)
    ) {
      const cookieStore = await cookies();
      cookieStore.set("verified_human", "true", { 
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Gateway verification error:", error);
  }
  
  return { success: false };
}