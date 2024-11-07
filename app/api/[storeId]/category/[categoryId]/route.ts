import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("category Id is required", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_GET_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
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
      return new NextResponse("Name and Billboard Id are required", {
        status: 400,
      });
    }

    if (!params.categoryId) {
      return new NextResponse("category Id is required", { status: 400 });
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

    const category = await db.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[Categories_PATCH_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const category = await db.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_DELETE_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
