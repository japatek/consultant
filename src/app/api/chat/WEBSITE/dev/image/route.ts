import { handleGenerateImage } from "../../../../../../lib/chat/chat-route-handlers"


export async function POST(req: Request) {
  return handleGenerateImage(req, "WEBSITE", "anonymous");
}