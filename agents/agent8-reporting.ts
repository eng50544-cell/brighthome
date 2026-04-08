import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ name: string; sales: number; revenue: number }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{ date: string; revenue: number }>;
}

export async function runReporting(): Promise<ReportData> {
  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get all orders from last 30 days
  const orders = await Order.find({
    createdAt: { $gte: thirtyDaysAgo },
  }).lean();

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Orders by status
  const ordersByStatus: Record<string, number> = {};
  for (const order of orders) {
    const status = order.status || "unknown";
    ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
  }

  // Top products by sales
  const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};
  for (const order of orders) {
    if (order.items) {
      for (const item of order.items) {
        const id = item.productId?.toString() || "unknown";
        if (!productSales[id]) {
          productSales[id] = { name: item.name || "Unknown", sales: 0, revenue: 0 };
        }
        productSales[id].sales += item.quantity || 0;
        productSales[id].revenue += (item.price || 0) * (item.quantity || 0);
      }
    }
  }

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Revenue by day
  const revenueByDayMap: Record<string, number> = {};
  for (const order of orders) {
    if (order.status === "paid" || order.status === "delivered") {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      revenueByDayMap[date] = (revenueByDayMap[date] || 0) + (order.totalAmount || 0);
    }
  }

  const revenueByDay = Object.entries(revenueByDayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  const report: ReportData = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    topProducts,
    ordersByStatus,
    revenueByDay,
  };

  console.log("Agent 8 Reporting Complete:");
  console.log(`  Revenue (30d): $${totalRevenue.toFixed(2)}`);
  console.log(`  Orders (30d): ${totalOrders}`);
  console.log(`  AOV: $${averageOrderValue.toFixed(2)}`);

  return report;
}

if (require.main === module) {
  runReporting()
    .then((report) => {
      console.log("Full Report:", JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
