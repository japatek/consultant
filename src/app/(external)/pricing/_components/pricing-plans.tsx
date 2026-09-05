"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import { createSubscriptionCheckout } from "../_lib/billing-actions";
import { Label } from "@/components/ui/label";

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
          const { redirectUrl } = await createSubscriptionCheckout(planId, discountCode || undefined);
          
          if (redirectUrl) {
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
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8">
      
      {/* HEADER SECTION */}
      <div className="mx-auto max-w-3xl text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t.pricingTitle}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t.pricingSubtitle}
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 items-center">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const isHighlighted = plan.slug === highlightSlug;
          const hasDiscount = plan.finalPriceIDR < plan.priceIDR;

          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-8 transition-all duration-300",
                isHighlighted 
                  ? "border-transparent bg-background shadow-2xl ring-2 ring-[var(--royal-blue)] lg:scale-105 z-10" 
                  : "border-border shadow-sm hover:border-primary/30 hover:shadow-md"
              )}
            >
              {isHighlighted && (
                <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary border-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                  {t.pricingMostPopular}
                </Badge>
              )}

              <h3 className="text-xl font-bold">{plan.name}</h3>

              <div className="mt-4 flex flex-col gap-1">
                {hasDiscount && (
                  <span className="text-sm font-medium text-muted-foreground line-through decoration-destructive/50">
                    {IDR.format(plan.priceIDR)}
                  </span>
                )}
                <div className="flex items-baseline text-4xl font-extrabold tracking-tight text-foreground">
                  {IDR.format(plan.finalPriceIDR)}
                  <span className="ml-1.5 text-base font-medium text-muted-foreground">
                    / {intervalLabel[plan.interval]}
                  </span>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="my-6 h-px w-full bg-border" />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-[var(--teal)]/10 p-1">
                      <Check className="h-4 w-4 shrink-0 text-[var(--teal)]" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "mt-8 w-full rounded-xl py-6 font-bold transition-all",
                  isHighlighted 
                    ? "bg-gradient-primary text-white border-0 hover:opacity-90 shadow-md hover:shadow-lg" 
                    : "variant-outline"
                )}
                variant={isHighlighted ? "default" : "outline"}
                disabled={isCurrent || (isPending && checkingOutPlanId === plan.id)}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isPending && checkingOutPlanId === plan.id && (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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

      {/* DISCOUNT CODE SECTION */}
      <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-muted/30 p-6">
        <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Tag className="h-4 w-4" />
          {t.pricingHaveCode}
        </Label>
        <Input
          className="rounded-xl text-center font-mono text-lg uppercase tracking-wider"
          placeholder="ENTER CODE"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
        />
        {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}
      </div>
    </div>
  );
}