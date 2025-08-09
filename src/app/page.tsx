'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import axios from 'axios';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Badge from './components/ui/Badge';
import Tag from './components/ui/Tag';
import Rate from './components/ui/Rate';
import { 
  ShoppingCart, 
  User, 
  Home as HomeIcon,
  Package,
  ShoppingBag,
  Star,
  Shield,
  Headphones,
  Mail,
  Flame,
  Clock,
  Search,
  BarChart3,
  Heart,
  Share2,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Check,
  CreditCard,
  Truck,
  Settings,
  LogOut,
  MapPin,
  Eye,
  Pencil,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import CartSidebar from './components/CartSidebar';
import GradientButton from './components/GradientButton';
import Categories from './components/cateoriesList/CategoriesList';
import { useCart } from './context/CartContext';
import { Product as ProductType } from './types/Product';
import { ProductCard as ProductCardComp } from './components/products';

// Using shared Product type from types/Product.ts

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  icon: React.ReactNode;
  color: string;
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [popularProducts, setPopularProducts] = useState<ProductType[]>([]);
  const [newProducts, setNewProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, totalItems } = useCart();
  const [role, setRole] = useState<string | null>(null);

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
    const r = getUserRole();
    setRole(r ? String(r).toLowerCase() : null);
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.get("http://localhost:3000/api/products", {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const apiProducts = Array.isArray(response.data.data?.products)
          ? response.data.data.products
          : [];

        const mappedProducts: ProductType[] = apiProducts.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.thumbnail || (item.images && item.images[0]) || '',
          category: item.category,
          description: item.description || '',
          inStock: typeof item.stock === 'number' ? item.stock > 0 : true,
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          // Backend'de bu alanlar yok, manuel olarak ekliyoruz
          isNew: item.isNew || item.isFeatured || item.createdAt ? new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false, // Son 7 günde eklenenler
          isPopular: item.isPopular || item.isFeatured || (item.rating && item.rating > 4) || (item.reviewCount && item.reviewCount > 100), // Yüksek puanlı veya çok yorumlu olanlar
        }));

        // Filter popular products (isPopular = true)
        const popular = mappedProducts.filter((product: Product) => product.isPopular).slice(0, 4);
        setPopularProducts(popular);

        // Filter new products (isNew = true)
        const newArrivals = mappedProducts.filter((product: Product) => product.isNew).slice(0, 4);
        setNewProducts(newArrivals);

      } catch (err: any) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const banners = [
    {
      id: 1,
      title: 'Yeni Sezon Koleksiyonu',
      subtitle: 'En trend ürünler %50\'ye kadar indirimle',
      image: '/banner1.jpg',
      buttonText: 'Alışverişe Başla',
      buttonLink: '/products',
      gradient: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      title: 'Elektronik Fırsatları',
      subtitle: 'Teknoloji ürünlerinde büyük indirimler',
      image: '/banner2.jpg',
      buttonText: 'Elektronik Keşfet',
      buttonLink: '/products?category=1',
      gradient: 'from-green-600 to-blue-600'
    },
    {
      id: 3,
      title: 'Spor & Outdoor',
      subtitle: 'Aktif yaşam için en iyi ürünler',
      image: '/banner3.jpg',
      buttonText: 'Spor Ürünleri',
      buttonLink: '/products?category=4',
      gradient: 'from-orange-600 to-red-600'
    }
  ];




  const handleNewsletterSignup = () => {
    if (newsletterEmail) {
      alert(`Thank you! ${newsletterEmail} has been subscribed to our newsletter.`);
      setNewsletterEmail('');
    }
  };

  // Use shared ProductCard component that already links to detail page

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header is provided by GlobalHeader in layout */}

      {/* Mobile nav removed; use GlobalHeader only */}

      {/* Hero Section with Carousel */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            MelikShop'a
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Hoş Geldiniz</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            En kaliteli ürünleri en uygun fiyatlarla bulabileceğiniz online alışveriş platformu. 
            Güvenli ödeme ve hızlı teslimat garantisi ile alışverişin keyfini çıkarın.
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-16">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="hero-carousel"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className={`relative h-96 md:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-r ${banner.gradient}`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center text-white px-8">
                      <h2 className="text-4xl md:text-6xl font-bold mb-4">{banner.title}</h2>
                      <p className="text-xl md:text-2xl mb-8 opacity-90">{banner.subtitle}</p>
                      <Link href={banner.buttonLink}>
                        <GradientButton 
                          variant="purple-pink"
                          size="lg"
                          className="text-lg h-12 px-8 bg-white text-gray-900 hover:bg-gray-100"
                        >
                          {banner.buttonText}
                        </GradientButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features Section - Carousel Altında */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Star className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600">
              Siparişleriniz 24 saat içinde kapınızda. Güvenli ve hızlı teslimat garantisi.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Shield className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Güvenli Ödeme</h3>
            <p className="text-gray-600">
              SSL sertifikalı güvenli ödeme sistemi ile güvenle alışveriş yapın.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Headphones className="text-white text-2xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">7/24 Destek</h3>
            <p className="text-gray-600">
              Müşteri hizmetlerimiz her zaman yanınızda. Sorularınız için bize ulaşın.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
          <p className="text-lg text-gray-600">
            İhtiyacınız olan ürünleri kategorilere göre keşfedin
          </p>
        </div>
        
       
          <Categories />
       
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-lg text-gray-600">
              En çok tercih edilen ürünlerimizi keşfedin
            </p>
          </div>
          <Link href="/products?filter=popular">
            <Button variant="outline" className="hidden md:block">
              Tümünü Gör
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="h-full">
                <div className="w-full h-32 bg-gray-200 rounded-t-lg animate-pulse"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularProducts.map((product) => (
              <ProductCardComp key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Yeni Gelenler</h2>
            <p className="text-lg text-gray-600">
              En son eklenen ürünlerimizi keşfedin
            </p>
          </div>
          <Link href="/products?filter=new">
            <Button variant="outline" className="hidden md:block">
              Tümünü Gör
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="h-full">
                <div className="w-full h-32 bg-gray-200 rounded-t-lg animate-pulse"></div>
                <div className="p-3">
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {newProducts.map((product) => (
              <ProductCardComp key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>



     
      {/* Features Section */}
      {/* This section is now moved to appear right after the carousel */}

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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
