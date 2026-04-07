'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string; name: string; price: number; image: string; quantity: number; variant?: string;
}

interface CartState { items: CartItem[]; total: number; count: number; }

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const ex = state.items.find(i => i.id === action.payload.id);
      const items = ex ? state.items.map(i => i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i) : [...state.items, { ...action.payload, quantity: 1 }];
      return { ...state, items, total: items.reduce((s,i)=>s+i.price*i.quantity,0), count: items.reduce((s,i)=>s+i.quantity,0) };
    }
    case 'REMOVE_ITEM': { const items = state.items.filter(i => i.id !== action.payload); return { ...state, items, total: items.reduce((s,i)=>s+i.price*i.quantity,0), count: items.reduce((s,i)=>s+i.quantity,0) }; }
    case 'UPDATE_QUANTITY': { const items = state.items.map(i => i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i).filter(i => i.quantity > 0); return { ...state, items, total: items.reduce((s,i)=>s+i.price*i.quantity,0), count: items.reduce((s,i)=>s+i.quantity,0) }; }
    case 'CLEAR_CART': return { items: [], total: 0, count: 0 };
    case 'LOAD_CART': return { items: action.payload, total: action.payload.reduce((s,i)=>s+i.price*i.quantity,0), count: action.payload.reduce((s,i)=>s+i.quantity,0) };
    default: return state;
  }
}

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction>; addItem: (item: CartItem) => void; removeItem: (id: string) => void; updateQty: (id: string, qty: number) => void; clearCart: () => void; } | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, count: 0 });
  useEffect(() => { try { const s = localStorage.getItem('brighthome_cart'); if (s) dispatch({ type: 'LOAD_CART', payload: JSON.parse(s) }); } catch {} }, []);
  useEffect(() => { localStorage.setItem('brighthome_cart', JSON.stringify(state.items)); }, [state.items]);
  return <CartContext.Provider value={{ state, dispatch, addItem: i => dispatch({ type: 'ADD_ITEM', payload: i }), removeItem: id => dispatch({ type: 'REMOVE_ITEM', payload: id }), updateQty: (id, qty) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: qty } }), clearCart: () => dispatch({ type: 'CLEAR_CART' }) }}>{children}</CartContext.Provider>;
}

export function useCart() { const ctx = useContext(CartContext); if (!ctx) throw new Error('useCart must be used within CartProvider'); return ctx; }
