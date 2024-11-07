import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const { label, imageUrl } = body;
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("Label and Image are required", { status: 400 });
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

    const billboard = await db.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_POST_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[BILLBOARD_GET_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
