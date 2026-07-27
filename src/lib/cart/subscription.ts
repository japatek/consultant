// Server-side subscription helpers  used by /api/subscription/* routes and
// (eventually) by feature gates that need to read the user's current tier.

import { prisma } from "../database/prisma";

export const PERIOD_DAYS = {
  DAY:   1,
  WEEK:  7,
  MONTH: 30,
  YEAR:  365,
} as const;

type Period = keyof typeof PERIOD_DAYS;
type Tier   = "FREE" | "PERSONAL" | "ENTERPRISE";
type Status = "ACTIVE" | "CANCELLED" | "EXPIRED" | "PENDING";

export interface SubscriptionDTO {
  tier:          Tier;
  status:        Status;
  billingPeriod: Period | null;
  startedAt:     string | null;
  expiresAt:     string | null;
  cancelledAt:   string | null;
}

const FREE_DEFAULT: SubscriptionDTO = {
  tier:          "FREE",
  status:        "ACTIVE",
  billingPeriod: null,
  startedAt:     null,
  expiresAt:     null,
  cancelledAt:   null,
};

// Admin accounts are ALWAYS treated as Pro (PERSONAL), regardless of any
// Subscription row  admins shouldn't have to buy a plan to use the
// product. Synthetic DTO returned for them.
const ADMIN_PRO_DEFAULT: SubscriptionDTO = {
  tier:          "PERSONAL",
  status:        "ACTIVE",
  billingPeriod: null,
  startedAt:     null,
  expiresAt:     null,
  cancelledAt:   null,
};

/** Admin email allowlist. Server-side var preferred; falls back to the
 *  NEXT_PUBLIC_ one so a single setting works in dev. Comma-separated. */
function adminEmailSet(): Set<string> {
  const raw =
    process.env.ADMIN_PAYMENT_EMAIL ??
    process.env.NEXT_PUBLIC_ADMIN_PAYMENT_EMAIL ??
    "";
  return new Set(
    raw.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  );
}

/**
 * Returns the user's current subscription. Falls back to FREE if there's no row.
 * Auto-marks expired rows as EXPIRED on read so we don't grant features past expiry.
 *
 * Admin emails (ADMIN_PAYMENT_EMAIL) are forced to PERSONAL/ACTIVE so the
 * admin account always behaves as Pro.
 */
export async function getUserSubscription(userId: string): Promise<SubscriptionDTO> {
  // Single query: pull the user's email + their subscription relation so we
  // can apply the admin override without a second round-trip.
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { email: true, subscription: true },
  });

  if (user && adminEmailSet().has(user.email.toLowerCase())) {
    return ADMIN_PRO_DEFAULT;
  }

  const row = user?.subscription ?? null;
  if (!row) return FREE_DEFAULT;

  let status: Status = row.status as Status;
  if (status === "ACTIVE" && row.expiresAt && row.expiresAt < new Date()) {
    status = "EXPIRED";
    await prisma.subscription.update({
      where: { userId },
      data:  { status: "EXPIRED" },
    });
  }

  // If expired or cancelled, expose as FREE-tier for gating purposes
  // (DB row stays so we keep history).
  const effectiveTier: Tier = status === "ACTIVE" ? (row.tier as Tier) : "FREE";

  return {
    tier:          effectiveTier,
    status,
    billingPeriod: row.billingPeriod as Period | null,
    startedAt:     row.startedAt.toISOString(),
    expiresAt:     row.expiresAt?.toISOString() ?? null,
    cancelledAt:   row.cancelledAt?.toISOString() ?? null,
  };
}

/**
 * Upserts a subscription row, computing `expiresAt` from `startedAt + period`.
 * Real payment integration (Stripe/Midtrans) goes BEFORE calling this  once
 * payment succeeds, this writes the active subscription.
 */
export async function applySubscription(
  userId: string,
  tier: Tier,
  period: Period,
): Promise<SubscriptionDTO> {
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + PERIOD_DAYS[period] * 24 * 60 * 60 * 1000);

  const row = await prisma.subscription.upsert({
    where:  { userId },
    update: {
      tier,
      billingPeriod: period,
      status:        "ACTIVE",
      startedAt,
      expiresAt,
      cancelledAt:   null,
    },
    create: {
      userId,
      tier,
      billingPeriod: period,
      status:        "ACTIVE",
      startedAt,
      expiresAt,
    },
  });

  return {
    tier:          row.tier as Tier,
    status:        row.status as Status,
    billingPeriod: row.billingPeriod as Period | null,
    startedAt:     row.startedAt.toISOString(),
    expiresAt:     row.expiresAt?.toISOString() ?? null,
    cancelledAt:   row.cancelledAt?.toISOString() ?? null,
  };
}

export async function cancelSubscription(userId: string): Promise<SubscriptionDTO | null> {
  const row = await prisma.subscription.findUnique({ where: { userId } });
  if (!row) return null;

  const updated = await prisma.subscription.update({
    where: { userId },
    data:  { status: "CANCELLED", cancelledAt: new Date() },
  });

  return {
    tier:          updated.tier as Tier,
    status:        updated.status as Status,
    billingPeriod: updated.billingPeriod as Period | null,
    startedAt:     updated.startedAt.toISOString(),
    expiresAt:     updated.expiresAt?.toISOString() ?? null,
    cancelledAt:   updated.cancelledAt?.toISOString() ?? null,
  };
}

/**
 * Idempotently finalize a paid Payment + activate its Subscription. Wraps
 * everything in a single Prisma transaction so a failure rolls back cleanly.
 *
 * Designed to be called from a payment-provider webhook. Safe to call multiple
 * times for the same paymentId (no-ops once status === SUCCEEDED).
 */
export async function finalizePayment(paymentId: string, externalId: string): Promise<{ activated: boolean }> {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where:  { id: paymentId },
      select: {
        id: true,
        status: true,
        subscriptionId: true,
        subscription: { select: { userId: true, tier: true, billingPeriod: true } },
      },
    });

    if (!payment)                         return { activated: false };
    if (payment.status === "SUCCEEDED")   return { activated: false }; // already done

    await tx.payment.update({
      where: { id: payment.id },
      data:  { status: "SUCCEEDED", externalId },
    });

    if (payment.subscription.tier === "FREE" || !payment.subscription.billingPeriod) {
      return { activated: false };
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + PERIOD_DAYS[payment.subscription.billingPeriod as Period] * 24 * 60 * 60 * 1000);

    await tx.subscription.update({
      where: { userId: payment.subscriptionId },
      data:  {
        status:      "ACTIVE",
        startedAt,
        expiresAt,
        cancelledAt: null,
      },
    });

    return { activated: true };
  });
}

/** Mark a payment as FAILED (idempotent). Used by webhook handlers and timeout reapers. */
export async function markPaymentFailed(paymentId: string, externalId?: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where:  { id: paymentId },
      select: { id: true, status: true, subscriptionId: true },
    });
    if (!payment || payment.status === "FAILED" || payment.status === "REFUNDED") return;

    await tx.payment.update({
      where: { id: payment.id },
      data:  {
        status:     "FAILED",
        externalId: externalId ?? undefined,
      },
    });
    await tx.subscription.update({
      where: { userId: payment.subscriptionId },
      data:  { status: "CANCELLED" },
    });
  });
}

