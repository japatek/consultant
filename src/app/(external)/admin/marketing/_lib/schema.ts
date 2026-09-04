import { z } from "zod";

export const pricingPlanFormSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2),
  name: z.string().trim().min(2),
  interval: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY"]),
  durationDays: z.number().int().positive(),
  priceIDR: z.number().int().nonnegative(),
  priceUSD: z.number().int().nonnegative(),
  features: z.array(z.string().trim().min(1)).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
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
  planId: z.string().nullable().optional(), 
  validUntil: z.string().datetime().nullable().optional(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().default(true),
});
export type DiscountFormValues = z.infer<typeof discountFormSchema>;

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