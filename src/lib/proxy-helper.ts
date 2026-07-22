/**
 * src/lib/auth/auth.config.ts  (corrected for your actual folder structure)
 *
 * Edge Runtime-safe Auth.js v5 configuration.
 * Imported by src/proxy.ts — zero Node.js APIs, zero Prisma.
 *
 * Login path correction:
 *   Your login page is at  src/app/(external)/auth/v4/login/page.tsx
 *   which resolves to URL  /auth/v4/login  (route group is transparent in URL)
 *   → updated signIn, verifyRequest, and error pages accordingly.
 *
 * Public path list matches your (external) route group:
 *   /auth   → covers /auth/v4/login and any other auth sub-routes
 *   /docs   → src/app/(external)/docs/page.tsx
 *   /about  → src/app/(external)/about/page.tsx
 */

import type { NextAuthConfig } from "next-auth";
import Google                  from "next-auth/providers/google";

// ---------------------------------------------------------------------------
// Public path registry — matches the (external) route group
// ---------------------------------------------------------------------------

const PUBLIC_PATHS = [
  "/auth",   // covers /auth/v4/login, /auth/v4/*, etc.
  "/docs",
  "/about",
  "/terms",
  "/privacy"
] as const satisfies readonly string[];

function matchesPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isApiPath(pathname: string): boolean {
  return pathname.startsWith("/api");
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

export const authConfig = {
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn:        "/auth/v4/login",
    verifyRequest: "/auth/v4/login?state=verify",
    error:         "/auth/v4/login",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isLoggedIn   = !!auth?.user?.id;

      // ── 1. API routes — always open ───────────────────────────────────────
      if (isApiPath(pathname)) return true;

      // ── 2. Root "/" — smart redirect ──────────────────────────────────────
      if (pathname === "/") {
        return Response.redirect(
          new URL(isLoggedIn ? "/dashboard" : "/auth/v4/login", nextUrl),
        );
      }

      // ── 3. Public (external) paths — /auth/*, /docs, /about ──────────────
      if (matchesPublic(pathname)) {
        if (isLoggedIn) {
          // Logged-in user visiting login or public page → bounce to dashboard
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // ── 4. /unauthorized — accessible regardless of auth state ───────────
      //    (shown after a 403; user may be logged in but lacks permission)
      if (pathname.startsWith("/unauthorized")) return true;

      // ── 5. Private (main) paths — /dashboard/*, everything else ──────────
      if (!isLoggedIn) {
        const callbackUrl = encodeURIComponent(pathname + nextUrl.search);
        return Response.redirect(
          new URL(`/auth/v4/login?callbackUrl=${callbackUrl}`, nextUrl),
        );
      }

      return true;
    },
  },
} satisfies NextAuthConfig;