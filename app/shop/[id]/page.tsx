import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  await connectDB();
  const product = await Product.findOne({ slug: params.id }).lean();
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${(product as any).name} | BrightHome`,
    description: (product as any).shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  await connectDB();
  const product = await Product.findOne({ slug: params.id }).lean();
  if (!product) notFound();
  return <ProductDetailClient product={JSON.parse(JSON.stringify(product))} />;
}
