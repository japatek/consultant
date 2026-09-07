/**
 * src/proxy.ts (atau middleware.ts)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

const SIGN_IN_PATH   = "/auth/v4/login" as const; 
const LANDING_PATH   = "/landing" as const;
const INTERFACE_PATH = "/interface" as const;     
const ADMIN_AUTH     = "/admin-auth" as const;    

const ADMIN_PREFIXES = ["/admin", "/article"] as const;
const PUBLIC_PREFIXES = ["/auth", "/docs", "/about", "/landing", "/test", "/admin-auth"] as const;

// Menambahkan "/unavailable" agar rute ini terbuka dan tidak menyebabkan loop
const OPEN_PREFIXES = ["/api", "/_next", "/unauthorized", "/unavailable"] as const;

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

  const secureCookieName = "__Secure-authjs.session-token";
  const devCookieName = "authjs.session-token";

  const hasSecureCookie = request.cookies.has(secureCookieName);
  const hasDevCookie = request.cookies.has(devCookieName);

  if (!hasSecureCookie && !hasDevCookie) {
    return null; 
  }

  const actualCookieName = hasSecureCookie ? secureCookieName : devCookieName;
  const cookieValue = request.cookies.get(actualCookieName)?.value;

  if (!cookieValue) return null;

  try {
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
    
    // UBAH DI SINI: Jika ADMIN mencoba masuk user interface, lempar ke /unavailable
    if (isAdmin) {
      return NextResponse.redirect(new URL("/unavailable", request.url));
    }
    
    return NextResponse.next();
  }

  // =====================================================================
  // 5. ROOT "/" AND PUBLIC PAGES
  // =====================================================================
  if (pathname === "/" || startsWithAny(pathname, PUBLIC_PREFIXES)) {
    if (isLoggedIn) {
      if (pathname.startsWith("/admin-auth") && isAdmin) {
        return NextResponse.redirect(new URL("/article", request.url)); 
      } 
      else if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(isAdmin ? "/article" : INTERFACE_PATH, request.url));
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