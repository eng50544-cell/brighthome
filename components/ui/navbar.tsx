'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from './cart-context';

export default function Navbar() {
  const { state } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Collections', href: '/shop?category=collections' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Sale', href: '/shop?sale=true' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark-bg/95 backdrop-blur-md border-b border-border-silver' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-playfair text-xl font-bold text-gradient-gold">BrightHome</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link hef={link.href} key={link.href} className="text-dark-silver hover:text-gold-cta font-montserrat font-medium text-sm uppercase tracking-wider transition-colors">{link.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="text-dark-silver hover:text-gold-cta transition-colors p-2" aria-label="Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <Link href="/cart" className="relative text-dark-silver hover:text-gold-cta transition-colors p-2" aria-label="Cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {state.count > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-cta text-dark-bg text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {state.count > 9 ? '9+' : state.count}
                </span>
              )}
            </Link>
            <button className="lg:hidden text-dark-silver hover:text-gold-cta transition-colors p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="pb-4">
            <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`; }} className="flex gap-2">
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus className="flex-1 input-dark px-4 py-2.5 rounded-xl text-sm" />
              <button type="submit" className="btn-gold px-4 py-2.5 rounded-xl text-sm">Search</button>
            </form>
          </div>
        )}
        {mobileOpen && (
          <div className="lg:hidden pb-4 glass-card rounded-xl p-4 mb-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-3 px-2 text-dark-silver hover:text-gold-cta font-montserrat font-medium text-sm uppercase tracking-wider border-b border-border-silver last:border-0 transition-colors">{link.label}</Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
