import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      price,
      isArchived,
      isFeatured,
      categoryId,
      colorId,
      sizeId,
      images,
    } = body;
    const session = await auth();
    const user = session?.user;

    console.log("from route", body);

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("CategoryId is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("ColorId is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("SizeId is required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images areS required", { status: 400 });
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

    const product = await db.product.create({
      data: {
        name,
        price,
        colorId,
        sizeId,
        categoryId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("storeId is required", { status: 400 });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        sizeId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        size: true,
        color: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET_ROUTE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
