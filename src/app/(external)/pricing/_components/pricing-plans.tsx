"use client";

import { Check, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

export type PricingPlanData = {
  id: string;
  slug: string;
  name: string;
  interval: "WEEKLY" | "MONTHLY" | "QUARTERLY";
  priceIDR: number;
  priceUSD: number;
  finalPriceIDR: number;
  discountCode: string | null;
  features: string[];
  paymentLinkUrl: string | null;
};

const IDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

/**
 * Fetch active plans in a Server Component (page) with
 * getActivePricingPlans() and pass them here as `plans`. Subscribing is a
 * plain link to the plan's static iPaymu Payment Link (created by hand in
 * the iPaymu dashboard, see PricingPlan.paymentLinkUrl) — there's no
 * dynamic checkout call to make, so there's nothing to load or await here.
 * The most expensive-duration plan (quarterly) gets the "Most Popular"
 * badge by default; swap the `highlightSlug` prop if you'd rather flag a
 * different one.
 */
export function PricingPlans({
  plans,
  currentPlanId,
  highlightSlug,
}: {
  plans: PricingPlanData[];
  currentPlanId?: string | null;
  highlightSlug?: string;
}) {
  const { t } = useLanguage();

  const intervalLabel: Record<PricingPlanData["interval"], string> = {
    WEEKLY: t.pricingPerWeek,
    MONTHLY: t.pricingPerMonth,
    QUARTERLY: t.pricingPerQuarter,
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t.pricingTitle}</h1>
        <p className="text-muted-foreground">{t.pricingSubtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isHighlighted = plan.slug === highlightSlug;
          const hasDiscount = plan.finalPriceIDR < plan.priceIDR;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-6",
                isHighlighted ? "border-primary shadow-sm" : "border-border"
              )}
            >
              {isHighlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {t.pricingMostPopular}
                </Badge>
              )}

              <h3 className="font-semibold">{plan.name}</h3>

              <div className="mt-2">
                {hasDiscount && (
                  <span className="mr-2 text-sm text-muted-foreground line-through">
                    {IDR.format(plan.priceIDR)}
                  </span>
                )}
                <span className="text-2xl font-semibold tabular-nums">
                  {IDR.format(plan.finalPriceIDR)}
                </span>
                <span className="text-sm text-muted-foreground"> {intervalLabel[plan.interval]}</span>
              </div>

              {plan.discountCode && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  {t.pricingHaveCode} {plan.discountCode}
                </p>
              )}

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="mt-6" variant={isHighlighted ? "default" : "outline"} disabled={isCurrent} asChild={!isCurrent}>
                {isCurrent ? (
                  <span>{t.pricingCurrentPlan}</span>
                ) : (
                  <a href={plan.paymentLinkUrl ?? "#"} target="_blank" rel="noreferrer">
                    {t.pricingSubscribe}
                  </a>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
