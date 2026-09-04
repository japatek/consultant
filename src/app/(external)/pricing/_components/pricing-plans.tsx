"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { createSubscriptionCheckout } from "../_lib/billing-actions";

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
};

const IDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

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
  const [discountCode, setDiscountCode] = useState("");
  const [checkingOutPlanId, setCheckingOutPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const intervalLabel: Record<PricingPlanData["interval"], string> = {
    WEEKLY: t.pricingPerWeek,
    MONTHLY: t.pricingPerMonth,
    QUARTERLY: t.pricingPerQuarter,
  };

  function handleSubscribe(planId: string) {
    setError(null);
    setCheckingOutPlanId(planId);
    
    startTransition(() => {
      void (async () => {
        try {
          // Destructure redirectUrl directly from your iPaymu action
          const { redirectUrl } = await createSubscriptionCheckout(planId, discountCode || undefined);
          
          if (redirectUrl) {
            // Redirect the user to the iPaymu payment gateway
            window.location.href = redirectUrl;
          } else {
            throw new Error("Missing redirect URL");
          }
        } catch {
          setError(t.pricingError);
          setCheckingOutPlanId(null);
        }
      })();
    });
  }

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

              <ul className="mt-4 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="mt-6"
                variant={isHighlighted ? "default" : "outline"}
                disabled={isCurrent || (isPending && checkingOutPlanId === plan.id)}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isPending && checkingOutPlanId === plan.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCurrent
                  ? t.pricingCurrentPlan
                  : isPending && checkingOutPlanId === plan.id
                    ? t.pricingProcessing
                    : t.pricingSubscribe}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mx-auto flex max-w-sm items-center gap-2">
        <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          placeholder={t.pricingHaveCode}
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
      </div>

      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}