import { cookies } from "next/headers"
import { getSessions } from "../_lib/data"
import { getChatPreferences } from "../_lib/cookies"
import { ChatShell } from "../_components/chat-shell"
import { translations, type Language } from "../../../../../translate/language-data"
import { prisma } from "../../../../../lib/database/prisma" // Pastikan import Prisma Anda benar

export default async function ChatPage({ params }: { params: Promise<{ id?: string }> }) {
  const cookieStore = await cookies()
  const resolvedParams = await params;
  
  // Deteksi apakah ini route chat baru atau membuka riwayat lama
  const isNewChat = !resolvedParams?.id || resolvedParams.id === "new";
  const sessionId = isNewChat ? null : resolvedParams.id;

  const [sessions, preferences] = await Promise.all([
    getSessions(), 
    getChatPreferences()
  ])

  // Fetch riwayat pesan dari database jika ini adalah sesi chat lama
  let initialMessages: any[] = [];
  if (sessionId) {
    const chatRecords = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" }
    });
    
    // Mapping format Prisma ke format yang dimengerti Vercel AI SDK
    initialMessages = chatRecords.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content
    }));
  }

  const lang = (cookieStore.get("language")?.value as Language) || "en"
  const welcomeTitle = lang === "id" ? "Selamat datang di Chat JaPaTek" : "Welcome to the JaPaTek chat"
  const welcomeDesc = lang === "id" ? "Mulai percakapan baru atau pilih riwayat chat Anda di sidebar." : "Start a new conversation or select your chat history in the sidebar."

  return (
    <ChatShell
      initialSessions={sessions}
      initialModel={preferences.model}
      initialActiveSessionId={sessionId}
      initialMessages={initialMessages} // 👈 PENTING: Oper data ini ke ChatShell
      initialArtifactOpen={preferences.isArtifactOpen}
      lang={lang}
      welcomeTitle={welcomeTitle}
      welcomeDesc={welcomeDesc}
    />
  )
}