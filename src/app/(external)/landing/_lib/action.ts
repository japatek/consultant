"use server";

import { cookies } from "next/headers";

export async function verifyTurnstileGateway(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error("Missing TURNSTILE_SECRET_KEY");
    return { success: false };
  }

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });
    
    const data = await res.json();
    
    if (data.success) {
      // Set an HTTP-Only cookie that lasts for 30 days
      const cookieStore = await cookies();
      cookieStore.set("verified_human", "true", { 
        maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
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