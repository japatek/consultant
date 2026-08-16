/**
 * src/proxy.ts (atau middleware.ts) — Hardened Security Version
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

const SIGN_IN_PATH = "/unavailable" as const; // Auth user yang dimatikan
const LANDING_PATH = "/landing" as const;
const DASHBOARD_PATH = "/dashboard" as const;
const MARKETPLACE    = "/marketplace" as const;
const ADMIN_AUTH     = "/admin-auth" as const; // Auth khusus admin

// 1. Definisikan rute mana saja yang merupakan halaman Admin
// Sesuaikan array ini dengan URL halaman admin Anda (misalnya /articles, /admin, dll)
const ADMIN_PREFIXES = ["/admin", "/articles"] as const;

// 2. Tambahkan /admin-auth ke PUBLIC_PREFIXES agar halamannya tidak terblokir
const PUBLIC_PREFIXES = ["/auth", "/docs", "/about", "/landing", "/test", "/admin-auth"] as const;
const OPEN_PREFIXES = ["/api", "/_next", "/unauthorized"] as const;

function startsWithAny(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

// Tambahkan definisi "role" pada token yang dikembalikan
async function getSessionFromCookie(
  request: NextRequest,
): Promise<{ sub?: string; id?: string; role?: string } | null> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const cookieValue = request.cookies.get(cookieName)?.value;
  if (!cookieValue) return null;

  try {
    const token = await decode({
      token: cookieValue,
      secret,
      salt: cookieName,
    });
    return token as { sub?: string; id?: string; role?: string } | null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. Always-open internal paths
  if (startsWithAny(pathname, OPEN_PREFIXES)) {
    return NextResponse.next();
  }

  // 2. Decode session cookie & strictly validate presence of sub/id string
  const token = await getSessionFromCookie(request);
  const isLoggedIn = !!(token && (token.sub || token.id));
  
  // Cek apakah user yang login adalah seorang ADMIN
  const isAdmin = token?.role === "ADMIN";

  // =====================================================================
  // 3. PROTECTED ADMIN PATHS (Redirect ke /admin-auth)
  // =====================================================================
  if (startsWithAny(pathname, ADMIN_PREFIXES)) {
    if (!isLoggedIn) {
      // Jika cookie nihil / belum login, lempar ke Admin Auth
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${ADMIN_AUTH}?callbackUrl=${callbackUrl}`, request.url),
      );
    }
    
    // Keamanan Ekstra: Jika yang mencoba akses adalah user biasa (bukan admin)
    if (!isAdmin) {
       return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
    return NextResponse.next();
  }

  // =====================================================================
  // 4. PROTECTED USER PATHS (Redirect ke /unavailable)
  // =====================================================================
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`, request.url),
      );
    }
    return NextResponse.next();
  }

  if (pathname === "/marketplace" || pathname.startsWith("/marketplace/")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(SIGN_IN_PATH, request.url));
    }
    return NextResponse.next();
  }

  // =====================================================================
  // 5. ROOT "/" AND PUBLIC PAGES
  // =====================================================================
  if (pathname === "/" || startsWithAny(pathname, PUBLIC_PREFIXES)) {
    
    // Jika user SUDAH LOGIN tapi mencoba masuk lagi ke halaman login
    if (isLoggedIn) {
      // Jika Admin mencoba ke halaman admin-auth, arahkan langsung ke halaman kerjanya
      if (pathname.startsWith("/admin-auth") && isAdmin) {
        return NextResponse.redirect(new URL("/articles", request.url)); 
      } 
      // Jika user biasa mencoba ke halaman auth, arahkan ke dashboard
      else if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
      }
    }
    
    // Izinkan siapa saja melihat landing page, docs, admin-auth (jika belum login)
    return NextResponse.next();
  }

  // =====================================================================
  // 6. FALLBACK CATCH-ALL
  // =====================================================================
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
    return NextResponse.redirect(
      new URL(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`, request.url),
    );
  }

  return NextResponse.next();
}

// Ensure the matcher catches all multi-level nested dashboard segments explicitly
export const config = {
  matcher: [
    "/landing/:path*",
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|otf)$).*)",
  ],
};