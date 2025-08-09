'use client';

import CartSidebar from './CartSidebar';
import { useCart } from '../context/CartContext';

export default function CartOverlay() {
  const { isCartOpen, closeCart } = useCart();
  return <CartSidebar isOpen={isCartOpen} onClose={closeCart} />;
}


