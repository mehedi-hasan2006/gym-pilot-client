import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { sessionData } from "@/lib/session/session";

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const user = await sessionData();

    const body = await req.json();

    const lineObj = {
      price_data: {
        currency: "usd",
        unit_amount: Number(body?.price) * 100,
        product_data: {
          name: body?.className,
        },
      },
      quantity: 1,
    };

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [lineObj],
      metadata: {
        userId: user?.id,
        email: user?.email,
        name: user?.name,
        classId: body?.classId,
        className: body?.className,
        price: body?.price,
      },
      mode: "payment",
      success_url: `${origin}/all-classes/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
