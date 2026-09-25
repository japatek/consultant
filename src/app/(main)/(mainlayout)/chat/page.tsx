import { getSessions } from "./_lib/data"
import { getChatPreferences } from "./_lib/cookies"
import { ChatShell } from "./_components/chat-shell"

export default async function ChatPage() {
  const [sessions, preferences] = await Promise.all([getSessions(), getChatPreferences()])

  return (
    <ChatShell
      initialSessions={sessions}
      initialModel={preferences.model}
      initialActiveSessionId={preferences.activeSessionId}
      initialArtifactOpen={preferences.isArtifactOpen}
    />
  )
}