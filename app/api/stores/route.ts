import { auth } from "@/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await request.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) return new NextResponse("Name is required", { status: 400 });

    const store = await db.store.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("STORES_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await request.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) return new NextResponse("Name is required", { status: 400 });

    const store = await db.store.create({ data: { name, userId } });

    return NextResponse.json(store);
  } catch (error) {
    console.log("STORES_ROUTE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
