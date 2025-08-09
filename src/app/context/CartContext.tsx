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
  hideToast: () => void;
  // Global cart sidebar controls
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toast: {
    message: string;
    isVisible: boolean;
    type: 'success' | 'error' | 'info';
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('Raw savedCart:', savedCart);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart:', parsedCart);
        console.log('Is array:', Array.isArray(parsedCart));
        
        if (Array.isArray(parsedCart)) {
          console.log('Array length:', parsedCart.length);
          console.log('First item:', parsedCart[0]);
          
          // Her item'ı kontrol et
          const validItems = parsedCart.every((item, index) => {
            const isValid = item && 
                          item.id && 
                          item.name && 
                          typeof item.price === 'number' && 
                          typeof item.quantity === 'number';
            console.log(`Item ${index}:`, item, 'Valid:', isValid);
            return isValid;
          });
          
          if (validItems) {
            setCartItems(parsedCart);
            console.log('✅ Cart loaded from localStorage:', parsedCart);
          } else {
            console.warn('❌ Invalid cart format in localStorage, clearing...');
            localStorage.removeItem('cart');
          }
        } else {
          console.warn('❌ Cart is not an array, clearing...');
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error('❌ Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    } else {
      console.log('No cart found in localStorage');
    }
    console.log('=== END LOCALSTORAGE DEBUG ===');
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

  const hideToast = () => {
    setToast({
      message: '',
      isVisible: false,
      type: 'success'
    });
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('=== ADD TO CART DEBUG ===');
    console.log('Adding item:', item);
    console.log('Current cart items:', cartItems);
    
    setCartItems(prev => {
      console.log('Previous cart items:', prev);
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      console.log('Existing item:', existingItem);
      
      if (existingItem) {
        // If item already exists, increase quantity
        const updatedItems = prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log('Updated items (existing):', updatedItems);
        showToast(`${item.name} sepete eklendi! (${existingItem.quantity + 1} adet)`);
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        const newItem = { ...item, quantity: 1 };
        const updatedItems = [...prev, newItem];
        console.log('Updated items (new):', updatedItems);
        showToast(`${item.name} sepete eklendi!`);
        return updatedItems;
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
    localStorage.removeItem('cart'); // localStorage'ı da temizle
    showToast('Sepet temizlendi!');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Debug: Cart items ve totalItems'ı logla
  console.log('=== CART DEBUG ===');
  console.log('Cart Items:', cartItems);
  console.log('Cart Items Count:', cartItems.length);
  console.log('Total Items (calculated):', totalItems);
  console.log('Cart Items Details:', cartItems.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price
  })));
  console.log('==================');

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
      hideToast,
      isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
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
