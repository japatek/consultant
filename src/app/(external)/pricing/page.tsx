import { getActivePricingPlans, getMySubscription } from "@/app/(external)/pricing/_lib/billing-actions";
import { PricingPlans } from "@/app/(external)/pricing/_components/pricing-plans";
export default async function Page() {
  const [plans, subscription] = await Promise.all([getActivePricingPlans(), getMySubscription()]);
  return <PricingPlans plans={plans} currentPlanId={subscription?.planId} />;
}