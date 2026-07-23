/**
 * src/proxy.ts (atau middleware.ts) — Hardened Security Version
 */

import { NextResponse }     from "next/server";
import type { NextRequest } from "next/server";
import { decode }           from "next-auth/jwt";

const SIGN_IN_PATH   = "/auth/v4/login" as const; 
const DASHBOARD_PATH = "/dashboard"     as const;

const PUBLIC_PREFIXES = ["/auth", "/docs", "/about", "/landing", "/upcontent", "/test"] as const;
const OPEN_PREFIXES   = ["/api", "/_next", "/unauthorized"] as const;

function startsWithAny(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

async function getSessionFromCookie(
  request: NextRequest,
): Promise<{ sub?: string; id?: string } | null> {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) return null;

  const isProd      = process.env.NODE_ENV === "production";
  const cookieName  = isProd
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const cookieValue = request.cookies.get(cookieName)?.value;
  if (!cookieValue) return null;

  try {
    const token = await decode({
      token:  cookieValue,
      secret,
      salt:   cookieName, 
    });
    return token as { sub?: string; id?: string } | null;
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

  // ── CRITICAL SECURITY FIX FOR BUG 1 ───────────────────────────────────────
  // Explicitly intercept and force validation on ANY route nested inside /dashboard
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`, request.url),
      );
    }
    return NextResponse.next();
  }
  // ──────────────────────────────────────────────────────────────────────────

  // 3. Root "/" Smart Redirect
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? DASHBOARD_PATH : SIGN_IN_PATH, request.url),
    );
  }

  // 4. Public external pages
  if (startsWithAny(pathname, PUBLIC_PREFIXES)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
    }
    return NextResponse.next();
  }

  // 5. Fallback catch-all for any other unhandled private pages
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
    "/dashboard/:path*",
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|otf)$).*)",
  ],
};