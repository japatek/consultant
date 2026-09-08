// No "use server" here — these are plain functions, called from Server
// Components (the list* functions) or from the thin route handlers under
// app/api/admin (the upsert*/set*Active functions), never directly from a
// client component. Also: a "use server" file may only export async
// functions — the Zod schemas below are runtime values, which would have
// been invalid to export from a "use server" file anyway.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { asStringArray } from "@/lib/json";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (session.user.role !== "ADMIN") throw new Error("Admin access required");
  return session.user;
}

export const pricingPlanFormSchema = z.object({
  id: z.string().optional(), // present when editing, absent when creating
  slug: z.string().trim().min(2),
  name: z.string().trim().min(2),
  interval: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY"]),
  durationDays: z.number().int().positive(),
  priceIDR: z.number().int().nonnegative(),
  priceUSD: z.number().int().nonnegative(),
  features: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  // Static iPaymu Payment Link for this plan (create it by hand in the
  // iPaymu dashboard first) — e.g. https://ipaymu.link/pay/your-product-code
  paymentLinkUrl: z.string().url().nullable().optional(),
});
export type PricingPlanFormValues = z.infer<typeof pricingPlanFormSchema>;

export const discountFormSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .trim()
    .min(3)
    .transform((s) => s.toUpperCase()),
  percentOff: z.number().int().min(1).max(100).optional(),
  amountOffIDR: z.number().int().positive().optional(),
  planId: z.string().nullable().optional(), // null = every plan
  validUntil: z.string().datetime().nullable().optional(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
});
export type DiscountFormValues = z.infer<typeof discountFormSchema>;

/* -------------------------------------------------------------------------
 * Read types — what actually comes BACK from Prisma, which is not the same
 * shape as the Zod form schemas above:
 *   - `features` is a Prisma `Json` column (typed `JsonValue`), never a bare
 *     `string[]`, so it has to be narrowed at this boundary.
 *   - Nullable Prisma columns come back as `T | null`, while the form
 *     schemas use `.optional()` (`T | undefined`) since that's the right
 *     shape for "the admin left this field blank". Conflating the two was
 *     the actual bug — these types keep them separate on purpose.
 * ---------------------------------------------------------------------- */

export type PlanRecord = {
  id: string;
  slug: string;
  name: string;
  interval: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  durationDays: number;
  priceIDR: number;
  priceUSD: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
  paymentLinkUrl: string | null;
};
export type AdminPlanRow = PlanRecord & { _count: { subscriptions: number } };

export type DiscountRecord = {
  id: string;
  code: string;
  percentOff: number | null;
  amountOffIDR: number | null;
  planId: string | null;
  validFrom: Date;
  validUntil: Date | null;
  maxRedemptions: number | null;
  timesRedeemed: number;
  isActive: boolean;
  createdAt: Date;
};
export type AdminDiscountRow = DiscountRecord & { plan: { name: string } | null };

function toPlanRecord(plan: {
  id: string;
  slug: string;
  name: string;
  interval: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  durationDays: number;
  priceIDR: number;
  priceUSD: number;
  features: unknown;
  isActive: boolean;
  sortOrder: number;
  paymentLinkUrl: string | null;
}): PlanRecord {
  return { ...plan, features: asStringArray(plan.features) };
}

/** Every plan, including inactive ones — this is the admin view, unlike getActivePricingPlans. */
export async function listPricingPlansForAdmin(): Promise<AdminPlanRow[]> {
  await requireAdmin();
  const plans = await prisma.pricingPlan.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { subscriptions: true } } },
  });
  return plans.map((plan) => ({ ...toPlanRecord(plan), _count: plan._count }));
}

export async function upsertPricingPlan(values: PricingPlanFormValues): Promise<PlanRecord> {
  await requireAdmin();
  const data = pricingPlanFormSchema.parse(values);
  const { id, ...fields } = data;

  const plan = id
    ? await prisma.pricingPlan.update({ where: { id }, data: fields })
    : await prisma.pricingPlan.create({ data: fields });

  revalidatePath("/admin/marketing/pricing");
  revalidatePath("/pricing");
  return toPlanRecord(plan);
}

/** Plans are never deleted (subscriptions reference them) — retire with isActive: false instead. */
export async function setPricingPlanActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.pricingPlan.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/marketing/pricing");
  revalidatePath("/pricing");
}

export async function listDiscountsForAdmin(): Promise<AdminDiscountRow[]> {
  await requireAdmin();
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: { select: { name: true } } },
  });
  return discounts.map((discount) => ({ ...discount, plan: discount.plan }));
}

export async function upsertDiscount(values: DiscountFormValues): Promise<DiscountRecord> {
  await requireAdmin();
  const data = discountFormSchema.parse(values);
  const { id, ...fields } = data;

  const discount = id
    ? await prisma.discount.update({
        where: { id },
        data: { ...fields, validUntil: fields.validUntil ? new Date(fields.validUntil) : null },
      })
    : await prisma.discount.create({
        data: { ...fields, validUntil: fields.validUntil ? new Date(fields.validUntil) : null },
      });

  revalidatePath("/admin/marketing/pricing");
  return discount;
}

export async function setDiscountActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.discount.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/marketing/pricing");
}
