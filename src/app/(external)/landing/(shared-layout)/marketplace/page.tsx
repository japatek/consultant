import { getToolsPaginated, getAllCategories } from "../../_lib/marketplace-data";
import MarketplaceClient from "../../_components/marketplace";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  const currentCategory = resolvedParams?.category || "All";

  const { tools, totalPages } = await getToolsPaginated(currentPage, currentCategory);
  const categories = await getAllCategories();

  return (
    <MarketplaceClient
      initialTools={tools}
      categories={categories}
      totalPages={totalPages}
      currentPage={currentPage}
      currentCategory={currentCategory}
    />
  );
}