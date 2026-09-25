import "server-only"
import { cache } from "react"
import { prisma } from "../../../../../lib/database/prisma"
import { auth } from "../../../../../lib/auth/auth"
import type { ChatSession } from "./types"

async function fetchSessions(): Promise<ChatSession[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const chats = await prisma.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, pinned: true }
  })

  return chats.map(chat => ({
    id: chat.id,
    title: chat.title || "New Conversation",
    pinned: chat.pinned
  }))
}

// react cache() dedupes calls within a single request 
export const getSessions = cache(fetchSessions)