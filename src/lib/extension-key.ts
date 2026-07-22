// website/src/lib/extension-key.ts
//
// Single source of truth for JaPa's extension API key. Every extension
// (WXT browser, Office, Solidworks, Inventor, VSCode) authenticates with
// the same key  generated/managed from the website's Billing tab.
//
// Design:
//   * ONE key per user  UPSERT on regenerate so the old key is invalidated.
//   * Plain key shown to the user ONCE (on generate/regenerate). The DB
//     only ever stores a SHA-256 hash + a short prefix for UI display.
//   * Prefix `JaPa_pk_` distinguishes our keys from JWTs at parse time,
//     so a single Bearer header can carry either format.
//   * Only Pro / Enterprise users (or admin-listed emails) can generate.
//     The route layer enforces tier; this module is tier-agnostic.
//
// Prisma model required (add to website/prisma/schema.prisma):
//
//   model ExtensionAccessKey {
//     id          String    @id @default(cuid())
//     userId      String    @unique
//     user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
//     keyHash     String    // SHA-256(plainKey)
//     keyPrefix   String    // first ~13 chars of plain (UI display)
//     createdAt   DateTime  @default(now())
//     lastUsedAt  DateTime?
//     revokedAt   DateTime?
//     @@index([keyHash])
//   }
//
// Run `npx prisma migrate dev --name extension_access_key` after adding it.

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "./database/prisma";

/** Stable namespace prefix. Lets the auth middleware tell API keys apart
 *  from JWTs without parsing either: `token.startsWith(KEY_PREFIX)`. */
export const KEY_PREFIX = "JaPa_pk_";

/** Length of the random hex tail after the prefix. 24 bytes = 48 hex chars,
 *  giving 192 bits of entropy  well above the 128-bit minimum for API keys. */
const KEY_RANDOM_BYTES = 24;


//  Generated-key shape returned to the caller 

export interface GeneratedKey {
  /** Plain text key. Show to the user ONCE  never persisted in this form. */
  plain:     string;
  /** First ~13 chars (prefix + 4 hex). Stored in DB; used for UI display. */
  display:   string;
  createdAt: Date;
}

export interface KeyInfo {
  /** Masked display: `JaPa_pk_a1b2...` */
  display:    string;
  createdAt:  string;
  lastUsedAt: string | null;
}


//  Hashing 

function hashKey(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}


//  Mutating operations 

/**
 * Generate (or REGENERATE) the user's extension API key.
 *
 * Idempotent on userId  overwrites any prior row. Old keys stop working
 * the moment this returns. The user must save the returned `.plain`
 * value; we never store nor expose it again.
 */
export async function generateExtensionKey(userId: string): Promise<GeneratedKey> {
  const random = randomBytes(KEY_RANDOM_BYTES).toString("hex");
  const plain  = `${KEY_PREFIX}${random}`;
  const hash   = hashKey(plain);
  // Display = prefix + first 4 hex chars of the random tail (e.g. `JaPa_pk_a1b2`)
  const display = plain.slice(0, KEY_PREFIX.length + 4);

  const row = await prisma.extensionAccessKey.upsert({
    where:  { userId },
    update: {
      keyHash:    hash,
      keyPrefix:  display,
      createdAt:  new Date(),
      revokedAt:  null,
      lastUsedAt: null,
    },
    create: {
      userId,
      keyHash:   hash,
      keyPrefix: display,
    },
  });

  return { plain, display, createdAt: row.createdAt };
}

/** Revoke the user's key without issuing a new one. Used by an explicit
 *  "Revoke" button or as a side-effect of subscription downgrade. */
export async function revokeExtensionKey(userId: string): Promise<void> {
  await prisma.extensionAccessKey.updateMany({
    where: { userId, revokedAt: null },
    data:  { revokedAt: new Date() },
  });
}


//  Read operations 

/** Fetch the masked info to display on the Billing tab. Returns null when
 *  the user has no active key (never generated, or revoked). */
export async function getExtensionKeyInfo(userId: string): Promise<KeyInfo | null> {
  const row = await prisma.extensionAccessKey.findUnique({ where: { userId } });
  if (!row || row.revokedAt) return null;
  return {
    display:    `${row.keyPrefix}`,
    createdAt:  row.createdAt.toISOString(),
    lastUsedAt: row.lastUsedAt?.toISOString() ?? null,
  };
}

/**
 * Resolve a plain Bearer token to its userId. Returns null when:
 *   * The token doesn't start with KEY_PREFIX (not our format)
 *   * The hash doesn't match any row
 *   * The matched row is revoked
 *
 * Bumps `lastUsedAt` in the background (fire-and-forget so the request
 * isn't blocked on the write).
 */
export async function lookupExtensionKey(plain: string): Promise<string | null> {
  if (!plain.startsWith(KEY_PREFIX)) return null;

  const hash = hashKey(plain);
  const row  = await prisma.extensionAccessKey.findFirst({
    where:  { keyHash: hash, revokedAt: null },
    select: { id: true, userId: true },
  });
  if (!row) return null;

  // Best-effort lastUsedAt  don't await; the request shouldn't wait on a UI metric.
  prisma.extensionAccessKey
    .update({ where: { id: row.id }, data: { lastUsedAt: new Date() } })
    .catch(() => { /* metric write failed  non-fatal */ });

  return row.userId;
}

/** Cheap parse-time check used by the auth middleware to decide whether
 *  to call `lookupExtensionKey` or fall through to JWT verification. */
export function isExtensionApiKey(token: string): boolean {
  return token.startsWith(KEY_PREFIX);
}
