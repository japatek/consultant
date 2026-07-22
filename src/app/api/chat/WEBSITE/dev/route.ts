// GET /api/chat/website/[id]   fetch one session + its messages
//
// Delegates to the shared handler with platform="WEBSITE". The handler
// 403s if the session belongs to a different user.

import { handleGetSession } from "../../../../../lib/chat/chat-route-handlers";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  return handleGetSession(req, "WEBSITE", id);
}
