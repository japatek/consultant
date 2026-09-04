import { listPricingPlansForAdmin, listDiscountsForAdmin } from "./_lib/actions";
import { PricingAdminPanel } from "./_components/pricing-admin-panel";
export default async function Page() {
  const [plans, discounts] = await Promise.all([listPricingPlansForAdmin(), listDiscountsForAdmin()]);
  return <PricingAdminPanel initialPlans={plans} initialDiscounts={discounts} />;
}