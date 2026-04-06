import React from 'react';

const items = [
  { icon: '🚚', text: 'Free Shipping Over $50' },
  { icon: '🔄', text: '30-Day Returns' },
  { icon: '🔒', text: 'Secure Checkout' },
  { icon: '⭐', text: '4.9/5 Customer Rating' },
  { icon: '🌍', text: 'Worldwide Shipping' },
  { icon: '💳', text: 'Multiple Payment Options' },
];

export default function TrustBar() {
  return (
    <div className="bg-deep-contrast border-y border-border-silver py-4 overflow-hidden">
      <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg">{item.icon}</span>
            <span className="text-dark-silver text-xs font-montserrat uppercase tracking-wider">{item.text}</span>
            <span className="text-border-silver mx-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
