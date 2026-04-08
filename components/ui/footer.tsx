import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Shop: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Best Sellers', href: '/shop?sort=popular' },
      { label: 'Sale', href: '/shop?sale=true' },
    ],
    Categories: [
      { label: 'Pendant Lights', href: '/shop?category=pendant' },
      { label: 'Floor Lamps', href: '/shop?category=floor-lamps' },
      { label: 'Table Lamps', href: '/shop?category=table-lamps' },
      { label: 'Wall Lights', href: '/shop?category=wall-lights' },
    ],
    Support: [
      { label: 'Track Order', href: '/track-order' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'About BrightHome', href: '/about' },
    ],
  };

  return (
    <footer className="bg-deep-contrast border-t border-border-silver mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-gradient rounded-full" />
              <span className="font-playfair text-2xl font-bold text-gradient-gold">BrightHome</span>
            </div>
            <p className="text-dark-silver text-sm leading-relaxed mb-6 max-w-xs">Premium lighting and home decor that transforms your space. Curated designs shipped worldwide.</p>
            <div className="flex gap-3">
              {[{ name: 'Instagram', href: 'https://instagram.com/brighthome.shop' },{ name: 'TikTok', href: 'https://tiktok.com/@brighthomeofficial' },{ name: 'Facebook', href: 'https://facebook.com/BrightHome' }].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 glass-card rounded-full flex items-center justify-center hover:border-gold-cta hover:text-gold-cta transition-all" aria-label={s.name}>
                  <span className="text-xs text-dark-silver">{s.name[0]}</span>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-montserrat font-bold text-accent-silver uppercase tracking-widest text-xs mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.href}><Link href={item.href} className="text-dark-silver hover:text-gold-cta text-sm transition-colors">{item.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border-silver">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div><h3 className="font-playfair text-xl font-bold text-accent-silver mb-1">Get exclusive deals in your inbox</h3><p className="text-dark-silver text-sm">Join 50,000+ happy customers</p></div>
            <form className="flex gap-3 w-full lg:w.auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" className="input-dark flex-1 px-4 py-2.5 rounded-xl text-sm" />
              <button type="submit" className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
      <div className="border-t border-border-silver">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row gap-2 items-center justify-between">
          <p className="text-dark-silver text-xs">© {currentYear} BrightHome. All rights reserved.</p>
          <div className="flex gap-4">
            {[{ label: 'Privacy Policy', href: '/privacy' },{ label: 'Terms of Service', href: '/terms' },{ label: 'Returns', href: '/returns' }].map(item => (
              <Link key={item.href} href={item.href} className="text-dark-silver hover:text-gold-cta text-xs transition-colors">{item.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
