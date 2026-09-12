import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/database/prisma";
import { QuestInteractiveClient } from "./_components/quest-client";

// Menangani params sebagai Promise untuk kompatibilitas Next.js terbaru
type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function QuestPage({ params }: PageProps) {
  // 1. Ekstrak 'id' dengan aman (mendukung Next.js 14 & 15)
  const resolvedParams = await params;
  const questId = resolvedParams.id;

  // 2. Ambil data dari database
  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      media: true,
    },
  });

  // 3. Kembalikan 404 HANYA jika ID quest benar-benar tidak ditemukan di database
  if (!quest) {
    return notFound();
  }

  // Jika questions masih kosong, berikan array kosong standar agar halaman tetap terbuka
  // dan klien tidak crash.
  const safeQuest = {
    ...quest,
    questions: quest.questions || [],
    media: quest.media || []
  };

  return <QuestInteractiveClient quest={safeQuest} />;
}