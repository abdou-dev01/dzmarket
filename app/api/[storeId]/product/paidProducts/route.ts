import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: user?.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const paidProducts = await db.order.findMany({
      where: {
        storeId: params.storeId,
        isPaid: true,
      },
      include: {
        orderItems: true,
      },
    });

    return NextResponse.json(paidProducts);
  } catch (error) {
    console.log("[PAID_PRODUCTS_GET_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
