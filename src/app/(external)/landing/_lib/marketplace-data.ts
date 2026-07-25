import { prisma } from "@/lib/database/prisma";

const ITEMS_PER_PAGE = 33;

export async function getToolsPaginated(page: number = 1, category: string = "All") {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  const whereClause = category === "All" ? {} : { category };

  const [tools, totalCount] = await Promise.all([
    prisma.tool.findMany({
      where: whereClause,
      skip: skip,
      take: ITEMS_PER_PAGE,
      orderBy: { name: "asc" },
    }),
    prisma.tool.count({
      where: whereClause,
    }),
  ]);

  return {
    tools,
    totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getAllCategories() {
  const categories = await prisma.tool.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return ["All", ...categories.map((c) => c.category)];
}