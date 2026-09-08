import { NextResponse } from "next/server";
import { uploadCertificationBadge } from "@/lib/certificate/admin-certification-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploaded = await uploadCertificationBadge(formData);
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
