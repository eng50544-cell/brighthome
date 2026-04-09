import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const cartId = body.cart_id;
  const tranStatus = body.payment_result?.response_status;
  if (!cartId) return NextResponse.json({ error: "Invalid callback" }, { status: 400 });
  const newStatus = tranStatus === "A" ? "paid" : "pending";
  await Order.findByIdAndUpdate(cartId, { status: newStatus, paymentRef: body.tran_ref, updatedAt: new Date() });
  return NextResponse.json({ success: true });
}
