/**
 * AGENT 10: Frontend/Design Agent
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import mongoose from 'mongoose';

async function run() {
  console.log('🤖 Agent 10: Frontend/Design Agent Starting...');
  console.log(`⎰ Time: ${new Date().toISOString()}`);

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const ProductModel = mongoose.model('Product', new mongoose.Schema({}, { strict: false }), 'products');
    const featured = await ProductModel.countDocuments({ published: true, isFeatured: true });
    console.log(`✅ Featured products: ${featured}`);
    await mongoose.disconnect();
    console.log('\n✅ AGENT 10 COMPLETE');
  } catch (err) {
    console.error('❌ Agent 10 Error:', err);
  }
}

run();
