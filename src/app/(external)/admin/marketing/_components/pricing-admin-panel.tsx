"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/hooks/use-language";
import {
  upsertPricingPlan,
  setPricingPlanActive,
  upsertDiscount,
  setDiscountActive,
} from "../_lib/actions";
import {type PricingPlanFormValues,
  type DiscountFormValues,
  type AdminPlanRow,
  type AdminDiscountRow,
} from "../_lib/schema"

const IDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

// AdminPlanRow / AdminDiscountRow now live in admin-pricing-actions.ts,
// shaped to match what Prisma actually returns (Json features narrowed to
// string[], nullable columns as `T | null`) rather than reusing the Zod
// form types — see the comment there for why that distinction matters.

export function PricingAdminPanel({
  initialPlans,
  initialDiscounts,
}: {
  initialPlans: AdminPlanRow[];
  initialDiscounts: AdminDiscountRow[];
}) {
  const { t } = useLanguage();
  const [plans, setPlans] = useState(initialPlans);
  const [discounts, setDiscounts] = useState(initialDiscounts);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t.adminPricingTitle}</h1>
        <p className="text-muted-foreground">{t.adminPricingSubtitle}</p>
      </div>

      <PlansSection plans={plans} setPlans={setPlans} t={t} />
      <DiscountsSection discounts={discounts} setDiscounts={setDiscounts} plans={plans} t={t} />
    </div>
  );
}

type T = ReturnType<typeof useLanguage>["t"];

function PlansSection({
  plans,
  setPlans,
  t,
}: {
  plans: AdminPlanRow[];
  setPlans: React.Dispatch<React.SetStateAction<AdminPlanRow[]>>;
  t: T;
}) {
  const [editing, setEditing] = useState<AdminPlanRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }
  function openEdit(plan: AdminPlanRow) {
    setEditing(plan);
    setDialogOpen(true);
  }
  function handleSaved(plan: AdminPlanRow) {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === plan.id);
      return exists ? prev.map((p) => (p.id === plan.id ? { ...p, ...plan } : p)) : [...prev, plan];
    });
    setDialogOpen(false);
  }
  function toggleActive(plan: AdminPlanRow) {
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p)));
    setPricingPlanActive(plan.id, !plan.isActive);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t.pricingTitle}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              {t.adminAddPlan}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <PlanForm t={t} initialValues={editing ?? undefined} onSaved={handleSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.questFieldTitle}</TableHead>
            <TableHead>IDR</TableHead>
            <TableHead>USD</TableHead>
            <TableHead>{t.adminActive}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell>{IDR.format(plan.priceIDR)}</TableCell>
              <TableCell>${plan.priceUSD}</TableCell>
              <TableCell>
                <Switch checked={plan.isActive} onCheckedChange={() => toggleActive(plan)} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

