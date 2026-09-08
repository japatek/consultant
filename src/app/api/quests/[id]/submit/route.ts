import { NextResponse } from "next/server";
import { submitQuestAnswers } from "../../../../(external)/admin/quest-builder/_lib/actions";
import { toErrorResponse } from "@/lib/api-error";

/** Body: an array of { questionId, answer } — one per question in the quest, submitted together. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await submitQuestAnswers(id, body);
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}
