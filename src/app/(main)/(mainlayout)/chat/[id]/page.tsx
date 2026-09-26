import { cookies } from "next/headers"
import { getSessions } from "../_lib/data"
import { getChatPreferences } from "../_lib/cookies"
import { ChatShell } from "../_components/chat-shell"
import { translations, type Language } from "../../../../../translate/language-data"
import { prisma } from "../../../../../lib/database/prisma" 

export default async function ChatPage({ params }: { params: Promise<{ id?: string }> }) {
  const cookieStore = await cookies()
  const resolvedParams = await params;
  
  const sessionId = (resolvedParams?.id && resolvedParams.id !== "new") 
    ? resolvedParams.id 
    : null;

  const [sessions, preferences] = await Promise.all([
    getSessions(), 
    getChatPreferences()
  ])

  let initialMessages: any[] = [];
  
  if (sessionId) {
    try {
      const chatRecords = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" }
      });
      
      // Pengaman agar tidak crash jika chatRecords undefined
      initialMessages = (chatRecords || []).map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content
      }));
    } catch (error) {
      console.error("Gagal mengambil pesan:", error);
      initialMessages = []; // Fallback aman
    }
  }

  const lang = (cookieStore.get("language")?.value as Language) || "en"
  const welcomeTitle = lang === "id" ? "Selamat datang di Chat JaPaTek" : "Welcome to the JaPaTek chat"
  const welcomeDesc = lang === "id" ? "Mulai percakapan baru atau pilih riwayat chat Anda di sidebar." : "Start a new conversation or select your chat history in the sidebar."

  return (
    <ChatShell
      key={sessionId || "new-chat"} 
      initialSessions={sessions || []}
      initialModel={preferences?.model || "gpt-4o"}
      initialActiveSessionId={sessionId}
      initialMessages={initialMessages}
      initialArtifactOpen={preferences?.isArtifactOpen || false}
      lang={lang}
      welcomeTitle={welcomeTitle}
      welcomeDesc={welcomeDesc}
    />
  )
}