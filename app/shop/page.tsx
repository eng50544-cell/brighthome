import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop | BrightHome",
  description: "Browse our full collection of smart home and lighting products.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; page?: string };
}) {
  await connectDB();

  const page = parseInt(searchParams.page || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { isActive: true };
  if (searchParams.category) filter.category = searchParams.category;
  if (searchParams.q) {
    filter.$or = [
      { name: { $regex: searchParams.q, $options: "i" } },
      { tags: { $in: [searchParams.q] } },
    ];
  }

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  const categories = await Product.distinct("category", { isActive: true });

  return (
    <ShopClient
      products={JSON.parse(JSON.stringify(products))}
      categories={categories}
      total={total}
      page={page}
      limit={limit}
    />
  );
}
