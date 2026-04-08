import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

const PAYTABS_ENDPOINT = process.env.PAYTABS_REGION_ENDPOINT
  ? `${process.env.PAYTABS_REGION_ENDPOINT}/payment/request`
  : 'https://secure.paytabs.com/payment/request';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, customer, couponDiscount = 0 } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // ── Calculate ──
    const subtotal = items.reduce(
      (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0
    );
    const shipping = subtotal >= 50 ? 0 : 7.99;
    const total    = parseFloat((subtotal + shipping - couponDiscount).toFixed(2));

    // ── Order ID ──
    const orderId = `BH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const domain  = process.env.DOMAIN || 'https://brighthouse.website';
    const custName = `${customer.firstName} ${customer.lastName}`;

    // ── Save pending order ──
    try {
      await connectDB();
      await new Order({
        orderId,
        customer: {
          name:    custName,
          email:   customer.email,
          phone:   customer.phone,
          address: customer.address,
          city:    customer.city,
          country: customer.country,
          zip:     customer.zip || '',
        },
        items: items.map((i: { id?: string; name: string; price: number; quantity: number; image: string }) => ({
          productId: i.id || '',
          name:      i.name,
          price:     i.price,
          quantity:  i.quantity,
          image:     i.image,
        })),
        subtotal,
        shipping,
        tax: 0,
        discount: couponDiscount,
        total,
        status: 'pending',
        payment: { provider: 'paytabs' },
      }).save();
    } catch (dbErr) {
      console.log('[PayTabs] DB save failed, continuing:', dbErr);
    }

    // ── Check credentials ──
    const profileId = process.env.PAYTABS_PROFILE_ID;
    const serverKey = process.env.PAYTABS_SERVER_KEY;

    if (!profileId || !serverKey) {
      console.warn('[PayTabs] No credentials — dev mode bypass');
      return NextResponse.json({
        orderId,
        devMode: true,
        redirectUrl: `${domain}/success?orderId=${orderId}`,
        message: 'PayTabs not configured. Set PAYTABS_PROFILE_ID & PAYTABS_SERVER_KEY in .env.local',
      });
    }

    // ── Build PayTabs request ──
    const payTabsPayload = {
      profile_id:       parseInt(profileId),
      tran_type:        'sale',
      tran_class:       'ecom',
      cart_id:          orderId,
      cart_currency:    'USD',
      cart_amount:      total,
      cart_description: `BrightHome Order ${orderId}`,
      payment_methods:  ['creditcard', 'mada', 'apple_pay'],

      customer_details: {
        name: custName, email: customer.email, phone: customer.phone || '',
        street1: customer.address, city: customer.city, state: customer.city,
        country: customer.country || 'IQ', zip: customer.zip || '00000',
      },
      shipping_details: {
        name: custName, email: customer.email, phone: customer.phone || '',
        street1: customer.address, city: customer.city, state: customer.city,
        country: customer.country || 'IQ', zip: customer.zip || '00000',
      },

      callback:   `${domain}/api/webhook/paytabs`,
      return_url: `${domain}/success?orderId=${orderId}`,
      hide_shipping:  false,
      framed:         false,
      show_save_card: false,
    };

    // ── Call PayTabs API ──
    const ptRes = await fetch(PAYTABS_ENDPOINT, {
      method: 'POST',
      headers: { 'Authorization': serverKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payTabsPayload),
    });

    const ptData = await ptRes.json();
    console.log('[PayTabs] Response:', JSON.stringify(ptData, null, 2));

    if (ptData.redirect_url) {
      try {
        await Order.findOneAndUpdate({ orderId }, { 'payment.tranRef': ptData.tran_ref });
      } catch { /* ignore */ }
      return NextResponse.json({ orderId, redirectUrl: ptData.redirect_url, tranRef: ptData.tran_ref });
    }

    console.error('[PayTabs] Error:', ptData);
    return NextResponse.json({ error: ptData.message || 'Payment initialization failed', details: ptData }, { status: 400 });

  } catch (err) {
    console.error('[PayTabs] Fatal:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
