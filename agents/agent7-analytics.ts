/**
 * AGENT 7: Analytics Agent
 * Schedule: Every hour (24/7)
 * Task: Collect metrics, update dashboards, send alerts
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';

async function run() {
  console.log('🤖 Agent 7: Analytics Agent Running...');
  console.log(`⏰ Time: ${new Date().toISOString()}`);

  await mongoose.connect(process.env.MONGODB_URI!);

  const OrderModel = mongoose.model('Order', new mongoose.Schema({
    status: String, total: Number, createdAt: Date,
  }, { strict: false }));

  const ProductModel = mongoose.model('Product', new mongoose.Schema({
    published: Boolean, views: Number, orders: Number, revenue: Number,
  }, { strict: false }));

  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    ordersToday,
    paidOrdersToday,
    ordersWeek,
    paidOrdersWeek,
    totalProducts,
    topProducts,
  ] = await Promise.all([
    OrderModel.countDocuments({ createdAt: { $gte: today } }),
    OrderModel.find({ status: { $in: ['paid', 'processing', 'shipped', 'delivered'] }, createdAt: { $gte: today } }).lean(),
    OrderModel.countDocuments({ createdAt: { $gte: thisWeek } }),
    OrderModel.find({ status: { $in: ['paid', 'processing', 'shipped', 'delivered'] }, createdAt: { $gte: thisWeek } }).lean(),
    ProductModel.countDocuments({ published: true }),
    ProductModel.find({ published: true }).sort({ orders: -1 }).limit(5).lean(),
  ]);

  const revenueToday = paidOrdersToday.reduce((s: number, o: any) => s + (o.total || 0), 0);
  const revenueWeek = paidOrdersWeek.reduce((s: number, o: any) => s + (o.total || 0), 0);

  const metrics = {
    timestamp: new Date().toISOString(),
    today: {
      orders: ordersToday,
      paidOrders: paidOrdersToday.length,
      revenue: revenueToday.toFixed(2),
    },
    week: {
      orders: ordersWeek,
      paidOrders: paidOrdersWeek.length,
      revenue: revenueWeek.toFixed(2),
      avgOrderValue: paidOrdersWeek.length > 0 ? (revenueWeek / paidOrdersWeek.length).toFixed(2) : '0',
    },
    store: {
      totalProducts,
      topProducts: topProducts.slice(0, 3).map((p: any) => ({ name: p.name, orders: p.orders })),
    },
  };

  console.log('\n📊 Current Metrics:');
  console.log(`  Today Revenue: $${metrics.today.revenue}`);
  console.log(`  Today Orders: ${metrics.today.paidOrders}`);
  console.log(`  Week Revenue: $${metrics.week.revenue}`);
  console.log(`  Total Products Live: ${metrics.store.totalProducts}`);

  // Alert if no orders in 48h
  const last48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const recentOrders = await OrderModel.countDocuments({
    status: 'paid',
    createdAt: { $gte: last48h },
  });

  if (recentOrders === 0 && totalProducts > 10) {
    console.log('\n⚠️ ALERT: No paid orders in last 48 hours!');
    // Send alert email
    const sgKey = process.env.SENDGRID_API_KEY;
    if (sgKey) {
      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sgKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: process.env.ADMIN_EMAIL }] }],
          from: { email: 'hello@brighthouse.website', name: 'BrightHome Alerts' },
          subject: '⚠️ BrightHome Alert: No orders in 48 hours',
          content: [{ type: 'text/html', value: '<p>No paid orders in the last 48 hours. Please check your ad campaigns and store status.</p>' }],
        }),
      }).catch(() => {});
    }
  }

  // Save metrics snapshot to DB
  const MetricsModel = mongoose.model('DailyMetrics', new mongoose.Schema({
    date: Date, metrics: Object,
  }), 'dailyStats');

  await MetricsModel.findOneAndUpdate(
    { date: today },
    { date: today, metrics },
    { upsert: true }
  ).catch(() => {});

  console.log('✅ AGENT 7 COMPLETE: Metrics updated');
  await mongoose.disconnect();
}

run().catch(err => { console.error('❌ Fatal:', err); process.exit(1); });
