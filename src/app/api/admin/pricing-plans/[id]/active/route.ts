import { NextResponse } from "next/server";
import { setPricingPlanActive } from "@/actions/admin-pricing-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();
    await setPricingPlanActive(id, Boolean(isActive));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
