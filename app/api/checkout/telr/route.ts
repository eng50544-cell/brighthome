import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, total, customer } = body;

    const subtotal = items.reduce((s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 7.99;
    const tax = subtotal * 0.08;
    const calculatedTotal = subtotal + shipping + tax;

    const orderId = `BH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Save pending order
    await connectDB();
    const order = new Order({
      orderId,
      customer,
      items,
      subtotal,
      shipping,
      tax,
      discount: 0,
      total: calculatedTotal,
      status: 'pending',
      payment: { provider: 'telr' },
    });
    await order.save();

    // Initialize Telr payment
    const merchantId = process.env.TELR_MERCHANT_ID;
    const apiKey = process.env.TELR_API_KEY;
    const domain = process.env.DOMAIN || 'https://brighthouse.website';

    if (!merchantId || !apiKey) {
      // Development mode: skip to success
      return NextResponse.json({
        orderId,
        paymentUrl: null,
        status: 'success_dev',
        message: 'Development mode — configure TELR_MERCHANT_ID and TELR_API_KEY in .env.local',
      });
    }

    const telrPayload = {
      method: 'create',
      store: parseInt(merchantId),
      authkey: apiKey,
      order: {
        cartid: orderId,
        test: process.env.NODE_ENV === 'development' ? 1 : 0,
        amount: calculatedTotal.toFixed(2),
        currency: 'USD',
        description: `BrightHome Order ${orderId}`,
      },
      return: {
        authorised: `${domain}/success?orderId=${orderId}`,
        declined: `${domain}/checkout?error=declined`,
        cancelled: `${domain}/checkout?error=cancelled`,
      },
    };

    const telrRes = await fetch('https://secure.telr.com/gateway/order.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telrPayload),
    });

    const telrData = await telrRes.json();

    if (telrData.order?.url) {
      // Save Telr ref
      await Order.findOneAndUpdate({ orderId }, { 'payment.telrRef': telrData.order.ref });

      return NextResponse.json({
        orderId,
        paymentUrl: telrData.order.url,
        telrRef: telrData.order.ref,
      });
    } else {
      throw new Error(telrData.error?.message || 'Telr payment initialization failed');
    }
  } catch (error) {
    console.error('Checkout/Telr error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
