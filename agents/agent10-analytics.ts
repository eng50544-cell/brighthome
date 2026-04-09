import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function runAnalyticsAlert() {
  await connectDB();

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [ordersToday, revenue, lowStock] = await Promise.all([
    Order.countDocuments({ createdAt: { $gte: yesterday } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: yesterday }, status: { $in: ["paid", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Product.find({ active: true, stock: { $lt: 5 } }).select("name stock"),
  ]);

  const revenueTotal = revenue[0]?.total || 0;

  try {
    await sgMail.send({
      to: process.env.ADMIN_EMAIL!,
      from: process.env.ADMIN_EMAIL!,
      subject: `BrightHome Daily Report - ${now.toDateString()}`,
      html: `
        <h2>Daily Analytics Report</h2>
        <p><strong>Orders Today:</strong> ${ordersToday}</p>
        <p><strong>Revenue Today:</strong> $${revenueTotal.toFixed(2)}</p>
        <p><strong>Low Stock Items (< 5):</strong></p>
        <ul>${lowStock.map(p => `<li>${p.name}: ${p.stock} left</li>`).join("")}</ul>
        <p>Generated: ${now.toISOString()}</p>
      `,
    });
  } catch (e) { console.error("Alert email error:", e); }

  console.log(`[Agent10] Daily report sent. Orders: ${ordersToday}, Revenue: $${revenueTotal}`);
  return { ordersToday, revenueTotal, lowStockCount: lowStock.length };
}

if (require.main === module) {
  runAnalyticsAlert().then(console.log).catch(console.error).finally(() => process.exit());
}
