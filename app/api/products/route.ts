import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'featured';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '99999');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const inStock = searchParams.get('inStock') === 'true';
    const featured = searchParams.get('featured') === 'true';

    const query: Record<string, unknown> = { isActive: true, published: true };

    if (category && category !== 'All') {
      query.category = { $regex: category, $options: 'i' };
    }
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice > 0 || maxPrice < 99999) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (minRating > 0) {
      query.rating = { $gte: minRating };
    }
    if (inStock) {
      query.inStock = true;
    }
    if (featured) {
      query.isFeatured = true;
    }

    const sortMap: Record<string, Record<string, number>> = {
      'featured': { isFeatured: -1, createdAt: -1 },
      'newest': { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'popular': { orders: -1, views: -1 },
      'rating': { rating: -1, reviews: -1 },
    };

    const sortQuery = sortMap[sort] || sortMap['featured'];
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortQuery).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDB();

    // Generate slug
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

    const product = new Product({ ...body, slug });
    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
