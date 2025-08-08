'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Trash2, Minus, Plus, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  // Debug: TotalItems'ı logla
  useEffect(() => {
    console.log('CartSidebar totalItems:', totalItems);
  }, [totalItems]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const tax = subtotal * 0.18; // %18 KDV
  const shipping = subtotal > 500 ? 0 : 29.99; // 500 TL üzeri ücretsiz kargo
  const total = subtotal + tax + shipping;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleCheckout = () => {
    // Kullanıcının giriş yapıp yapmadığını kontrol et
    const token = localStorage.getItem('token');
    
    if (!token) {
      // Giriş yapmamışsa login sayfasına yönlendir
      router.push('/login');
      return;
    }
    
    // Cart items'ı localStorage'a kaydet
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', JSON.stringify({
      subtotal,
      tax,
      shipping,
      total
    }));
    handleClose();
    router.push('/checkout');
  };

  return (
    <>
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sepetim</h2>
            <p className="text-sm text-gray-500">{totalItems} ürün</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Sepetiniz Boş</h3>
              <p className="text-gray-500 mb-6">Alışverişe başlamak için ürünlerimize göz atın.</p>
              <Button onClick={handleClose}>
                Alışverişe Başla
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.price.toFixed(2)} TL</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toFixed(2)} TL
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ara Toplam</span>
                <span className="font-medium">{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">KDV (%18)</span>
                <span className="font-medium">{tax.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Kargo</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Ücretsiz</span>
                  ) : (
                    `${shipping.toFixed(2)} TL`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <div className="text-xs text-green-600 text-center">
                  {500 - subtotal > 0 ? `${(500 - subtotal).toFixed(2)} TL daha alışveriş yapın, kargo ücretsiz!` : ''}
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Toplam</span>
                  <span className="text-lg font-semibold">{total.toFixed(2)} TL</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
            >
              Ödemeye Geç ({total.toFixed(2)} TL)
            </Button>
          </div>
        )}
      </div>
    </>
  );
} 