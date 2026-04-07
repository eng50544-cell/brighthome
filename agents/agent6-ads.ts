/**
 * AGENT 6: Google Ads Optimization Agent
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

async function run() {
  console.log('🤖 Agent 6: Google Ads Optimization Agent Starting...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);
  await mongoose.connect(process.env.MONGODB_URI!);
  const ProductModel = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  const topProducts = await ProductModel.find({ published: true }).sort({ orders: -1 }).limit(20);
  console.log(`🛍️ Google Shopping Feed: ${topProducts.length} products`);
  console.log('✅ AGENT 6 COMPLETE');
  await mongoose.disconnect();
}
run().catch(err => { console.error('❌', err); process.exit(1); });
