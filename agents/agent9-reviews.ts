import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function runReviewRequests() {
  await connectDB();

  const deliveredOrders = await Order.find({
    status: "delivered",
    reviewRequested: { $ne: true },
    deliveredAt: { $lte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  }).limit(20);

  const results = [];

  for (const order of deliveredOrders) {
    try {
      await sgMail.send({
        to: order.email,
        from: process.env.ADMIN_EMAIL!,
        subject: "How was your BrightHome purchase? Leave a review!",
        html: `<h2>We'd love your feedback!</h2><p>Hi ${order.firstName},</p><p>We hope you're enjoying your recent purchase from BrightHome!</p><p>Your feedback helps us improve. Please visit our store to leave a review.</p><p>Thank you for being a valued customer!</p>`,
      });
      await Order.findByIdAndUpdate(order._id, { reviewRequested: true, updatedAt: new Date() });
      results.push(order._id);
    } catch (e) { console.error("Review email error:", e); }
  }

  console.log(`[Agent9] Sent review requests to ${results.length} customers`);
  return { sent: results.length };
}

if (require.main === module) {
  runReviewRequests().then(console.log).catch(console.error).finally(() => process.exit());
}
