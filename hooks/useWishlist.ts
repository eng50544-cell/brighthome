'use client';
import { useState, useEffect, useCallback } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  variant?: string;
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('brighthome_wishlist');
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      setWishlist([]);
    }
  }, []);

  const addToWishlist = useCallback((item: WishlistItem) => {
    setWishlist(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      const updated = [...prev, item];
      try { localStorage.setItem('brighthome_wishlist', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      const updated = prev.filter(i => i.id !== id);
      try { localStorage.setItem('brighthome_wishlist', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((id: string) => wishlist.some(i => i.id === id), [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    try { localStorage.removeItem('brighthome_wishlist'); } catch {}
  }, []);

  return { wishlist, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist };
}
