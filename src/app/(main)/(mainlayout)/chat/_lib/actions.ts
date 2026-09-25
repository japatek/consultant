"use server"

import { cookies } from "next/headers"
import { revalidateTag, revalidatePath } from "next/cache"
import { nanoid } from "nanoid"
import { PREFS_COOKIE } from "./cookies"
import type { ChatPreferences, ChatSession } from "./types"
import { prisma } from "../../../../../lib/database/prisma"
import { auth } from "../../../../../lib/auth/auth"

export async function saveChatPreferences(patch: Partial<ChatPreferences>) {
  const store = await cookies()
  const raw = store.get(PREFS_COOKIE)?.value
  const current = raw ? JSON.parse(raw) : {}
  store.set(PREFS_COOKIE, JSON.stringify({ ...current, ...patch }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}

export async function createChatSession(title: string): Promise<ChatSession> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const newChat = await prisma.chatSession.create({
    data: {
      id: nanoid(10),
      userId: session.user.id,
      title,
      pinned: false,
    },
    select: { id: true, title: true, pinned: true }
  })
  
  revalidatePath("/chat")
  return { id: newChat.id, title: newChat.title || "New Chat", pinned: newChat.pinned }
}

export async function updateChatSession(id: string, patch: { title?: string; pinned?: boolean }): Promise<ChatSession> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const updatedChat = await prisma.chatSession.update({
    where: { id, userId: session.user.id },
    data: patch,
    select: { id: true, title: true, pinned: true }
  })

  revalidatePath("/chat")
  return { id: updatedChat.id, title: updatedChat.title || "Chat", pinned: updatedChat.pinned }
}

export async function deleteChatSession(id: string): Promise<void> {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  await prisma.chatSession.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/chat")
}