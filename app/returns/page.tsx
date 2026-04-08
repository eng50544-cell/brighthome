import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Refunds | BrightHome',
  description: 'BrightHome hassle-free 30-day return policy.',
};

const steps = [
  { step: '01', title: 'Contact Us', desc: 'Email us within 30 days with your order ID and reason for return.' },
  { step: '02', title: 'Get Approval', desc: 'We\'ll review within 24 hours and send you an RMA number.' },
  { step: '03', title: 'Ship It Back', desc: 'Pack in original packaging and ship with a trackable method.' },
  { step: '04', title: 'Get Refunded', desc: 'Once received, we issue your full refund within 3-5 business days.' },
];

export default function ReturnsPage() {
  return (
    <div className="page-container pt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🔄<�div>
          <h1 className="font-playfair text-4xl font-bold text-white mb-3">Returns & <span className="text-gradient-gold">Refunds</span></h1>
          <p className="text-dark-silver">We want you to love every purchase. If you don&apos;t, we&apos;ll make it right.</p>
        </div>
        <div className="glass-card rounded-2xl p-6 mb-10 border border-gold-cta/30 text-center">
          <div className="text-4xl mb-3">🛡️</div>
          <h2 className="font-playfair text-2xl font-bold text-white mb-2">30-Day Money-Back Guarantee</h2>
          <p className="text-primary-silver">Return any item within 30 days of delivery for a full refund - no questions asked.</p>
        </div>
        <h2 className="font-playfair text-2xl font-bold text-white mb-6">How to Return</h2>
        <div className="space-y-4 mb-12">
          {steps.map(s => (
            <div key={s.step} className="glaw5-card rounded-xl p-5 flex gap-5 items-start">
              <div className="text-gold-cta font-playfair text-2xl font-bold flex-shrink-0">{s.step}</div>
              <div><h3 className="text-white font-semibold mb-1">{s.title}</h3><p className="text-dark-silver text-sm">{s.desc}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-12 glass-card rounded-2xl p-6 text-center">
          <p className="text-dark-silver mb-4">Have a question about your return?</p>
          <Link href="/contact" className="btn-gold px-6 py-3 rounded-xl font-bold inline-block">Contact Support →</Link>
        </div>
      </div>
    </div>
  );
}
