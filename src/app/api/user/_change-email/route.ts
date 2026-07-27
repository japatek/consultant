/**
 * src/app/api/user/change-email/route.ts
 *
 * POST /api/user/change-email
 *
 * Protected route — requires a valid Auth.js v5 session.
 * Initiates an email-change flow by:
 *   1. Validating the new email address.
 *   2. Generating a SHA-256-hashed verification token.
 *   3. Storing the token in the VerificationToken table with a scoped key.
 *   4. Sending a confirmation link to the NEW email address.
 *
 * The token is stored as SHA-256(rawToken) — the raw token goes into the
 * verification URL and never touches the database.
 *
 * Request body: { newEmail: string }
 * Response:     { message: string }
 */

import { NextRequest, NextResponse }       from "next/server";
import crypto                              from "node:crypto";
import { auth }                            from "@/lib/auth/auth";
import { prisma }                          from "@/lib/database/prisma";
import { sendChangeEmailVerification }     from "@/lib/auth/email";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1_000; // 24 hours

// Namespace prefix so these tokens don't collide with magic-link tokens
function changeEmailIdentifier(userId: string, newEmail: string): string {
  return `change-email:${userId}:${newEmail}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── 1. Require a valid session ────────────────────────────────────────────
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // ── 2. Parse + validate the new email ─────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const newEmail =
    typeof body === "object" &&
    body !== null &&
    "newEmail" in body &&
    typeof (body as { newEmail: unknown }).newEmail === "string"
      ? ((body as { newEmail: string }).newEmail).trim().toLowerCase()
      : null;

  if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const currentEmail = session.user.email?.toLowerCase() ?? "";
  if (newEmail === currentEmail) {
    return NextResponse.json(
      { error: "New email must be different from the current email." },
      { status: 400 },
    );
  }

  // ── 3. Check the new email is not already taken ───────────────────────────
  const conflict = await prisma.user.findUnique({
    where:  { email: newEmail },
    select: { id: true },
  });
  if (conflict && conflict.id !== session.user.id) {
    return NextResponse.json(
      { error: "That email address is already associated with another account." },
      { status: 409 },
    );
  }

  // ── 4. Generate SHA-256-hashed token (raw goes into email, hash into DB) ──
  const rawToken   = crypto.randomBytes(32).toString("hex");
  const tokenHash  = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expires    = new Date(Date.now() + TOKEN_TTL_MS);
  const identifier = changeEmailIdentifier(session.user.id, newEmail);

  // Invalidate any previous change-email tokens for this user
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: {
        startsWith: `change-email:${session.user.id}:`,
      },
    },
  });

  // Store the hash (never the raw token)
  await prisma.verificationToken.create({
    data: { identifier, token: tokenHash, expires },
  });

  // ── 5. Build verification URL ─────────────────────────────────────────────
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const verificationUrl = new URL("/api/user/verify-email-change", base);
  verificationUrl.searchParams.set("token",    rawToken);
  verificationUrl.searchParams.set("userId",   session.user.id);
  verificationUrl.searchParams.set("newEmail", newEmail);

  // ── 6. Send verification email to the NEW address ─────────────────────────
  await sendChangeEmailVerification({
    to:              newEmail,
    currentEmail:    session.user.email ?? "",
    verificationUrl: verificationUrl.toString(),
  });

  return NextResponse.json({
    message: "A confirmation link has been sent to your new email address.",
  });
}
