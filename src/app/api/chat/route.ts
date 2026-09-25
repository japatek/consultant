import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { streamText, convertToCoreMessages } from "ai"
import { prisma } from "@/lib/database/prisma"
import { auth } from "@/lib/auth/auth"

export async function POST(req: Request) {
  const { messages, id: sessionId, modelId } = await req.json()
  
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Simpan pesan User ke Database
  const lastMessage = messages[messages.length - 1]
  if (sessionId) {
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: lastMessage.role,
        content: lastMessage.content,
      }
    })
  }

  // Pilih provider model (OpenAI vs Anthropic)
  const isAnthropic = modelId?.includes("claude")
  const aiModel = isAnthropic ? anthropic(modelId) : openai(modelId || "gpt-4o")

  const result = await streamText({
    model: aiModel,
    messages: convertToCoreMessages(messages),
    system: "You are a helpful and highly skilled engineering AI assistant from JaPaTek.",
    async onFinish({ text }) {
      // Simpan balasan AI ke Database setelah streaming selesai
      if (sessionId) {
        await prisma.chatMessage.create({
          data: {
            sessionId,
            role: "assistant",
            content: text,
          }
        })
      }
    }
  })

  return result.toDataStreamResponse()
}