import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const LOW_STOCK_THRESHOLD = 10;

export async function runInventory() {
  await connectDB();

  const lowStock = await Product.find({
    active: true,
    stock: { $lt: LOW_STOCK_THRESHOLD },
  });

  const results = [];

  for (const product of lowStock) {
    const restockAmount = 50;
    await Product.findByIdAndUpdate(product._id, {
      $inc: { stock: restockAmount },
      updatedAt: new Date(),
    });
    results.push({ name: product.name, added: restockAmount });
  }

  console.log(`[Agent3] Restocked ${results.length} products`);
  return { restocked: results };
}

if (require.main === module) {
  runInventory().then(console.log).catch(console.error).finally(() => process.exit());
}
