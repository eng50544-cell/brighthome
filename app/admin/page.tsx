import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  await connectDB();

  const [totalOrders, totalProducts, revenueResult, recentOrders, featuredProducts] =
    await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: ["paid", "delivered"] } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
      Product.find({ featured: true }).limit(6).lean(),
    ]);

  const revenue = revenueResult[0]?.total || 0;

  return (
    <AdminClient
      stats={{ totalOrders, totalProducts, revenue }}
      recentOrders={JSON.parse(JSON.stringify(recentOrders))}
      featuredProducts={JSON.parse(JSON.stringify(featuredProducts))}
    />
  );
}
