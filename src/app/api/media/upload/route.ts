import { NextResponse } from "next/server";
import { uploadMediaFile } from "@/lib/quest/quest-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const folder = formData.get("folder");
    const uploaded = await uploadMediaFile(
      formData,
      folder === "answer-files" ? "answer-files" : "quest-media"
    );
    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
