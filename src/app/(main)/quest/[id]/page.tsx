import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/database/prisma";
import { QuestInteractiveClient } from "./_components/quest-client";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function QuestPage({ params }: PageProps) {

  const resolvedParams = await params;
  const questId = resolvedParams.id;


  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      media: true,
    },
  });

  if (!quest) {
    return notFound();
  }

  const safeQuest = {
    ...quest,
    questions: quest.questions || [],
    media: quest.media || []
  };

  return <QuestInteractiveClient quest={safeQuest} />;
}