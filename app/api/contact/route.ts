import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const sgKey = process.env.SENDGRID_API_KEY;
    if (!sgKey) {
      console.log(`[Contact] New message from ${email}: ${message}`);
      return NextResponse.json({ success: true });
    }

    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: process.env.ADMIN_EMAIL || 'eng50544@gmail.com' }] }],
        from: { email: process.env.STORE_EMAIL || 'hello@brighthouse.website', name: 'BrightHome Contact' },
        reply_to: { email, name },
        subject: `[BrightHome Contact] ${subject || 'New message'} — from ${name}`,
        content: [{
          type: 'text/html',
          value: `<div style="font-family:Arial;padding:20px">
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>`,
        }],
      }),
    });

    // Auto-reply to customer
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalizations: [{ to: [{ email, name }] }],
        from: { email: process.env.STORE_EMAIL || 'hello@brighthouse.website', name: 'BrightHome' },
        subject: 'We received your message — BrightHome',
        content: [{
          type: 'text/html',
          value: `<div style="font-family:Arial;background:#0F0F1A;color:#C0C0C0;padding:40px;max-width:600px">
            <h2 style="color:#D4AF37">Hi ${name}!</h2>
            <p>Thank you for reaching out to BrightHome. We've received your message and will respond within <strong>24 hours</strong>.</p>
            <div style="background:#1C1C2E;padding:16px;border-radius:8px;margin:16px 0">
              <p style="margin:0;color:#708090;font-size:12px">Your message:</p>
              <p style="margin:8px 0 0">${message}</p>
            </div>
            <p style="color:#708090;font-size:12px">BrightHome Team · <a href="${process.env.DOMAIN}" style="color:#D4AF37">${process.env.DOMAIN}</a></p>
          </div>`,
        }],
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact API]', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
