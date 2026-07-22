// POST /api/chat/website/[id]/messages   send a user message, get an LLM reply
//
// Delegates to handlePostMessage with platform="WEBSITE". The shared
// handler:
//   * verifies session ownership
//   * consumes the user's tier-based RPM allowance
//   * persists the USER message
//   * builds the prompt: SYSTEM_PROMPTS.WEBSITE + recent messages
//   * forwards to Flask, persists the ASSISTANT reply
//   * returns { userMessage, aiMessage }
//
// Platform-specific context (e.g. autofill formFields for BROWSER_EXT,
// doc selection for OFFICE_EXT, code context for VSCODE_EXT) belongs
// AROUND this call  preprocess the request, then call into the shared
// handler, then post-process the response.

import { handlePostMessage } from "../../../../../../lib/chat/chat-route-handlers";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;
  return handlePostMessage(req, "WEBSITE", id);
}
