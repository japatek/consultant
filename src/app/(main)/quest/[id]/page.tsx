import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/database/prisma";
import { QuestInteractiveClient } from "./_components/quest-client";

export default async function QuestPage({ params }: { params: { id: string } }) {
  // Fetch the quest along with its ordered questions and media
  const quest = await prisma.quest.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
      media: true,
    },
  });

  if (!quest || quest.questions.length === 0) {
    return notFound();
  }

  return <QuestInteractiveClient quest={quest} />;
}