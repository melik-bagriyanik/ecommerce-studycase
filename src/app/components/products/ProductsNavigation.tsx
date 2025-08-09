import Link from 'next/link';
import { ShoppingBag, User, Home as HomeIcon, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import GradientButton from '../GradientButton';
import React, { useEffect, useState } from 'react';

interface ProductsNavigationProps {
  totalItems: number;
  onCartOpen: () => void;
}

export default function ProductsNavigation({ totalItems, onCartOpen }: ProductsNavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900">MelikShop</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/products" className="text-blue-600 font-medium transition-colors">
            Ürünler
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <GradientButton 
                  variant="blue-purple"
                  size="lg"
                >
                  Hesabınız yok mu? Kaydol
                </GradientButton>
              </Link>
            </>
          ) : (
            <Button variant="ghost" onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
              <LogOut className="w-5 h-5" />
              <span>Çıkış yap</span>
            </Button>
          )}
          
          {/* Shopping Cart Icon */}
          <Button 
            variant="ghost"
            onClick={onCartOpen}
            className="relative hover:text-blue-600"
          >
            <ShoppingBag className="w-5 h-5" />
            <Badge count={totalItems} size="sm" className="absolute -top-1 -right-1">
              <span></span>
            </Badge>
          </Button>
          
          {/* Profile Icon */}
          <Link href="/profile">
            <Button 
              variant="ghost"
              className="hover:text-blue-600"
            >
              <User className="w-5 h-5" />
              Profil
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <HomeIcon className="text-lg mb-1" />
            <span>Ana Sayfa</span>
          </Link>

          <Link href="/products" className="flex flex-col items-center text-xs text-blue-600">
            <ShoppingBag className="text-lg mb-1" />
            <span>Ürünler</span>
          </Link>
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 relative"
            onClick={onCartOpen}
          >
            <ShoppingBag className="text-lg mb-1" />
            <span>Sepetim</span>
            <Badge count={totalItems} size="sm" className="absolute -top-1 -right-1">
              <span></span>
            </Badge>
          </Button>
          <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <User className="text-lg mb-1" />
            <span>Profilim</span>
          </Link>
        </div>
      </div>
    </>
  );
}
