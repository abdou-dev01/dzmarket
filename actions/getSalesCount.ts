import { db } from "@/lib/db";

export default async function getSalesCount(storeId: string) {
  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
}
