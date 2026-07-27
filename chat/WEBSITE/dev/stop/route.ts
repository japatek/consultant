import { handleStopStream } from "../../../../../../lib/chat/chat-route-handlers";

export async function POST(req: Request) {
  return handleStopStream(req, "WEBSITE", "anonymous");
}