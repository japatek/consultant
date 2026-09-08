import { NextResponse } from "next/server";
import { updateQuest } from "@/lib/quest/quest-actions";
import { toErrorResponse } from "@/lib/api-error";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const quest = await updateQuest(id, body);
    return NextResponse.json(quest);
  } catch (error) {
    return toErrorResponse(error);
  }
}
