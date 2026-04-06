import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const status = params.get('STATUS') || params.get('status');
    const cartId = params.get('CARTID') || params.get('cart_id');
    const transactionId = params.get('TRANID') || params.get('tran_id');
    const telrRef = params.get('REF') || params.get('ref');
    const amount = params.get('AMOUNT') || params.get('amount');

    console.log('[Telr Webhook]', { status, cartId, transactionId });

    if (!cartId) {
      return NextResponse.json({ error: 'Missing cart ID' }, { status: 400 });
    }

    await connectDB();

    if (status === '3' || status === 'A' || status === 'authorised') {
      // Payment successful
      await Order.findOneAndUpdate(
        { orderId: cartId },
        {
          status: 'paid',
          'payment.transactionId': transactionId,
          'payment.telrRef': telrRef,
          'payment.paidAt': new Date(),
        }
      );

      console.log(`[Telr] Order ${cartId} paid — transaction ${transactionId}`);

      // Send confirmation email (if SendGrid configured)
      try {
        const order = await Order.findOne({ orderId: cartId });
        if (order) {
          await fetch(`${process.env.DOMAIN}/api/email/confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: cartId, email: order.customer.email }),
          });
        }
      } catch (e) {
        console.error('Email send error:', e);
      }
    } else if (status === '2' || status === 'D' || status === 'declined') {
      await Order.findOneAndUpdate({ orderId: cartId }, { status: 'cancelled' });
      console.log(`[Telr] Order ${cartId} declined`);
    }

    return NextResponse.json({ received: true, cartId, status });
  } catch (error) {
    console.error('[Telr Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Telr may also send GET requests for status checks
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'webhook active', service: 'BrightHome' });
}
