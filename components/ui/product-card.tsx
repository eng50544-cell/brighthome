'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './cart-context';
import { useToast } from './toast';

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviews: number;
  category: string;
  tags?: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const stars = [1, 2, 3, 4, 5];
  const s = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {stars.map(star => (
        <svg key={star} className={`${s} ${star <= Math.floor(rating) ? 'text-gold-cta' : star - 0.5 <= rating ? 'text-gold-cta/60' : 'text-dark-silver/30'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hoveredImg, setHoveredImg] = useState(0);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const isNew = product.isNew ||
    (product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 3 * 24 * 60 * 60 * 1000);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
    showToast(`${product.name.slice(0, 30)}... added to cart!`, 'success');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist(!wishlist);
    showToast(wishlist ? 'Removed from wishlist' : 'Added to wishlist!', wishlist ? 'info' : 'success');
  };

  const imgSrc = product.images[hoveredImg] || product.images[0] || '/placeholder.jpg';

  return (
    <Link href={`/shop/${product._id}`} className="group product-card block">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="relative aspect-square bg-card-bg overflow-hidden" onMouseEnter={() => product.images[1] && setHoveredImg(1)} onMouseLeave={() => setHoveredImg(0)}>
          {!imgLoaded && <div className="skeleton absolute inset-0" />}
          <Image src={imgSrc} alt={product.name} fill className={`object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImgLoaded(true)} sizes="(max-width: 768px) 50vw, 25vw" />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isNew && <span className="bg-lamp-glow text-dark-bg text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>}
            {discount > 0 && <span className="bg-gold-cta text-dark-bg text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>}
            {!product.inStock && <span className="bg-red-500/80 text-white text-xs font-bold px-2.5 py-1 rounded-full">OUT OF STOCK</span>}
          </div>
          <button onClick={handleWishlist} className="absolute top-3 right-3 w-8 h-8 glass-card rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <svg className={`w-4 h-4 transition-colors ${wishlist ? 'text-red-400 fill-current' : 'text-dark-silver'}`} viewBox="0 0 24 24" fill={wishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart} disabled={!product.inStock} className="w-full btn-gold py-3 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed">
              {product.inStock ? '+ Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-dark-silver text-xs uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="text-accent-silver font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-gold-cta transition-colors">{content.name}</h3>
          <div className="flex items-center gap-2 mb-3"><StarRating rating={product.rating} /><span className="text-dark-silver text-xs">({product.reviews.toLocaleString()})</span></div>
          <div className="flex items-center gap-2"><span className="text-gold-cta font-bold text-lg">${product.price.toFixed(2)}</span>{content.originalPrice && <span className="text-dark-silver text-sm line-through">${content.originalPrice.toFixed(2)}</span>}</div>
        </div>
      </div>
    </Link>
  );
}

export { StarRating };
