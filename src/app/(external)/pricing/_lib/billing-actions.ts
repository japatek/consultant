"use server";

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { asStringArray } from "@/lib/json";
import { createIpaymuTransaction } from "./payment";

/** Pricing page data — every active plan, cheapest-first, with any live discount applied. */
export async function getActivePricingPlans() {
  const plans = await prisma.pricingPlan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      discounts: {
        where: {
          isActive: true,
          validFrom: { lte: new Date() },
          OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }],
        },
      },
    },
  });

  return plans.map((plan) => {
    const bestDiscount = plan.discounts.reduce<(typeof plan.discounts)[number] | null>(
      (best, d) => {
        const discountValue = d.percentOff ? (plan.priceIDR * d.percentOff) / 100 : d.amountOffIDR ?? 0;
        const bestValue = best
          ? best.percentOff
            ? (plan.priceIDR * best.percentOff) / 100
            : best.amountOffIDR ?? 0
          : -1;
        return discountValue > bestValue ? d : best;
      },
      null
    );

    const discountAmountIDR = bestDiscount
      ? bestDiscount.percentOff
        ? Math.round((plan.priceIDR * bestDiscount.percentOff) / 100)
        : bestDiscount.amountOffIDR ?? 0
      : 0;

    return {
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
      interval: plan.interval,
      priceIDR: plan.priceIDR,
      priceUSD: plan.priceUSD,
      finalPriceIDR: Math.max(0, plan.priceIDR - discountAmountIDR),
      discountCode: bestDiscount?.code ?? null,
      features: asStringArray(plan.features),
    };
  });
}

/** The current user's active/most-recent subscription, or null if they've never subscribed. */
export async function getMySubscription() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { plan: true },
  });
}

/**
 * Starts a checkout: creates a PENDING Subscription row (so the webhook has
 * something to update by order_id) and returns the iPaymu session URL.
 */
export async function createSubscriptionCheckout(planId: string, discountCode?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const plan = await prisma.pricingPlan.findUniqueOrThrow({ where: { id: planId } });

  let amountIDR = plan.priceIDR;
  if (discountCode) {
    const discount = await prisma.discount.findFirst({
      where: {
        code: discountCode,
        isActive: true,
        OR: [{ planId: null }, { planId: plan.id }],
        validFrom: { lte: new Date() },
        AND: { OR: [{ validUntil: null }, { validUntil: { gte: new Date() } }] },
      },
    });
    if (discount) {
      const off = discount.percentOff
        ? Math.round((plan.priceIDR * discount.percentOff) / 100)
        : discount.amountOffIDR ?? 0;
      amountIDR = Math.max(0, plan.priceIDR - off);
      await prisma.discount.update({
        where: { id: discount.id },
        data: { timesRedeemed: { increment: 1 } },
      });
    }
  }

  // Generate Reference ID
  const orderId = `JPT-${plan.slug}-${Date.now()}-${session.user.id.slice(0, 6)}`;

  await prisma.subscription.create({
    data: {
      userId: session.user.id,
      planId: plan.id,
      // Tetap menggunakan kolom 'midtransOrderId' agar tidak merusak schema Prisma Anda,
      // tetapi isinya diisi dengan orderId/referenceId untuk iPaymu. 
      // (Jika Anda mengubah nama kolom di schema, sesuaikan bagian ini).
      midtransOrderId: orderId, 
      amountPaidIDR: amountIDR,
      discountCodeUsed: discountCode ?? null,
      status: "PENDING",
    },
  });

  // Call iPaymu API
  const { sessionId, redirectUrl } = await createIpaymuTransaction({
    orderId,
    grossAmountIDR: amountIDR,
    customer: {
      name: session.user.name ?? "JaPaTek Member",
      email: session.user.email!,
      phone: "080000000000", // iPaymu seringkali mewajibkan nomor HP. Isi default jika tidak ada di DB.
    },
    itemName: `JaPaTek ${plan.name} Subscription`,
  });

  return { sessionId, redirectUrl };
}