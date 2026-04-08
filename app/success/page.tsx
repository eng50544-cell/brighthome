'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `BH-${Date.now().toString(36).toUpperCase()}`;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-screen" />;
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w4-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-green-500">
        <svg className="w4-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      </motion.div>
      <h1 className="font-playfair text-4xl font-bold text-white mb-4">Order <span className="text-gradient-gold">Confirmed!</span></h1>
      <p className="text-dark-silver text-lg mb-8">Thank you for your purchase!</p>
      <div className="glass-card rounded-2xl p-6 mb-8 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-dark-silver text-xs uppercase mb-1">Order ID</p><p className="text-gold-cta font-bold font-mono text-sm">{orderId}</p></div>
          <div><p className="text-dark-silver text-xs uppercase mb-1">Status</p><p className="text-green-400 font-bold">Processing</p></div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="btn-gold px-8 py-4 rounded-2xl font-bold inline-block">Continue Shopping</Link>
        <Link href={`/track-order?id=${orderId}`} className="glass-card px-8 py-4 rounded-2xl font-semibold text-accent-silver hover:text-gold-cta transition-all inline-block">Track Order</Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="page-container pt-24 flex items-center justify-center min-h-screen">
      <Suspense fallback={<div className="min-h-screen" />}><SuccessContent /></Suspense>
    </div>
  );
}
