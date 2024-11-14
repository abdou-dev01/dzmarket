import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const { name, billboardId } = body;
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !billboardId) {
      return new NextResponse("Name and billboard Id are required", {
        status: 400,
      });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const category = await db.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
