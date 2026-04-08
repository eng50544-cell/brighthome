'use client';
import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const info = [
    { icon: '📧', label: 'Email', value: 'hello@brighthouse.website', href: 'mailto:hello@brighthouse.website' },
    { icon: '⏰', label: 'Response Time', value: 'Within 24 hours', href: null },
    { icon: '🌍', label: 'Ships To', value: 'USA · UK · Australia · Worldwide', href: null },
    { icon: '🔄', label: 'Returns', value: '30-day hassle-free returns', href: null },
  ];

  return (
    <div className="page-container pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="font-playfair text-4xl font-bold text-white mb-3">Get In <span className="text-gradient-gold">Touch</span></h1>
          <p className="text-dark-silver max-w-md mx-auto">Have a question? We&apos;re here to help.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {info.map(item => (
              <div key={item.label} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                <div className="text-2xl">{item.icon}</div>
                <div><p className="text-dark-silver text-xs uppercase tracking-wider mb-1">{item.label}</p>{item.href ? <a href={item.href} className="text-gold-cta font-semibold text-sm hover:underline">{item.value}</a> : <p className="text-accent-silver font-semibold text-sm">{item.value}</p>}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-8">
              {status === 'success' ? (
                <div className="text-center py-8"><div className="text-5xl mb-4">✅</div><h3 className="font-playfair text-2xl font-bold text-white mb-2">Message Sent!</h3><p className="text-dark-silver">We&apos;ll get back to you within 24 hours.</p></div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-dark-silver uppercase tracking-wider mb-2">Name</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" required className="input-dark w-full px-4 py-3 rounded-xl text-sm" /></div>
                    <div><label className="block text-xs font-semibold text-dark-silver uppercase tracking-wider mb-2">Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required className="input-dark w-full px-4 py-3 rounded-xl text-sm" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-dark-silver uppercase tracking-wider mb-2">Subject</label><select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required className="input-dark w-full px-4 py-3 rounded-xl text-sm"><option value="">Select a topic...</option><option value="order">Order Status</option><option value="return">Return / Refund</option><option value="product">Product Question</option><option value="other">Other</option></select></div>
                  <div><label className="block text-xs font-semibold text-dark-silver uppercase tracking-wider mb-2">Message</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your question..." required rows={5} className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none" /></div>
                  <button type="submit" disabled={status === 'loading'} className="w-full btn-gold py-3.5 rounded-xl font-bold disabled:opacity-60">{status === 'loading' ? 'Sending...' : 'Send Message 膰'}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
