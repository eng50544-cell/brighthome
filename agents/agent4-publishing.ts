/**
 * AGENT 4: Publishing Agent
 * Task: Publish approved products to the store
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

async function run() {
  console.log('🤖 Agent 4: Publishing Agent Starting...');
  await mongoose.connect(process.env.MONGODB_URI!);
  const ProductModel = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  const products = await ProductModel.find({ processed: true, published: false }).limit(10);
  let published = 0;
  for (const p of products) {
    await ProductModel.findByIdAndUpdate(p._id, { published: true, publishedAt: new Date() });
    published++;
  }
  console.log(`✅ Published ${published} products`);
  await mongoose.disconnect();
}
run().catch(err => { console.error('❌', err); process.exit(1); });
