import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const sgKey = process.env.SENDGRID_API_KEY;
    if (!sgKey) {
      console.log(`[Newsletter] New subscriber: ${email}`);
      return NextResponse.json({ success: true, message: 'Subscribed!' });
    }

    // Add to SendGrid contact list
    await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sgKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: [{ email, custom_fields: { store: 'BrightHome' } }],
      }),
    });

    // Welcome email
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'hello@brighthouse.website', name: 'BrightHome' },
        subject: '🏠 Welcome to BrightHome! Here\'s 10% off your first order',
        content: [{
          type: 'text/html',
          value: `<div style="font-family:Arial;background:#0F0F1A;color:#C0C0C0;padding:40px;max-width:600px">
<h1 style="color:#D4AF37">Welcome to BrightHome! ✨</h1>
<p>Thank you for subscribing! Here's your exclusive welcome coupon:</p>
<div style="background:#D4AF37;color:#0F0F1A;padding:20px;border-radius:12px;text-align:center;margin:20px 0">
  <h2 style="margin:0;font-size:32px">BRIGHT10</h2>
  <p style="margin:4px 0">10% off your first order</p>
</div>
<p>Discover our premium lighting collection at <a href="https://brighthouse.website" style="color:#D4AF37">brighthouse.website</a></p>
</div>`,
        }],
      }),
    });

    return NextResponse.json({ success: true, message: 'Subscribed! Check your email.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
