import React from 'react';
import Link from 'next/link';

const collections = [
  { name: 'Pendant Lights', slug: 'pendant', count: 48 },
  { name: 'Floor Lamps', slug: 'floor-lamps', count: 32 },
  { name: 'Table Lamps', slug: 'table-lamps', count: 56 },
  { name: 'Chandeliers', slug: 'chandeliers', count: 24 },
  { name: 'Wall Lights', slug: 'wall-lights', count: 38 },
  { name: 'LED Strips', slug: 'led-strips', count: 29 },
];

export default function CollectionsGrid() {
  return (
    <section className="section-padding bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl font-bold text-white">
            Shop <span className="text-gradient-gold">Collections</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {collections.map((col) => (
            <Link href={`/shop?category=${col.slug}`} key={col.slug}
              className="group glass-card rounded-2xl p-6 hover:border-gold-cta/50 transition-all">
              <h3 className="font-playfair text-xl font-bold text-white mb-2">{col.name}</h3>
              <p className="text-dark-silver text-sm">{col.count} products</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
