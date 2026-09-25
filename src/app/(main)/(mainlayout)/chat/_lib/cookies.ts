import "server-only"
import { cookies } from "next/headers"
import { cache } from "react"
import type { ChatPreferences } from "./types"

export const PREFS_COOKIE = "japatek-chat-prefs"

const defaults: ChatPreferences = {
  model: "gpt-4o",
  activeSessionId: "1",
  isArtifactOpen: false,
}

export const getChatPreferences = cache(async (): Promise<ChatPreferences> => {
  const store = await cookies()
  const raw = store.get(PREFS_COOKIE)?.value
  if (!raw) return defaults
  try {
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return defaults
  }
})