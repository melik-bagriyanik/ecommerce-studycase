'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: 'Electronics',
      description: 'En son teknoloji ürünleri, akıllı telefonlar, bilgisayarlar ve elektronik aksesuarlar',
      image: '/electronics.jpg',
      productCount: 245,
      isActive: true
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Moda trendlerine uygun giyim ürünleri, ayakkabılar ve aksesuarlar',
      image: '/clothing.jpg',
      productCount: 189,
      isActive: true
    },
    {
      id: 3,
      name: 'Home and Garden',
      description: 'Ev dekorasyonu, bahçe ürünleri ve ev yaşamı için her şey',
      image: '/home-garden.jpg',
      productCount: 156,
      isActive: true
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Spor ekipmanları, fitness ürünleri ve outdoor aktivite malzemeleri',
      image: '/sports.jpg',
      productCount: 98,
      isActive: true
    },
    {
      id: 5,
      name: 'Books',
      description: 'Edebiyat, akademik, çocuk kitapları ve dijital okuma materyalleri',
      image: '/books.jpg',
      productCount: 312,
      isActive: true
    },
    {
      id: 6,
      name: 'Health and Beauty',
      description: 'Kozmetik ürünleri, kişisel bakım ve sağlık ürünleri',
      image: '/health-beauty.jpg',
      productCount: 134,
      isActive: true
    },
    {
      id: 7,
      name: 'Toys',
      description: 'Çocuk oyuncakları, eğitici materyaller ve hobi ürünleri',
      image: '/toys.jpg',
      productCount: 87,
      isActive: true
    },
    {
      id: 8,
      name: 'Food',
      description: 'Taze gıda ürünleri, organik besinler ve özel diyet ürünleri',
      image: '/food.jpg',
      productCount: 203,
      isActive: true
    }
  ]);

  const [sortBy, setSortBy] = useState<'name' | 'productCount'>('name');
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const toggleCategoryActive = (id: number) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const sortedCategories = categories
    .filter(cat => !showActiveOnly || cat.isActive)
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.productCount - a.productCount;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
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
          <Link href="/categories" className="text-blue-600 font-medium transition-colors">
            Kategoriler
          </Link>
          <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Ürünler
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Get Started
          </Link>
          
          {/* Shopping Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Link>
          
          {/* Profile Icon */}
          <Link href="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <Link href="/" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Ana Sayfa</span>
          </Link>
          <Link href="/categories" className="flex flex-col items-center text-xs text-blue-600">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Kategoriler</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Ürünler</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 relative">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span>Sepetim</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Profilim</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kategoriler</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            İhtiyacınız olan ürünleri kategorilere göre keşfedin. Her kategori özenle seçilmiş ürünlerle dolu.
          </p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Sadece aktif kategorileri göster</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'productCount')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">İsme göre</option>
              <option value="productCount">Ürün sayısına göre</option>
            </select>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCategories.map((category) => (
            <div
              key={category.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                !category.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Category Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-2xl flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                {!category.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Pasif
                  </div>
                )}
              </div>

              {/* Category Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                  <button
                    onClick={() => toggleCategoryActive(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.isActive ? 'Aktif' : 'Pasif'}
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} ürün
                  </span>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Ürünleri Gör
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Kategori Özeti</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {categories.filter(cat => cat.isActive).length}
                </div>
                <div className="text-gray-600">Aktif Kategori</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                </div>
                <div className="text-gray-600">Toplam Ürün</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <span className="text-xl font-bold">MelikShop</span>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-white transition-colors">Şartlar</a>
              <a href="#" className="hover:text-white transition-colors">İletişim</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MelikShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 