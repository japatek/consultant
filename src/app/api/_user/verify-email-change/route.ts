/**
 * src/app/api/user/verify-email-change/route.ts
 *
 * GET /api/user/verify-email-change?token=...&userId=...&newEmail=...
 *
 * One-shot verification endpoint for the change-email flow.
 * The user clicks the link from their new inbox; this handler:
 *   1. Hashes the received raw token and looks it up in VerificationToken.
 *   2. Checks expiry.
 *   3. Updates the user's email in the database.
 *   4. Deletes the token (single-use guarantee).
 *   5. Redirects to /settings with a success or error indicator.
 *
 * On success:  redirect → /settings?email=updated
 * On failure:  redirect → /settings?error=expired-link | invalid-link
 */

import { NextRequest, NextResponse } from "next/server";
import crypto                        from "node:crypto";
import { prisma }                    from "@/lib/database/prisma";

function changeEmailIdentifier(userId: string, newEmail: string): string {
  return `change-email:${userId}:${newEmail}`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = req.nextUrl;
  const rawToken  = searchParams.get("token");
  const userId    = searchParams.get("userId");
  const newEmail  = searchParams.get("newEmail");

  const settingsBase = new URL("/settings", req.nextUrl.origin);

  // ── 1. Validate query params ───────────────────────────────────────────────
  if (!rawToken || !userId || !newEmail) {
    settingsBase.searchParams.set("error", "invalid-link");
    return NextResponse.redirect(settingsBase);
  }

  const tokenHash  = crypto.createHash("sha256").update(rawToken).digest("hex");
  const identifier = changeEmailIdentifier(userId, newEmail);

  // ── 2. Look up token ───────────────────────────────────────────────────────
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier,
      token:   tokenHash,
      expires: { gt: new Date() },
    },
  });

  if (!record) {
    settingsBase.searchParams.set("error", "expired-link");
    return NextResponse.redirect(settingsBase);
  }

  // ── 3. Apply the email change ──────────────────────────────────────────────
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data:  { email: newEmail, emailVerified: new Date() },
    }),
    // Consume token immediately (single-use)
    prisma.verificationToken.deleteMany({ where: { identifier } }),
  ]);

  settingsBase.searchParams.set("email", "updated");
  return NextResponse.redirect(settingsBase);
}
