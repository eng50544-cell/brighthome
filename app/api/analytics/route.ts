import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, data } = body;

    console.log(`[Analytics] ${event}:`, data);

    // Track specific events in DB
    if (event === 'page_view' && data?.productId) {
      await connectDB();
      await Product.findByIdAndUpdate(data.productId, { $inc: { views: 1 } }).catch(() => {});
    }

    return NextResponse.json({ tracked: true, event });
  } catch {
    return NextResponse.json({ tracked: false }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '7d';

    const days = period === '30d' ? 30 : period === '90d' ? 90 : 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalOrders, paidOrders, totalProducts, topProducts] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: since } }),
      Order.find({ status: { $in: ['paid', 'processing', 'shipped', 'delivered'] }, createdAt: { $gte: since } }).lean(),
      Product.countDocuments({ isActive: true, published: true }),
      Product.find({ published: true }).sort({ orders: -1 }).limit(5).select('name orders revenue price').lean(),
    ]);

    const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = paidOrders.length > 0 ? revenue / paidOrders.length : 0;

    return NextResponse.json({
      period,
      orders: totalOrders,
      paidOrders: paidOrders.length,
      revenue: revenue.toFixed(2),
      avgOrderValue: avgOrderValue.toFixed(2),
      totalProducts,
      topProducts,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Analytics fetch failed' }, { status: 500 });
  }
}
