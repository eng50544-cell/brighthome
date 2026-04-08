'use client';
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const STATUS_STEPS = [
  { key: 'pending',    label: 'Order Placed',      icon: '📋', desc: 'Your order has been received' },
  { key: 'paid',       label: 'Payment Confirmed', icon: '💳', desc: 'Payment successfully processed' },
  { key: 'processing', label: 'Processing',        icon: '📦', desc: 'Your order is being prepared' },
  { key: 'shipped',    label: 'Shipped',            icon: '🚚', desc: 'Your order is on its way' },
  { key: 'delivered',  label: 'Delivered',          icon: '🏠', desc: 'Package delivered successfully' },
];

interface OrderData {
  orderId: string;
  total: number;
  status: string;
  tracking?: { trackingNumber?: string; carrier?: string; url?: string };
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [email,   setEmail]   = useState('');
  const [order,   setOrder]   = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`/api/orders?orderId=${orderId}&email=${email}`);
      const data = await res.json();
      if (data.orders?.[0]) {
        setOrder(data.orders[0]);
      } else {
        setError('Order not found. Please check your Order ID and email.');
      }
    } catch {
      setError('Could not fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? STATUS_STEPS.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🚚</div>
        <h1 className="font-playfair text-4xl font-bold text-white mb-2">
          Track Your <span className="text-gradient-gold">Order</span>
        </h1>
        <p className="text-dark-silver">Enter your order details to see the latest status</p>
      </div>

      <form onSubmit={handleTrack} className="glass-card rounded-2xl p-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-accent-silver mb-2">Order ID</label>
            <input type="text" placeholder="BH-XXXXXX-XXXX" value={orderId} onChange={e => setOrderId(e.target.value)} required className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-accent-silver mb-2">Email Address</label>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="input-dark w-full px-4 py-3 rounded-xl text-sm" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-gold py-3 rounded-xl font-bold disabled:opacity-60">
            {loading ? 'Searching...' : 'Track Order →'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </form>

      {order && (
        <div className="glass-card rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-dark-silver text-xs uppercase tracking-wider">Order ID</p>
              <p className="text-gold-cta font-bold text-lg font-mono">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-dark-silver text-xs uppercase tracking-wider">Total</p>
              <p className="text-accent-silver font-bold text-lg">${order.total?.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-1 mb-6">
            {STATUS_STEPS.map((step, i) => {
              const isDone    = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all
                    ${isDone ? 'bg-gold-cta/20 border-2 border-gold-cta' : 'glass-card border border-border-silver'}`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDone ? 'text-accent-silver' : 'text-dark-silver'}`}>
                      {step.label}
                      {isCurrent && <span className="ml-2 text-xs bg-gold-cta/20 text-gold-cta px-2 py-0.5 rounded-full">Current</span>}
                    </p>
                    <p className="text-dark-silver text-xs">{step.desc}</p>
                  </div>
                  {isDone && <div className="text-green-400 text-sm">✓</div>}
                </div>
              );
            })}
          </div>

          {order.tracking?.trackingNumber && (
            <div className="border-t border-border-silver pt-4">
              <p className="text-dark-silver text-xs uppercase tracking-wider mb-1">Tracking Number</p>
              <p className="text-accent-silver font-bold">{order.tracking.trackingNumber}</p>
              {order.tracking.carrier && <p className="text-dark-silver text-sm">{order.tracking.carrier}</p>}
              {order.tracking.url && (
                <a href={order.tracking.url} target="_blank" rel="noopener noreferrer" className="text-gold-cta text-sm hover:underline mt-1 inline-block">
                  Track on carrier website →
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="page-container pt-24">
      <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12 text-center"><div className="skeleton h-8 w-64 mx-auto rounded-xl mb-4" /><div className="skeleton h-48 rounded-2xl" /></div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}
