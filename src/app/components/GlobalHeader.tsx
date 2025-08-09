'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { ShoppingBag, User, BarChart3, LogOut } from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import GradientButton from './GradientButton';
import { useCart } from '../context/CartContext';

export default function GlobalHeader() {
  const { totalItems, openCart } = useCart();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const getUserRole = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const payloadJson = JSON.parse(atob(payloadBase64));
            const candidates: any[] = [
              payloadJson?.role,
              Array.isArray(payloadJson?.roles) ? payloadJson.roles[0] : undefined,
              payloadJson?.user?.role,
              payloadJson?.role?.name,
              payloadJson?.permissions?.includes?.('admin') ? 'admin' : undefined,
              payloadJson?.isAdmin ? 'admin' : undefined,
            ].filter(Boolean);
            if (candidates.length > 0) return String(candidates[0]);
          }
        }
        const storedRole = localStorage.getItem('role');
        if (storedRole) return storedRole;
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            if (userObj?.role) return String(userObj.role);
            if (userObj?.isAdmin) return 'admin';
          } catch {}
        }
        return null;
      } catch {
        return null;
      }
    };
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
    const r = getUserRole();
    setRole(r ? String(r).toLowerCase() : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isEmailVerified');
    window.location.href = '/login';
  };

  return (
    <nav style={{ padding: '20px 80px' }} className="flex bg-violet-50 items-center justify-between px-4 py-3 md:p-6  mx-auto">
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
          <span className="text-xl font-bold text-gray-900">MlkShop</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Ana Sayfa</Link>
        <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Ürünler</Link>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Auth (mobile) */}
        {!isLoggedIn ? (
          <>
            <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors md:hidden text-sm">Giriş</Link>
            <Link href="/register" className="md:hidden">
              <GradientButton variant="blue-purple" size="sm">Kaydol</GradientButton>
            </Link>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Çıkış yap</span>
          </Button>
        )}

        {/* Auth (desktop) */}
        {!isLoggedIn && (
          <>
            <Link href="/login" className="hidden md:inline text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/register" className="hidden md:inline">
              <GradientButton variant="blue-purple" size="lg">Hesabınız yok mu? Kaydol</GradientButton>
            </Link>
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="relative hover:text-blue-600"
          onClick={openCart}
          aria-label="Sepeti aç"
        >
          <ShoppingBag className="w-5 h-5" />
          <Badge count={totalItems} size="sm" className="absolute -top-1 -right-1">
            <span />
          </Badge>
        </Button>

        {isLoggedIn && (
          <Link href="/profile">
            <Button size="sm" variant="ghost" className="hover:text-blue-600">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Profil</span>
            </Button>
          </Link>
        )}

        {isLoggedIn && role === 'admin' && (
          <Link href="/admin">
            <Button size="sm" variant="ghost" className="hover:text-blue-600">
              <BarChart3 className="w-5 h-5" />
              <span className="hidden md:inline">Admin</span>
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}


