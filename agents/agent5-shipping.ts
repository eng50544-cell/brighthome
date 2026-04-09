import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function runShipping() {
  await connectDB();

  const processingOrders = await Order.find({ status: "processing" }).limit(20);
  const results = [];

  for (const order of processingOrders) {
    const trackingNumber = `BH${Date.now().toString().slice(-8)}`;
    await Order.findByIdAndUpdate(order._id, {
      status: "shipped",
      trackingNumber,
      shippedAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await sgMail.send({
        to: order.email,
        from: process.env.ADMIN_EMAIL!,
        subject: `Your BrightHome order has shipped! Tracking: ${trackingNumber}`,
        html: `<h2>Your Order Has Shipped!</h2><p>Hi ${order.firstName},</p><p>Your order is on its way.</p><p><strong>Tracking:</strong> ${trackingNumber}</p><p>Estimated delivery: 3-7 business days.</p>`,
      });
    } catch (e) { console.error("Email error:", e); }
    results.push(order._id);
  }

  console.log(`[Agent5] Shipped ${results.length} orders`);
  return { shipped: results.length };
}

if (require.main === module) {
  runShipping().then(console.log).catch(console.error).finally(() => process.exit());
}
