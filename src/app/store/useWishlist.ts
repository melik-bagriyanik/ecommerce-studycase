'use client';

import { create } from 'zustand';

export interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  category?: string;
}

interface WishlistState {
  items: WishlistItem[];
  hydrated: boolean;
  hydrate: () => void;
  add: (item: WishlistItem) => void;
  remove: (id: string | number) => void;
  toggle: (item: WishlistItem) => void;
  has: (id: string | number) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistState>((set, get) => ({
  items: [],
  hydrated: false,
  hydrate: () => {
    try {
      const raw = localStorage.getItem('wishlist');
      const data = raw ? JSON.parse(raw) : [];
      set({ items: Array.isArray(data) ? data : [], hydrated: true });
    } catch {
      set({ items: [], hydrated: true });
    }
  },
  add: (item) => {
    const exists = get().items.find((i) => String(i.id) === String(item.id));
    if (exists) return;
    const next = [item, ...get().items];
    set({ items: next });
    localStorage.setItem('wishlist', JSON.stringify(next));
  },
  remove: (id) => {
    const next = get().items.filter((i) => String(i.id) !== String(id));
    set({ items: next });
    localStorage.setItem('wishlist', JSON.stringify(next));
  },
  toggle: (item) => {
    const exists = get().items.find((i) => String(i.id) === String(item.id));
    if (exists) {
      get().remove(item.id);
    } else {
      get().add(item);
    }
  },
  has: (id) => Boolean(get().items.find((i) => String(i.id) === String(id))),
  clear: () => {
    set({ items: [] });
    localStorage.setItem('wishlist', JSON.stringify([]));
  },
}));


