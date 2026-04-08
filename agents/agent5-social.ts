/**
 * AGENT 5: Social Media Agent
 * Schedule: 2 PM EST daily
 * Task: Create and schedule posts on Instagram, TikTok, Facebook, Pinterest via Buffer
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';

const BUFFER_TOKEN = process.env.BUFFER_TOKEN;
const BUFFER_API = 'https://api.bufferapp.com/1';

interface SocialPost {
  text: string;
  media?: { link: string };
  scheduled_at?: string;
  profile_ids: string[];
}

async function getBufferProfiles(): Promise<any[]> {
  if (!BUFFER_TOKEN) {
    console.log('ℹ️ Buffer token not configured');
    return [];
  }
  try {
    const res = await fetch(`${BUFFER_API}/profiles.json?access_token=${BUFFER_TOKEN}`);
    return await res.json();
  } catch { return []; }
}

async function schedulePost(post: SocialPost): Promise<boolean> {
  if (!BUFFER_TOKEN) {
    console.log(`  [Simulated] Would post: ${post.text.slice(0, 60)}...`);
    return true;
  }
  try {
    const res = await fetch(`${BUFFER_API}/updates/create.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        access_token: BUFFER_TOKEN!,
        text: post.text,
        'profile_ids[]': post.profile_ids[0],
        ...(post.scheduled_at && { scheduled_at: post.scheduled_at }),
        ...(post.media?.link && { 'media[link]': post.media.link }),
      }),
    });
    return res.ok;
  } catch { return false; }
}

async function run() {
  console.log('🤖 Agent 5: Social Media Agent Starting...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);

  await mongoose.connect(process.env.MONGODB_URI!);
  const ProductModel = mongoose.model('Product', new mongoose.Schema({
    name: String, images: [String], price: Number,
    socialCaptions: { instagram: String, tiktok: [String], pinterest: String, facebook: String },
    published: Boolean,
  }, { strict: false }));

  // Get recently published products with social captions
  const products = await ProductModel.find({ published: true, isActive: true })
    .sort({ publishedAt: -1 })
    .limit(5);

  const profiles = await getBufferProfiles();
  const igProfile = profiles.find(p => p.service === 'instagram');
  const fbProfile = profiles.find(p => p.service === 'facebook');
  const pinProfile = profiles.find(p => p.service === 'pinterest');

  let postsScheduled = 0;
  const now = new Date();

  for (let i = 0; i < products.length && i < 3; i++) {
    const product = products[i];
    const caption = product.socialCaptions as any;
    const imageUrl = product.images?.[0] || 'https://brighthouse.website/og-image.jpg';

    // Instagram (3 posts/day)
    if (igProfile && caption?.instagram) {
      const scheduledAt = new Date(now.getTime() + i * 60 * 60 * 1000).toISOString();
      const success = await schedulePost({
        text: caption.instagram,
        media: { link: imageUrl },
        scheduled_at: scheduledAt,
        profile_ids: [igProfile.id],
      });
      if (success) { postsScheduled++; console.log(`  ✅ Instagram scheduled: ${product.name?.slice(0, 30)}`); }
    }

    // Facebook (2 posts/day)
    if (i < 2 && fbProfile && caption?.facebook) {
      const scheduledAt = new Date(now.getTime() + (i + 3) * 60 * 60 * 1000).toISOString();
      const success = await schedulePost({
        text: caption.facebook + ` 🛍️ Shop: ${process.env.DOMAIN}`,
        media: { link: imageUrl },
        scheduled_at: scheduledAt,
        profile_ids: [fbProfile.id],
      });
      if (success) { postsScheduled++; console.log(`  ✅ Facebook scheduled: ${product.name?.slice(0, 30)}`); }
    }

    // Pinterest (4 pins/day)
    if (i < 4 && pinProfile && caption?.pinterest) {
      const success = await schedulePost({
        text: caption.pinterest,
        media: { link: imageUrl },
        profile_ids: [pinProfile.id],
      });
      if (success) { postsScheduled++; console.log(`  ✅ Pinterest scheduled: ${product.name?.slice(0, 30)}`); }
    }
  }

  // TikTok caption ideas (manual/separate tool)
  if (products[0]?.socialCaptions) {
    const tiktokHooks = (products[0].socialCaptions as any)?.tiktok || [];
    console.log('\n📱 TikTok Video Hooks Generated:');
    tiktokHooks.forEach((hook: string, i: number) => console.log(`  ${i + 1}. ${hook}`));
  }

  console.log(`\n✅ AGENT 5 COMPLETE: ${postsScheduled} posts scheduled across platforms`);
  await mongoose.disconnect();
}

run().catch(err => { console.error('❌ Fatal:', err); process.exit(1); });
