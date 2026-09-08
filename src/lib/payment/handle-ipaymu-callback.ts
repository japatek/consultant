import { prisma } from "@/lib/database/prisma";
import {
  normalizeIpaymuCallback,
  verifyIpaymuSignature,
  type IpaymuCallbackRaw,
} from "./ipaymu";

export class InvalidIpaymuSignatureError extends Error {
  constructor() {
    super("iPaymu callback signature did not match");
  }
}

/**
 * Reconciliation strategy — read this before changing anything below.
 *
 * We're using a static iPaymu Payment Link per plan (created by hand in the
 * iPaymu dashboard, pasted into PricingPlan.paymentLinkUrl), not the
 * dynamic Redirect/Direct API. That means, unlike the old Midtrans flow,
 * there is no `referenceId` we control and no PENDING Subscription row
 * created before the user pays — they just click a plain link. So instead
 * of looking up an existing row by order id, this handler matches:
 *
 *   1. User by buyer_email (must match the account's login email)
 *   2. PricingPlan by amount paid (must match a plan's priceIDR exactly)
 *
 * and only then creates the Subscription. If either match fails, we log
 * and return `handled: false` rather than throwing — the payment still
 * went through on iPaymu's side, it just needs a human to reconcile it
 * (check server logs for "iPaymu callback unmatched").
 *
 * If you outgrow this, iPaymu's dynamic Redirect API supports a
 * `referenceId` field you control, which removes the ambiguity entirely —
 * see lib/payment/ipaymu.ts's header comment.
 */
export async function handleIpaymuCallback(raw: IpaymuCallbackRaw, signatureHeader: string | null) {
  const normalized = normalizeIpaymuCallback(raw);

  if (!signatureHeader || !verifyIpaymuSignature(normalized, signatureHeader)) {
    throw new InvalidIpaymuSignatureError();
  }

  // Idempotency: iPaymu retries until it gets a 200, so a trx_id we've
  // already recorded means "already processed, just re-acknowledge".
  const existing = await prisma.subscription.findUnique({
    where: { ipaymuTrxId: String(normalized.trx_id) },
  });
  if (existing) return { handled: true as const, alreadyProcessed: true as const };

  // status_code 1 = paid/settled (see ipaymu.ts). Anything else (pending,
  // expired, failed) has nothing to reconcile yet.
  if (normalized.status_code !== 1) {
    return { handled: true as const, skipped: "not a successful payment" as const };
  }

  const amountPaidIDR = Math.round(Number(normalized.amount ?? normalized.total ?? 0));
  const buyerEmail = normalized.buyer_email?.trim().toLowerCase();

  const [user, plan] = await Promise.all([
    buyerEmail ? prisma.user.findUnique({ where: { email: buyerEmail } }) : null,
    prisma.pricingPlan.findFirst({ where: { isActive: true, priceIDR: amountPaidIDR } }),
  ]);

  if (!user || !plan) {
    console.error(
      `iPaymu callback unmatched — trx_id=${normalized.trx_id} amount=${amountPaidIDR} ` +
        `buyer_email=${buyerEmail ?? "(none)"} userFound=${!!user} planFound=${!!plan}`
    );
    return { handled: false as const, reason: "no matching user/plan" as const };
  }

  const now = new Date();
  const endDate = new Date(now.getTime() + plan.durationDays * 86_400_000);

  await prisma.$transaction([
    prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: "ACTIVE",
        startDate: now,
        endDate,
        ipaymuTrxId: String(normalized.trx_id),
        ipaymuReferenceId: normalized.reference_id ?? null,
        amountPaidIDR,
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { currentTier: plan.slug, tierExpiresAt: endDate },
    }),
  ]);

  return { handled: true as const, userId: user.id, planId: plan.id };
}
