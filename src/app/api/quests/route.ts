import { NextResponse } from "next/server";
import { createQuest } from "@/actions/quest-actions";
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
