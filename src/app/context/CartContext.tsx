'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  originalPrice?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: {
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  }>({
    message: '',
    isVisible: false,
    type: 'success'
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({
      message,
      isVisible: true,
      type
    });
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        showToast(`${item.name} sepete eklendi! (${existingItem.quantity + 1} adet)`);
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        showToast(`${item.name} sepete eklendi!`);
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string | number) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    if (itemToRemove) {
      showToast(`${itemToRemove.name} sepetten çıkarıldı!`);
    }
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Sepet temizlendi!');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      showToast,
      toast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
