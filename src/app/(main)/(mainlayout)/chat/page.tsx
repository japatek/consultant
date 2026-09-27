import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth/auth";
import { prisma } from "../../../../lib/database/prisma";
import { getChatPreferences } from "./_lib/cookies";

export default async function ChatIndexPage() {
  // 1. Dapatkan informasi akun pengguna yang sedang login
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/auth/v4/login");
  }

  // 2. Ambil preferensi dari Cookies (activeSessionId)
  const prefs = await getChatPreferences();

  // 3. Ambil riwayat chat pengguna dari Database, urutkan dari yang terbaru
  const chatSessions = await prisma.chatSession.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }, // Asumsi Anda memiliki field createdAt
    select: { id: true }
  });

  // 4. Logika Penentuan Target Redirect
  let targetId = null;

  if (chatSessions.length > 0) {
    // Periksa apakah ID dari cookie masih valid (belum dihapus dari database)
    const isCookieIdValid = chatSessions.some(chat => chat.id === prefs.activeSessionId);
    
    if (isCookieIdValid && prefs.activeSessionId) {
      // Jika valid, gunakan ID dari cookie (sesi terakhir yang dibuka)
      targetId = prefs.activeSessionId;
    } else {
      // Jika cookie kosong atau ID tidak valid, gunakan chat paling baru (index 0)
      targetId = chatSessions[0].id;
    }
  }

  // 5. Eksekusi Redirect
  if (targetId) {
    // Arahkan ke sesi chat terakhir
    redirect(`/chat/${targetId}`);
  } else {
    // Jika database benar-benar kosong (pengguna baru), arahkan ke pembuatan chat baru
    redirect(`/chat/new`);
  }
}