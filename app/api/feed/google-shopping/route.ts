import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true, published: true }).limit(500).lean() as any[];

    const domain = process.env.DOMAIN || 'https://brighthouse.website';

    const items = products.map((p: any) => `
  <item>
    <g:id>${p._id}</g:id>
    <title><![CDATA[${p.name}]]></title>
    <description><![CDATA[${p.metaSeo?.description || p.name}]]></description>
    <link>${domain}/shop/${p._id}</link>
    <g:image_link>${p.images?.[0] || ''}</g:image_link>
    ${p.images?.[1] ? `<g:additional_image_link>${p.images[1]}</g:additional_image_link>` : ''}
    <g:condition>new</g:condition>
    <g:availability>${p.inStock ? 'in stock' : 'out of stock'}</g:availability>
    <g:price>${p.price.toFixed(2)} USD</g:price>
    ${p.originalPrice ? `<g:sale_price>${p.price.toFixed(2)} USD</g:sale_price>` : ''}
    <g:brand>BrightHome</g:brand>
    <g:google_product_category>594</g:google_product_category>
    <g:product_type>${p.category}</g:product_type>
    <g:shipping>
      <g:country>US</g:country>
      <g:service>Standard</g:service>
      <g:price>${p.price >= 50 ? '0.00' : '7.99'} USD</g:price>
    </g:shipping>
  </item>`).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>BrightHome Products</title>
    <link>${domain}</link>
    <description>Premium Lighting & Home Decor — BrightHome</description>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new NextResponse('Feed generation failed', { status: 500 });
  }
}
