/**
 * AGENT 9: Optimization Agent
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  console.log('🤖 Agent 9: Optimization Agent Starting...');
  await mongoose.connect(process.env.MONGODB_URI!);
  const ProductModel = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
  const staleDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const stale = await ProductModel.find({ published: true, publishedAt: { $lte: staleDate }, orders: 0 }).limit(10);
  for (const p of stale) await ProductModel.findByIdAndUpdate(p._id, { isActive: false });
  console.log(`✅ Deactivated ${stale.length} stale products`);
  console.log('✅ AGENT 9 COMPLETE');
  await mongoose.disconnect();
}
run().catch(err => { console.error('❌', err); process.exit(1); });
