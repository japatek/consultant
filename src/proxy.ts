/**
 * src/proxy.ts (atau middleware.ts)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

const SIGN_IN_PATH   = "/auth/v4/login" as const; 
const ARTICLE_PATH   = "/landing/article" as const;
const INTERFACE_PATH = "/interface" as const;     
const ADMIN_AUTH     = "/admin-auth" as const;    

const ADMIN_PREFIXES = ["/admin", "/landing/article"] as const;
const PUBLIC_PREFIXES = ["/auth", "/docs", "/about", "/landing", "/test", "/admin-auth"] as const;
const OPEN_PREFIXES = ["/api", "/_next", "/unauthorized"] as const;

function startsWithAny(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

// =====================================================================
// FUNGSI PENGECEKAN COOKIE KHUSUS AUTH.JS V5
// =====================================================================
async function getSessionFromCookie(
  request: NextRequest,
): Promise<{ sub?: string; id?: string; role?: string } | null> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  // Nama standar cookie Auth.js v5
  const secureCookieName = "__Secure-authjs.session-token";
  const devCookieName = "authjs.session-token";

  // Cek keberadaan cookie sesi (baik versi HTTP localhost maupun HTTPS production)
  const hasSecureCookie = request.cookies.has(secureCookieName);
  const hasDevCookie = request.cookies.has(devCookieName);

  // Jika cookie sesi belum ada (seperti pada gambar Anda), tolak akses
  if (!hasSecureCookie && !hasDevCookie) {
    return null; 
  }

  // Tentukan cookie mana yang akan dibaca
  const actualCookieName = hasSecureCookie ? secureCookieName : devCookieName;
  const cookieValue = request.cookies.get(actualCookieName)?.value;

  if (!cookieValue) return null;

  try {
    // Decode JWT token menggunakan secret dan nama cookie sebagai salt
    const token = await decode({
      token: cookieValue,
      secret,
      salt: actualCookieName,
    });
    return token as { sub?: string; id?: string; role?: string } | null;
  } catch (error) {
    console.error("Gagal mendecode session cookie:", error);
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Lewati rute internal dan API Auth
  if (startsWithAny(pathname, OPEN_PREFIXES)) {
    return NextResponse.next();
  }

  // 2. Decode session cookie
  const token = await getSessionFromCookie(request);
  const isLoggedIn = !!(token && (token.sub || token.id));
  const isAdmin = token?.role === "ADMIN";

  // =====================================================================
  // 3. PROTECTED ADMIN PATHS
  // =====================================================================
  if (startsWithAny(pathname, ADMIN_PREFIXES)) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${ADMIN_AUTH}?callbackUrl=${callbackUrl}`, request.url),
      );
    }
    
    if (!isAdmin) {
       return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
    return NextResponse.next();
  }

  // =====================================================================
  // 4. PROTECTED USER PATHS
  // =====================================================================
  if (pathname === "/interface" || pathname.startsWith("/interface/")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`, request.url),
      );
    }
    
    if (isAdmin) {
      return NextResponse.redirect(new URL("/landing/article", request.url));
    }
    
    return NextResponse.next();
  }

  // =====================================================================
  // 5. ROOT "/" AND PUBLIC PAGES
  // =====================================================================
  if (pathname === "/" || startsWithAny(pathname, PUBLIC_PREFIXES)) {
    if (isLoggedIn) {
      // Jika user sudah login tapi mencoba akses halaman login, lempar ke dashboardnya
      if (pathname.startsWith("/admin-auth") && isAdmin) {
        return NextResponse.redirect(new URL("/landing/article", request.url)); 
      } 
      else if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(isAdmin ? "/landing/article" : INTERFACE_PATH, request.url));
      }
    }
    return NextResponse.next();
  }

  // =====================================================================
  // 6. FALLBACK CATCH-ALL (Wajib Login)
  // =====================================================================
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
    return NextResponse.redirect(
      new URL(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/landing/:path*",
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|otf)$).*)",
  ],
};