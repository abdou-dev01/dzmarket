import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("product Id is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        size: true,
        color: true,
        images: true,
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_GET_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId) {
      return new NextResponse("product Id is required", { status: 400 });
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

    console.log("heellloo");

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        sizeId,
        colorId,
        categoryId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isFeatured,
        isArchived,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user?.id) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("product Id is required", { status: 400 });
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

    const product = await db.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
