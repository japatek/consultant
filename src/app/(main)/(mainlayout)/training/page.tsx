import { prisma } from "../../../../lib/database/prisma"; // Adjust path if your prisma singleton is elsewhere
import { TaskTableClient } from "../_components/task-table-client";

export default async function TaskTablePage() {
  // Fetch quests (tasks) directly from the database
  // You can add `where: { isPublished: true }` if you only want to show published ones
  const quests = await prisma.quest.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      category: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <TaskTableClient quests={quests} />;
}