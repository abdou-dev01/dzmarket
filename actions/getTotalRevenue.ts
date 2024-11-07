import { db } from "@/lib/db";

export default async function getTotalRevenue(storeId: string) {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const totlaRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((total, orderItem) => {
      return total + orderItem.product.price.toNumber();
    }, 0);
    return total + orderTotal;
  }, 0);

  return totlaRevenue;
}
