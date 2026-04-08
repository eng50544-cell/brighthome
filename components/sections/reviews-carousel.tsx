'use client';
import React, { useState } from 'react';
import { StarRating } from '@/components/ui/product-card';

const reviews = [
  { id: 1, name: 'Sarah M.', location: 'New York, USA', rating: 5, text: 'Absolutely love my new pendant lights! The quality is incredible and they look even better in person. Fast shipping too!', product: 'Nordic Pendant Light', avatar: 'SM' },
  { id: 2, name: 'James K.', location: 'London, UK', rating: 5, text: "The Edison floor lamp transformed my living room completely. It's the perfect statement piece. Highly recommend BrightHome!", product: 'Vintage Edison Floor Lamp', avatar: 'JK' },
  { id: 3, name: 'Emma L.', location: 'Sydney, AU', rating: 4, text: 'Great quality crystal chandelier. Installation was straightforward and the packaging was excellent. Very happy!', product: 'Crystal Chandelier Modern', avatar: 'EL' },
  { id: 4, name: 'David R.', location: 'Toronto, CA', rating: 5, text: "Ordered 3 table lamps and they're all perfect. The gold finish is exactly as shown. Customer service was amazing!", product: 'Minimalist Table Lamp Gold', avatar: 'DR' },
  { id: 5, name: 'Aisha F.', location: 'Dubai, UAE', rating: 5, text: 'BrightHome has the best selection of modern lighting. I redecorated my entire apartment with their products!', product: 'Multiple Items', avatar: 'AF' },
  { id: 6, name: 'Chen W.', location: 'Singapore', rating: 5, text: 'The LED strip lights are fantastic value. Easy to install and the colors are vibrant. Will buy again!', product: 'LED Strip Light Kit', avatar: 'CW' },
];

export default function ReviewsCarousel() {
  const [active, setActive] = useState(0);
  const itemsPerView = 3;
  const maxSlide = Math.max(0, reviews.length - itemsPerView);
  const prev = () => setActive(a => Math.max(0, a - 1));
  const next = () => setActive(a => Math.min(maxSlide, a + 1));
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #151525 0%, #0F0F1A 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-gold-cta font-montserrat text-sm uppercase tracking-widest mb-2">Real Reviews</p>
          <h2 className="font-playfair text-4xl font-bold text-white">What Our <span className="text-gradient-gold">Customers Say</span></h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-6 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${active * (100 / itemsPerView)}% - ${active * 24}px))` }}>
            {reviews.map(review => (
              <div key={review.id} className="min-w-[calc(33.333%-16px)] glass-card rounded-2xl p-6 flex-shrink-0">
                <div className="flex gap-1 mb-4"><StarRating rating={review.rating} size="sm" /></div>
                <p className="text-dark-silver text-sm leading-relaxed mb-5 italic">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border-silver">
                  <div className="w4-10 h-10 bg-gold-cta/20 rounded-full flex items-center justify-center"><span className="text-gold-cta font-bold text-sm">{review.avatar}</span></div>
                  <div><div className="text-accent-silver font-semibold text-sm">{review.name}</div><div className="text-dark-silver text-xs">{review.location}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
