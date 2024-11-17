import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "*";
  const headers = corsHeaders(origin);

  return new NextResponse(null, { headers });
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const origin = request.headers.get("origin") || "*";
  const headers = corsHeaders(origin);
  const { productIds } = await request.json();

  if (!params.storeId) {
    return new NextResponse("Store ID is required", { status: 400 });
  }

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product IDs are required", { status: 400 });
  }

  let products;
  try {
    products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return new NextResponse("Database query failed", { status: 500 });
  }

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    products.map((product) => ({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: { name: product.name },
        unit_amount: product.price.toNumber() * 100,
      },
    }));

  let session;
  try {
    const order = await db.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: { id: productId },
            },
          })),
        },
      },
    });

    session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: { orderId: order.id },
    });
  } catch (error) {
    console.error("Stripe or Order Creation Error:", error);
    return new NextResponse("Error creating session or order", { status: 500 });
  }

  return new NextResponse(JSON.stringify({ url: session.url }), {
    headers,
  });
}
