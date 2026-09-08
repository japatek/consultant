import { NextResponse } from "next/server";
import { createQuest } from "../../(external)/admin/quest-builder/_lib/actions";
import { toErrorResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quest = await createQuest(body);
    return NextResponse.json(quest, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
