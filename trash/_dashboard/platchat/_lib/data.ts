import "server-only"
import { cache } from "react"
import { unstable_cache } from "next/cache"
import type { ChatSession } from "./types"

// Replace with a real DB/API call. Tagged so createChatSession() can invalidate it.
async function fetchSessions(): Promise<ChatSession[]> {
  return [
    { id: "1", title: "Dijkstra's Algorithm", pinned: true },
    { id: "2", title: "React Hooks Architecture", pinned: false },
  ]
}

const cachedFetchSessions = unstable_cache(fetchSessions, ["chat-sessions"], {
  tags: ["chat-sessions"],
  revalidate: 60,
})

// react cache() dedupes calls within a single request (e.g. layout + page both reading sessions)
export const getSessions = cache(cachedFetchSessions)