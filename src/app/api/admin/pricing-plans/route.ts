import { NextResponse } from "next/server";
import { upsertPricingPlan } from "@/lib/billing/admin-pricing-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = await upsertPricingPlan(body);
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
