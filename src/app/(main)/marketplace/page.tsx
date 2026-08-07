import { auth } from "@/lib/auth/auth"; // Your Auth.js v5 configuration
import { prisma } from "@/lib/database/prisma";
import { getToolsPaginated, getAllCategories } from "./_lib/marketplace-data";
import MarketplaceClient from "./marketplace";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
  }>;
}

export default async function MarketplacePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const currentCategory = resolvedParams?.category || "All";

  // 2. Fetch the logged-in user's Auth.js session
  const session = await auth();
  const currentUser = session?.user?.id && session?.user?.email
    ? { id: session.user.id, email: session.user.email }
    : null;

  // 3. Fetch active tool licenses for the logged-in user
  let userLicenses: Record<string, string> = {};
  
  if (currentUser?.id) {
    const activeLicenses = await prisma.license.findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
      },
      select: {
        toolId: true,
        licenseKey: true,
      },
    });

    // Map into key-value pairs: { [toolId]: licenseKey }
    userLicenses = activeLicenses.reduce((acc, lic) => {
      if (lic.licenseKey) {
        acc[lic.toolId] = lic.licenseKey;
      }
      return acc;
    }, {} as Record<string, string>);
  }

  // 4. Fetch tools & categories using your marketplace-data.ts helpers
  const [{ tools, totalPages }, categories] = await Promise.all([
    getToolsPaginated(currentPage, currentCategory),
    getAllCategories(),
  ]);

  // 5. Serialize Prisma objects (Dates -> Strings) to avoid Next.js client component boundary errors
  const serializedTools = tools.map((tool) => ({
    ...tool,
    createdAt: tool.createdAt.toISOString(),
    updatedAt: tool.updatedAt.toISOString(),
  }));

  // 6. Render the Interactive Client Component
  return (
    <MarketplaceClient
      initialTools={serializedTools}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      currentCategory={currentCategory}
      currentUser={currentUser}
      userLicenses={userLicenses}
    />
  );
}