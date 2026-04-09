import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function runDeliveryConfirmation() {
  await connectDB();

  const shippedOrders = await Order.find({
    status: "shipped",
    shippedAt: { $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
  }).limit(20);

  const results = [];

  for (const order of shippedOrders) {
    await Order.findByIdAndUpdate(order._id, {
      status: "delivered",
      deliveredAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await sgMail.send({
        to: order.email,
        from: process.env.ADMIN_EMAIL!,
        subject: "Your BrightHome order has been delivered!",
        html: `<h2>Order Delivered!</h2><p>Hi ${order.firstName},</p><p>Your order has been marked as delivered. We hope you love your purchase!</p><p>If you have any issues, please contact us at ${process.env.ADMIN_EMAIL}.</p>`,
      });
    } catch (e) { console.error("Email error:", e); }
    results.push(order._id);
  }

  console.log(`[Agent6] Confirmed delivery for ${results.length} orders`);
  return { delivered: results.length };
}

if (require.main === module) {
  runDeliveryConfirmation().then(console.log).catch(console.error).finally(() => process.exit());
}
