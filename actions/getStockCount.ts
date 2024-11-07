import { db } from "@/lib/db";

export default async function getStockCount(storeId: string) {
  const stockCount = await db.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return stockCount;
}
