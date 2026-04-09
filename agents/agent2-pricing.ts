import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function runPricing() {
  await connectDB();

  const products = await Product.find({ active: true });

  for (const product of products) {
    const basePrice = product.costPrice || product.price * 0.5;
    const margin = 0.45;
    const newPrice = parseFloat((basePrice / (1 - margin)).toFixed(2));
    const comparePrice = parseFloat((newPrice * 1.3).toFixed(2));

    await Product.findByIdAndUpdate(product._id, {
      price: newPrice,
      comparePrice,
      updatedAt: new Date(),
    });
  }

  console.log(`[Agent2] Updated pricing for ${products.length} products`);
  return { updated: products.length };
}

if (require.main === module) {
  runPricing().then(console.log).catch(console.error).finally(() => process.exit());
}
