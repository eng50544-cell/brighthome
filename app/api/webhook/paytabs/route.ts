import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tran_ref, cart_id: orderId, payment_result, tran_total, payment_info } = body;
    if (!orderId) return NextResponse.json({ error: 'Missing cart_id' }, { status: 400 });
    await connectDB();
    const responseStatus = payment_result?.response_status;
    if (responseStatus === 'A') {
      await Order.findOneAndUpdate({ orderId }, { status: 'paid', 'payment.tranRef': tran_ref, 'payment.method': payment_info?.payment_method, 'payment.paidAt': new Date(), 'payment.responseStatus': responseStatus });
    } else if (['D', 'E', 'V'].includes(responseStatus)) {
      await Order.findOneAndUpdate({ orderId }, { status: 'cancelled', 'payment.responseStatus': responseStatus });
    }
    return NextResponse.json({ received: true, orderId, status: responseStatus });
  } catch (err) {
    console.error('[PayTabs Webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'PayTabs webhook active' });
}
