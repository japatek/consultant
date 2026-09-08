import { NextResponse } from "next/server";
import { setDiscountActive } from "@/lib/admin-pricing-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isActive } = await request.json();
    await setDiscountActive(id, Boolean(isActive));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
