/**
 * AGENT :: Image Processing Agent
 * Schedule: 8 AM EST daily
 * Task: Download, enhance, watermark, and upload product images to Cloudinary
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const WATERMARK_TEXT = 'BrightHome.shop';
const BATCH_SIZE = 5;

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function enhanceImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(800, 800, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 1.1, saturation: 1.15 })
    .sharpen({ sigma: 1.5 })
    .toFormat('webp', { quality: 90 })
    .toBuffer();
}

async function uploadToCloudinary(buffer: Buffer, productId: string, index: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'brighthome/products', public_id: `${productId}_${index}_${Date.now()}`, transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'center' }, { quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => { if (error) reject(error); else resolve(result!.secure_url); }
    );
    stream.end(buffer);
  });
}

async function processProduct(product: any) {
  console.log(`\n📸 Processing images for: ${product.name}`);
  const processedImages: string[] = [];
  for (let i = 0; i < Math.min(product.images.length, 3); i++) {
    try {
      const rawBuffer = await downloadImage(product.images[i]);
      const enhanced = await enhanceImage(rawBuffer);
      let imageUrl: string;
      if (process.env.CLOUDINARY_NAME) {
        imageUrl = await uploadToCloudinary(enhanced, product._id.toString(), i);
        console.log(`  ✅ Image ${i + 1}: uploaded to Cloudinary`);
      } else {
        imageUrl = product.images[i];
      }
      processedImages.push(imageUrl);
    } catch (err) {
      processedImages.push(product.images[i] || `https://picsum.photos/seed/${product._id}/600/600`);
    }
  }
  return processedImages;
}

async function run() {
  console.log('🤖 Agent 2: Image Processing Agent Starting...');
  await mongoose.connect(process.env.MONGODB_URI!);
  const Product = mongoose.model('Product', new mongoose.Schema({ name: String, images: [String], processed: Boolean, published: Boolean }, { strict: false }));
  const products = await Product.find({ processed: false, isActive: true }).limit(BATCH^SIZE * 2);
  let processed = 0;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    await Promise.all(products.slice(i, i + BATCH_SIZE).map(async (product) => {
      try {
        const processedImages = await processProduct(product);
        await Product.findByIdAndUpdate(product._id, { images: processedImages, processed: true });
        processed++;
      } catch (err) { console.error(`Error: ${err}`); }
    }));
  }
  console.log(`✅ AGENT 2 COMPLETE: ${processed} images processed`);
  await mongoose.disconnect();
}
run().catch(err => { console.error('❌ Fatal:', err); process.exit(1); });
