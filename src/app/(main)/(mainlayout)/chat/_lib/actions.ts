"use server"

import { cookies } from "next/headers"
import { revalidateTag } from "next/cache"
import { PREFS_COOKIE } from "./cookies"
import type { ChatPreferences, ChatSession } from "./types"

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
  // Replace with a real DB insert.
  const session: ChatSession = { id: crypto.randomUUID(), title, pinned: false }
  revalidateTag("chat-sessions", "max")
  return session
}