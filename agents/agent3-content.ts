/**
 * AGENT 3: Content Generation Agent
 * Schedule: 11 AM EST daily
 * Task: Generate SEO descriptions, bullet points, FAQ, and social media captions with Gemini AI
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const BATCH_SIZE = 5;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

article async function generateContent(product: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are a professional e-commerce copywriter for BrightHome, a premium lighting & home decor store.

Product to write for:
- Name: ${product.name}
- Category: ${product.category}
- Price: $${product.price}
- Rating: ${product.rating} stars
- Tags: ${product.tags?.join(', ')}

Generate the following in JSON format:

{
  "title": "SEO product title (max 70 chars)",
  "description": "Full HTML product description (400-500 words). Use <p>, <strong>, <ul> tags. Mention benefits, materials, styling tips. No markdown.",
  "bulletPoints": [
    "✨ Benefit 1 with emoji",
    "💡 Benefit 2 with emoji",
    "📏 Spec or feature",
    "🔧 Installation info",
    "✅ Quality/certification",
    "🌿Sustainability note"
  ],
  "faq": [
    {"q": "Question 1?", "a": "Detailed answer 1"},
    {"q": "Question 2?", "a": "Detailed answer 2"},
    {"q": "Question 3?", "a": "Detailed answer 3"},
    {"q": "Question 4?", "a": "Detailed answer 4"}
  ],
  "metaSeo": {
    "title": "SEO meta title (55-60 chars)",
    "description": "SEO meta description (150-160 chars). Include keyword."
  },
  "socialCaptions": {
    "instagram": "Instagram caption 200-300 chars with 10-15 hashtags",
    "tiktok": ["Hook 1: surprise angle (50-100 chars)", "Hook 2: problem-solution (50-100 chars)", "Hook 3: ASMR/visual (50-100 chars)"],
    "pinterest": "Pinterest description 200 chars with keywords",
    "facebook": "Facebook post copy 125-150 chars for engagement"
  }
}

Return ONLY valid JSON. Make it premium, aspirational, and conversion-focused.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error(`Content generation error for ${product.name}:`, e);
    return null;
  }
}

async function run() {
  console.log('🤖 Agent 3: Content Generation Agent Starting...');
  await mongoose.connect(process.env.MONGODB_URI!);

  const ProductModel = mongoose.model('Product', new mongoose.Schema({ name: String, category: String, price: Number, rating: Number, tags: [String] }, { strict: false }));
  const products = await ProductModel.find({ processed: true, published: false }).limit(10);

  for (const product of products) {
    const content = await generateContent(product);
    if (content) {
      await ProductModel.findByIdAndUpdate(product._id, { ...content, contentGenerated: true });
    }
  }

  console.log('✅ Agent 3 complete');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
