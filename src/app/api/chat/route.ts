// GET  /api/chat/website   list sessions for the authenticated user
// POST /api/chat/website   create a new session
//
// Both delegate to the shared handlers in @/lib/chat-route-handlers
// with platform="WEBSITE". RBAC (Free/Pro/Admin) is enforced by
// withPlatformGuard inside those handlers.

import { handleListSessions, handleCreateSession } from "../../../lib/chat/chat-route-handlers";

export async function GET(req: Request) {
  return handleListSessions(req, "WEBSITE");
}

export async function POST(req: Request) {
  return handleCreateSession(req, "WEBSITE");
}
