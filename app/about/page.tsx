import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | BrightHome',
  description: 'Discover BrightHome — your destination for premium lighting and home décor, curated to transform every space into something extraordinary.',
};

const stats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+',    label: 'Curated Products' },
  { value: '30',      label: 'Day Returns' },
  { value: '24h',     label: 'Support Response' },
];

const values = [
  {
    icon: '✨',
    title: 'Premium Quality',
    desc: 'Every product in our collection is hand-selected for quality, design, and durability. We reject the ordinary and celebrate the exceptional.',
  },
  {
    icon: '🌍',
    title: 'Global Curation',
    desc: 'We source from trusted manufacturers worldwide to bring you designs that blend international trends with timeless elegance.',
  },
  {
    icon: '💡',
    title: 'Lighting Expertise',
    desc: 'Lighting transforms how a space feels. Our team studies trends, light science, and interior design to curate pieces that truly make a difference.',
  },
  {
    icon: '🤝',
    title: 'Customer First',
    desc: 'From the moment you browse to long after your delivery, we\'re here. Our 30-day return policy and 24-hour support reflect our commitment to you.',
  },
];

export default function AboutPage() {
  return (
    <div className="page-container pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-card-bg to-dark-bg opacity-80" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">💡</div>
          <h1 className="font-playfair text-5xl lg:text-6xl font-bold text-white mb-6">
            Illuminating <span className="text-gradient-gold">Your World</span>
          </h1>
          <p className="text-primary-silver text-lg max-w-2xl mx-auto leading-relaxed">
            BrightHome was born from a simple belief: the right light changes everything.
            We curate premium lighting and home décor to help you create spaces that
            feel as beautiful as they look.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border-silver">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-playfair text-4xl font-bold text-gradient-gold mb-1">{s.value}</div>
                <div className="text-dark-silver text-sm uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-4xl font-bold text-white mb-6">
              Our <span className="text-gradient-gold">Story</span>
            </h2>
            <div className="space-y-4 text-primary-silver leading-relaxed">
              <p>
                We started BrightHome with one room — a living room that felt lifeless
                despite all the furniture and décor. The missing piece? Lighting.
                One perfectly placed pendant lamp changed everything.
              </p>
              <p>
                That discovery became an obsession. We spent months studying lighting
                design, testing products from around the world, and learning what separates
                a beautiful space from an ordinary one.
              </p>
              <p>
                Today, BrightHome delivers that same transformative experience to homes
                across the USA, UK, Australia, and worldwide — one carefully chosen
                product at a time.
              </p>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-8">
            <div className="text-center space-y-6">
              <div className="text-7xl animate-float">🏠</div>
              <blockquote className="font-playfair text-xl text-white italic">
                &ldquo;The right light doesn&apos;t just illuminate a room —
                it reveals its soul.&rdquo;
              </blockquote>
              <p className="text-dark-silver text-sm">— The BrightHome Team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-card-bg/30">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-white text-center mb-12">
            What We <span className="text-gradient-gold">Stand For</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="glass-card rounded-2xl p-6">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-playfair text-xl font-bold text-white mb-2">{v.title}</h3>
                <p className="text-dark-silver text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-playfair text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-dark-silver mb-8">
            Browse our curated collection of premium lighting and home décor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-gold px-8 py-3.5 rounded-xl font-bold text-center">
              Shop Now →
            </Link>
            <Link href="/contact" className="glass-card px-8 py-3.5 rounded-xl font-semibold text-accent-silver hover:text-gold-cta transition-colors text-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
