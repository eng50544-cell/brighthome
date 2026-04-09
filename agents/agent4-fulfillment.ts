import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function runOrderFulfillment() {
  await connectDB();

  const pendingOrders = await Order.find({ status: "paid" }).limit(20);
  const results = [];

  for (const order of pendingOrders) {
    await Order.findByIdAndUpdate(order._id, {
      status: "processing",
      updatedAt: new Date(),
    });
    try {
      await sgMail.send({
        to: order.email,
        from: process.env.ADMIN_EMAIL!,
        subject: `Your BrightHome Order #${order._id.toString().slice(-8)} is being processed`,
        html: `<h2>Order Update</h2><p>Hi ${order.firstName},</p><p>Your order is now being processed and will ship soon.</p><p><strong>Order ID:</strong> ${order._id}</p><p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p><p>Thank you for shopping with BrightHome!</p>`,
      });
    } catch (e) { console.error("Email error:", e); }
    results.push(order._id);
  }

  console.log(`[Agent4] Processed ${results.length} orders`);
  return { processed: results.length };
}

if (require.main === module) {
  runOrderFulfillment().then(console.log).catch(console.error).finally(() => process.exit());
}
