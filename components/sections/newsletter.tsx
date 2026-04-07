'use client';
import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="section-padding bg-dark-bg relative overflow-hidden">
      <div className="relative max-w-2xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-14 border-gold-cta/20">
          <div className="text-4xl mb-4">✉㏏!</div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-3">
            Get <span className="text-gradient-gold">Exclusive Deals</span>
          </h2>
          <p className="text-dark-silver mb-8 leading-relaxed">
            Join 50,000+ subscribers and get first access to new arrivals, flash sales, and interior inspiration.
          </p>
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-green-400 font-semibold">You&apos;re subscribed!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="input-dark flex-1 px-5 py-3.5 rounded-xl text-sm" />
              <button type="submit" disabled={status === 'loading'} className="btn-gold px-6 py-3.5 rounded-xl text-sm font-bold">
                {status === 'loading' ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
