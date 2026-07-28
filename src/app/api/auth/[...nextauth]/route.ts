/**
 * src/app/api/auth/[...nextauth]/route.ts
 *
 * Auth.js v5 catch-all route handler.
 * Thin wrapper — all config lives in src/lib/auth/auth.ts.
 *
 * Handles:
 *   GET  /api/auth/session
 *   GET  /api/auth/csrf
 *   GET  /api/auth/providers
 *   GET  /api/auth/signin
 *   POST /api/auth/signin/:provider
 *   GET  /api/auth/callback/:provider
 *   POST /api/auth/signout
 *   GET  /api/auth/verify-request  (magic-link sent page)
 */

export { GET, POST } from "@/lib/auth/auth";

// NOTE: This file intentionally re-exports only the handlers.
// Auth.js v5 does not need anything else here.
