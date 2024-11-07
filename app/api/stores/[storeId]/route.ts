import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const store = await db.store.updateMany({
      where: {
        userId: user.id,
        id: params.storeId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STOREID_PATCH_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const store = await db.store.delete({
      where: {
        userId: user.id,
        id: params.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STOREID_DELET_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
