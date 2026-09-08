import { NextResponse } from "next/server";
import { upsertCertification } from "@/lib/certificate/admin-certification-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const certification = await upsertCertification(body);
    return NextResponse.json(certification, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
