import { db } from "@/lib/db";
import { format } from "date-fns";
import CategoryClient from "./CategoryClient";
import { CategoriesColumns } from "./Columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoriesColumns[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,
      createdAt: format(category.createdAt, "MMMM do, yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