function PlanForm({
  t,
  initialValues,
  onSaved,
}: {
  t: T;
  initialValues?: AdminPlanRow;
  onSaved: (plan: AdminPlanRow) => void;
}) {
  const [values, setValues] = useState<PricingPlanFormValues>(
    initialValues ?? {
      slug: "",
      name: "",
      interval: "MONTHLY",
      durationDays: 30,
      priceIDR: 0,
      priceUSD: 0,
      features: [],
      isActive: true,
      sortOrder: 0,
    }
  );
  const [featuresText, setFeaturesText] = useState(values.features.join("\n"));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    // startTransition's callback must return void, not a Promise — the
    // async work runs in an IIFE inside it instead of being returned directly.
    startTransition(() => {
      void (async () => {
        try {
          const payload = {
            ...values,
            id: initialValues?.id,
            features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
          };
          const saved = await upsertPricingPlan(payload);
          onSaved({ ...saved, _count: initialValues?._count ?? { subscriptions: 0 } });
        } catch (err) {
          setError(err instanceof Error ? err.message : t.questSaveError);
        }
      })();
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialValues ? t.adminEditPlan : t.adminAddPlan}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t.questFieldTitle}</Label>
            <Input value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={values.slug} onChange={(e) => setValues((v) => ({ ...v, slug: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Interval</Label>
            <Select
              value={values.interval}
              onValueChange={(v) =>
                setValues((s) => ({ ...s, interval: v as PricingPlanFormValues["interval"] }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration (days)</Label>
            <Input
              type="number"
              value={values.durationDays}
              onChange={(e) => setValues((v) => ({ ...v, durationDays: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={values.sortOrder}
              onChange={(e) => setValues((v) => ({ ...v, sortOrder: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Price (IDR)</Label>
            <Input
              type="number"
              value={values.priceIDR}
              onChange={(e) => setValues((v) => ({ ...v, priceIDR: Number(e.target.value) }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Price (USD)</Label>
            <Input
              type="number"
              value={values.priceUSD}
              onChange={(e) => setValues((v) => ({ ...v, priceUSD: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Features (one per line)</Label>
          <textarea
            className="min-h-24 w-full rounded-md border bg-transparent p-2 text-sm"
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button onClick={save} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.adminSave}
        </Button>
      </DialogFooter>
    </>
  );
}

function DiscountsSection({
  discounts,
  setDiscounts,
  plans,
  t,
}: {
  discounts: AdminDiscountRow[];
  setDiscounts: React.Dispatch<React.SetStateAction<AdminDiscountRow[]>>;
  plans: AdminPlanRow[];
  t: T;
}) {
  const [editing, setEditing] = useState<AdminDiscountRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleSaved(discount: AdminDiscountRow) {
    setDiscounts((prev) => {
      const exists = prev.some((d) => d.id === discount.id);
      return exists
        ? prev.map((d) => (d.id === discount.id ? { ...d, ...discount } : d))
        : [...prev, discount];
    });
    setDialogOpen(false);
  }
  function toggleActive(discount: AdminDiscountRow) {
    setDiscounts((prev) =>
      prev.map((d) => (d.id === discount.id ? { ...d, isActive: !d.isActive } : d))
    );
    setDiscountActive(discount.id, !discount.isActive);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t.pricingHaveCode}</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              {t.adminAddDiscount}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DiscountForm t={t} plans={plans} initialValues={editing ?? undefined} onSaved={handleSaved} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Off</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>{t.adminRedemptions}</TableHead>
            <TableHead>{t.adminActive}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {discounts.map((discount) => (
            <TableRow key={discount.id}>
              <TableCell className="font-mono font-medium">{discount.code}</TableCell>
              <TableCell>
                {discount.percentOff ? `${discount.percentOff}%` : IDR.format(discount.amountOffIDR ?? 0)}
              </TableCell>
              <TableCell>{discount.plan?.name ?? <Badge variant="secondary">All plans</Badge>}</TableCell>
              <TableCell>
                {discount.timesRedeemed}
                {discount.maxRedemptions ? ` / ${discount.maxRedemptions}` : ""}
              </TableCell>
              <TableCell>
                <Switch checked={discount.isActive} onCheckedChange={() => toggleActive(discount)} />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditing(discount);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

/**
 * `AdminDiscountRow` (Prisma-shaped: `null`, `Date`) and `DiscountFormValues`
 * (Zod-shaped: `undefined`, ISO string) are deliberately different types —
 * this is the one place that converts between them, when seeding the form's
 * local state from an existing row.
 */
function toFormValues(row?: AdminDiscountRow): DiscountFormValues {
  if (!row) {
    return {
      code: "",
      percentOff: 10,
      amountOffIDR: undefined,
      planId: null,
      validUntil: null,
      maxRedemptions: null,
      isActive: true,
    };
  }
  return {
    id: row.id,
    code: row.code,
    percentOff: row.percentOff ?? undefined,
    amountOffIDR: row.amountOffIDR ?? undefined,
    planId: row.planId,
    validUntil: row.validUntil ? row.validUntil.toISOString() : null,
    maxRedemptions: row.maxRedemptions,
    isActive: row.isActive,
  };
}

function DiscountForm({
  t,
  plans,
  initialValues,
  onSaved,
}: {
  t: T;
  plans: AdminPlanRow[];
  initialValues?: AdminDiscountRow;
  onSaved: (discount: AdminDiscountRow) => void;
}) {
  const [values, setValues] = useState<DiscountFormValues>(toFormValues(initialValues));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    // startTransition's callback must return void, not a Promise — the
    // async work runs in an IIFE inside it instead of being returned directly.
    startTransition(() => {
      void (async () => {
        try {
          const saved = await upsertDiscount({ ...values, id: initialValues?.id });
          onSaved({ ...saved, plan: plans.find((p) => p.id === saved.planId) ?? null });
        } catch (err) {
          setError(err instanceof Error ? err.message : t.questSaveError);
        }
      })();
    });
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialValues ? t.adminEditDiscount : t.adminAddDiscount}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label>Code</Label>
          <Input
            className="font-mono uppercase"
            value={values.code}
            onChange={(e) => setValues((v) => ({ ...v, code: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Percent off</Label>
            <Input
              type="number"
              value={values.percentOff ?? ""}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  percentOff: e.target.value === "" ? undefined : Number(e.target.value),
                  amountOffIDR: undefined,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Amount off (IDR)</Label>
            <Input
              type="number"
              value={values.amountOffIDR ?? ""}
              onChange={(e) =>
                setValues((v) => ({
                  ...v,
                  amountOffIDR: e.target.value === "" ? undefined : Number(e.target.value),
                  percentOff: undefined,
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Applies to</Label>
          <Select
            value={values.planId ?? "ALL"}
            onValueChange={(v) => setValues((s) => ({ ...s, planId: v === "ALL" ? null : v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All plans</SelectItem>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max redemptions (optional)</Label>
          <Input
            type="number"
            value={values.maxRedemptions ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                maxRedemptions: e.target.value === "" ? null : Number(e.target.value),
              }))
            }
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <DialogFooter>
        <Button onClick={save} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.adminSave}
        </Button>
      </DialogFooter>
    </>
  );
}
