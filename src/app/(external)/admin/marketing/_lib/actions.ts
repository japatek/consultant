'use server'

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth-admin";
import { prisma } from "@/lib/database/prisma";
import { asStringArray } from "./json";
import { 
  pricingPlanFormSchema, 
  discountFormSchema, 
  type PricingPlanFormValues, 
  type DiscountFormValues,
  type PlanRecord,
  type AdminPlanRow,
  type DiscountRecord,
  type AdminDiscountRow
} from "./schema"; 

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  if (session.user.role !== "ADMIN") throw new Error("Admin access required");
  return session.user;
}

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
}): PlanRecord {
  return { ...plan, features: asStringArray(plan.features) };
}

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