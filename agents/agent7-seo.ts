import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function runSEOOptimization() {
  await connectDB();

  const products = await Product.find({ active: true, $or: [{ seoTitle: { $exists: false } }, { seoTitle: "" }] }).limit(10);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const results = [];

  for (const product of products) {
    try {
      const prompt = `Generate SEO metadata for this product:
Name: ${product.name}
Description: ${product.description?.slice(0, 200) || ""}
Category: ${product.category}

Return JSON: { "seoTitle": "...", "seoDescription": "...", "slug": "..." }
Keep seoTitle under 60 chars, seoDescription under 160 chars. Slug should be URL-friendly.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const seo = JSON.parse(jsonMatch[0]);
        await Product.findByIdAndUpdate(product._id, { ...seo, updatedAt: new Date() });
        results.push({ name: product.name, slug: seo.slug });
      }
    } catch (e) { console.error("SEO error for", product.name, e); }
  }

  console.log(`[Agent7] Optimized SEO for ${results.length} products`);
  return { optimized: results };
}

if (require.main === module) {
  runSEOOptimization().then(console.log).catch(console.error).finally(() => process.exit());
}
