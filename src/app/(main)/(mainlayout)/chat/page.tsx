import { cookies } from "next/headers"
import { getSessions } from "./_lib/data"
import { getChatPreferences } from "./_lib/cookies"
import { ChatShell } from "./_components/chat-shell"
import { translations, type Language } from "../../../../translate/language-data"

export default async function ChatPage() {
  // 1. Ambil data sesi, preferensi, dan cookies secara paralel
  const cookieStore = await cookies()
  const [sessions, preferences] = await Promise.all([
    getSessions(), 
    getChatPreferences()
  ])

  // 2. Deteksi bahasa dari cookies (default ke 'en' jika tidak ada)
  const lang = (cookieStore.get("language")?.value as Language) || "en"
  
  // Jika Anda sudah menambahkan terjemahan ini di language-data.ts, Anda bisa memanggilnya via t.chatWelcome
  // Jika belum, ini adalah fallback manualnya:
  const welcomeTitle = lang === "id" ? "Selamat datang di Chat JaPaTek" : "Welcome to the JaPaTek chat"
  const welcomeDesc = lang === "id" ? "Mulai percakapan baru atau pilih riwayat chat Anda di sidebar." : "Start a new conversation or select your chat history in the sidebar."

  return (
    <ChatShell
      initialSessions={sessions}
      initialModel={preferences.model}
      
      // Memaksa null agar halaman /chat SELALU menjadi halaman "New Chat" kosong.
      // Saat user mengirim pesan dari state ini, aksi di dalam ChatShell akan
      // men-generate ID baru di database dan me-redirect ke /chat/[id].
      initialActiveSessionId={null} 
      
      initialArtifactOpen={preferences.isArtifactOpen}
      
      // Teruskan data bahasa dan pesan sambutan ke komponen Client (ChatShell)
      lang={lang}
      welcomeTitle={welcomeTitle}
      welcomeDesc={welcomeDesc}
    />
  )
}