import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function runProductResearch() {
  await connectDB();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate a JSON array of 15 trending smart home and lighting products for a dropshipping store called BrightHome. 
  Each product must have:
  - name: product name
  - slug: URL-friendly slug
  - category: one of [Smart Lighting, LED Strips, Smart Plugs, Security Cameras, Smart Displays, Voice Assistants]
  - shortDescription: 1 sentence
  - description: 2-3 sentences
  - price: retail price in USD (between 19.99 and 299.99)
  - costPrice: supplier cost (must be at least 40% less than price)
  - stock: number between 50 and 500
  - images: array with 1 placeholder URL "https://via.placeholder.com/600x600?text=Product"
  - features: array of 4 key features
  - tags: array of 3-5 relevant tags
  - isActive: true
  - isFeatured: boolean (true for 5 products)
  
  Return ONLY valid JSON array, no markdown, no explanation.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }
    
    const products = JSON.parse(jsonMatch[0]);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const product of products) {
      const margin = (product.price - product.costPrice) / product.price;
      if (margin < 0.4) {
        product.costPrice = product.price * 0.5;
      }
      
      const existing = await Product.findOne({ slug: product.slug });
      if (existing) {
        skipped++;
        continue;
      }
      
      await Product.create({
        ...product,
        rating: { average: 4 + Math.random(), count: Math.floor(Math.random() * 200) + 10 },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      inserted++;
    }
    
    console.log(`Agent 1 Complete: ${inserted} products inserted, ${skipped} skipped`);
    return { inserted, skipped, total: products.length };
  } catch (error) {
    console.error("Agent 1 Error:", error);
    throw error;
  }
}

if (require.main === module) {
  runProductResearch()
    .then(result => {
      console.log("Result:", result);
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
