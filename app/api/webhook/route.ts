import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;
  const addressComponent = [
    address?.city,
    address?.country,
    address?.line1,
    address?.line2,
    address?.postal_code,
    address?.state,
  ];
  const addressString = addressComponent
    .filter((address) => address !== null)
    .join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await db.order.update({
      where: {
        id: session.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await db.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
