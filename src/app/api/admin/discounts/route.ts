import { NextResponse } from "next/server";
import { upsertDiscount } from "@/actions/admin-pricing-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const discount = await upsertDiscount(body);
    return NextResponse.json(discount, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
