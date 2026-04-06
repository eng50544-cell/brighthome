import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page-container pt-24 flex items-center justify-center min-h-screen">
      <div className="max-w-lg mx-auto px-4 text-center py-20">
        {/* Animated lamp */}
        <div className="text-8xl mb-6 animate-float inline-block">💡</div>

        <h1 className="font-playfair text-6xl font-bold text-white mb-4">
          <span className="text-gradient-gold">404</span>
        </h1>
        <h2 className="font-playfair text-2xl font-bold text-accent-silver mb-4">
          Page Not Found
        </h2>
        <p className="text-dark-silver mb-10 leading-relaxed">
          Looks like this page went dark. Let&apos;s get you back to the light.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gold px-8 py-4 rounded-2xl font-bold inline-block">
            Go Home
          </Link>
          <Link
            href="/shop"
            className="glass-card px-8 py-4 rounded-2xl font-semibold text-accent-silver hover:border-gold-cta/50 hover:text-gold-cta transition-all inline-block"
          >
            Shop All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
