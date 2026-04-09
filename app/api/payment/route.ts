import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  await connectDB();

  const { orderId } = await req.json();

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // PayTabs payment initiation
  const profileId = process.env.PAYTABS_PROFILE_ID;
  const serverKey = process.env.PAYTABS_SERVER_KEY;
  const endpoint = process.env.PAYTABS_REGION_ENDPOINT || "https://secure.paytabs.com";

  if (!profileId || !serverKey) {
    // Dev mode - simulate payment
    await Order.findByIdAndUpdate(orderId, { status: "paid", updatedAt: new Date() });
    return NextResponse.json({ success: true, redirect: `/track-order?id=${orderId}` });
  }

  try {
    const res = await fetch(`${endpoint}/payment/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: serverKey,
      },
      body: JSON.stringify({
        profile_id: profileId,
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: orderId,
        cart_currency: "USD",
        cart_amount: order.totalAmount,
        cart_description: `BrightHome Order #${orderId}`,
        customer_details: {
          name: `${order.firstName} ${order.lastName}`,
          email: order.email,
          phone: order.phone,
          street1: order.address,
          city: order.city,
          country: order.country,
          zip: order.zip,
        },
        return: `${process.env.DOMAIN}/track-order?id=${orderId}`,
        callback: `${process.env.DOMAIN}/api/payment/callback`,
      }),
    });

    const data = await res.json();
    if (data.redirect_url) {
      return NextResponse.json({ redirect: data.redirect_url });
    }
    return NextResponse.json({ error: "Payment gateway error" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
