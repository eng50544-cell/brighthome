'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/ui/product-card';

const MOCK_PRODUCTS: Product[] = [
  { _id: '1', name: 'Nordic Pendant Light - Brass Finish', price: 89.99, originalPrice: 149.99, images: ['https://picsum.photos/seed/lamp1/400/400'], rating: 4.8, reviews: 234, category: 'Pendant Lights', inStock: true, isNew: true },
  { _id: '2', name: 'Vintage Edison Floor Lamp', price: 129.00, originalPrice: 189.00, images: ['https://picsum.photos/seed/lamp2/400/400'], rating: 4.9, reviews: 189, category: 'Floor Lamps', inStock: true, isNew: false },
  { _id: '3', name: 'Crystal Chandelier Modern', price: 249.00, images: ['https://picsum.photos/seed/lamp3/400/400'], rating: 4.7, reviews: 98, category: 'Chandeliers', inStock: true, isNew: true },
  { _id: '4', name: 'Minimalist Table Lamp Gold', price: 65.00, originalPrice: 95.00, images: ['https://picsum.photos/seed/lamp4/400/400'], rating: 4.6, reviews: 312, category: 'Table Lamps', inStock: true },
  { _id: '5', name: 'LED Strip Light Kit 5m', price: 34.99, images: ['https://picsum.photos/seed/lamp5/400/400'], rating: 4.8, reviews: 567, category: 'LED Strips', inStock: true },
  { _id: '6', name: 'Rattan Woven Pendant Shade', price: 79.00, originalPrice: 110.00, images: ['https://picsum.photos/seed/lamp6/400/400'], rating: 4.5, reviews: 144, category: 'Pendant Lights', inStock: true, isNew: true },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/products?limit=8&sort=featured')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.products?.length) setProducts(data.products); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold-cta font-montserrat text-sm uppercase tracking-widest mb-2">Handpicked For You</p>
            <h2 className="font-playfair text-4xl font-bold text-white">
              Featured <span className="text-gradient-gold">Products</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll('left')} className="glass-card w-10 h-10 rounded-full flex items-center justify-center hover:border-gold-cta/50 transition-all">
              <svg className="w-4 h-4 text-dark-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => scroll('right')} className="glass-card w-10 h-10 rounded-full flex items-center justify-center hover:border-gold-cta/50 transition-all">
              <svg className="w-4 h-4 text-dark-silver" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link href="/shop" className="hidden sm:inline-flex text-gold-cta font-montserrat text-sm font-semibold hover:underline ml-2">
              View All →
            </Link>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="min-w-[260px] snap-start">
                <div className="skeleton aspect-square rounded-2xl mb-3" />
                <div className="skeleton h-4 rounded mb-2" />
                <div className="skeleton h-4 w-2/3 rounded" />
              </div>
            ))
            : products.map(product => (
              <div key={product._id} className="min-w-[260px] max-w-[260px] snap-start">
                <ProductCard product={product} />
              </div>
            ))
          }
        </div>

        {/* View All Mobile */}
        <div className="text-center mt-8 sm:hidden">
          <Link href="/shop" className="btn-gold px-8 py-3 rounded-xl text-sm font-bold inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
