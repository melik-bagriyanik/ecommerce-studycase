'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Badge from './components/ui/Badge';
import Tag from './components/ui/Tag';
import Rate from './components/ui/Rate';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HomeIcon,
  CategoryIcon,
  ShoppingIcon,
  StarIcon,
  SafetyIcon,
  CustomerServiceIcon,
  MailIcon,
  FireIcon,
  ClockIcon,
  SearchIcon
} from './components/icons/index';
import CartSidebar from './components/CartSidebar';
import GradientButton from './components/GradientButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  isNew?: boolean;
  isPopular?: boolean;
}

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

  const featuredProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 1199.99,
      originalPrice: 1299.99,
      rating: 4.8,
      reviewCount: 1247,
      image: '/iphone.jpg',
      category: 'Electronics',
      isPopular: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      price: 1099.99,
      rating: 4.7,
      reviewCount: 892,
      image: '/samsung.jpg',
      category: 'Electronics',
      isNew: true
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      price: 129.99,
      originalPrice: 159.99,
      rating: 4.6,
      reviewCount: 456,
      image: '/nike.jpg',
      category: 'Clothing',
      isPopular: true
    },
    {
      id: 4,
      name: 'MacBook Pro M3',
      price: 1999.99,
      rating: 4.9,
      reviewCount: 678,
      image: '/macbook.jpg',
      category: 'Electronics',
      isNew: true
    }
  ];

  const newArrivals: Product[] = [
    {
      id: 5,
      name: 'Sony WH-1000XM5',
      price: 349.99,
      rating: 4.8,
      reviewCount: 234,
      image: '/sony.jpg',
      category: 'Electronics',
      isNew: true
    },
    {
      id: 6,
      name: 'Adidas Ultraboost 22',
      price: 189.99,
      rating: 4.7,
      reviewCount: 123,
      image: '/adidas.jpg',
      category: 'Clothing',
      isNew: true
    },
    {
      id: 7,
      name: 'Apple Watch Series 9',
      price: 399.99,
      rating: 4.9,
      reviewCount: 567,
      image: '/applewatch.jpg',
      category: 'Electronics',
      isNew: true
    },
    {
      id: 8,
      name: 'Dell XPS 13',
      price: 1299.99,
      rating: 4.6,
      reviewCount: 89,
      image: '/dell.jpg',
      category: 'Electronics',
      isNew: true
    }
  ];

  const popularProducts: Product[] = [
    {
      id: 9,
      name: 'Harry Potter Complete Set',
      price: 79.99,
      originalPrice: 99.99,
      rating: 4.9,
      reviewCount: 2156,
      image: '/harry-potter.jpg',
      category: 'Books',
      isPopular: true
    },
    {
      id: 10,
      name: 'L\'Oreal Paris Skincare Set',
      price: 49.99,
      rating: 4.3,
      reviewCount: 445,
      image: '/loreal.jpg',
      category: 'Health and Beauty',
      isPopular: true
    },
    {
      id: 11,
      name: 'LEGO Star Wars Millennium Falcon',
      price: 159.99,
      rating: 4.8,
      reviewCount: 789,
      image: '/lego.jpg',
      category: 'Toys',
      isPopular: true
    },
    {
      id: 12,
      name: 'Organic Honey 500g',
      price: 12.99,
      rating: 4.6,
      reviewCount: 234,
      image: '/honey.jpg',
      category: 'Food',
      isPopular: true
    }
  ];

  const categories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and tech',
      productCount: 245,
      icon: <ShoppingIcon />,
      color: 'from-blue-600 to-purple-600'
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and accessories',
      productCount: 189,
      icon: <CategoryIcon />,
      color: 'from-green-600 to-blue-600'
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Home decor and garden',
      productCount: 156,
      icon: <HomeIcon />,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Sports equipment',
      productCount: 98,
      icon: <StarIcon />,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 5,
      name: 'Books',
      description: 'Books and literature',
      productCount: 312,
      icon: <CustomerServiceIcon />,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 6,
      name: 'Health & Beauty',
      description: 'Beauty and wellness',
      productCount: 134,
      icon: <SafetyIcon />,
      color: 'from-pink-600 to-rose-600'
    }
  ];

  const handleNewsletterSignup = () => {
    if (newsletterEmail) {
      alert(`Thank you! ${newsletterEmail} has been subscribed to our newsletter.`);
      setNewsletterEmail('');
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      hoverable 
      className="h-full"
      cover={
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ShoppingIcon className="text-white text-xl" />
          </div>
          {product.isNew && (
            <Tag color="green" className="absolute top-2 left-2">
              <ClockIcon /> New
            </Tag>
          )}
          {product.isPopular && (
            <Tag color="red" className="absolute top-2 left-2">
              <FireIcon /> Popular
            </Tag>
          )}
          {product.originalPrice && (
            <Tag color="blue" className="absolute top-2 right-2">
              Sale
            </Tag>
          )}
        </div>
      }
      actions={[
        <GradientButton 
          key="add-to-cart" 
          variant="blue-purple" 
          size="sm"
          onClick={() => alert(`Added ${product.name} to cart!`)}
        >
          Add to Cart
        </GradientButton>
      ]}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm line-clamp-2">{product.name}</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Rate disabled value={product.rating} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-lg">${product.price}</span>
              {product.originalPrice && (
                <span className="line-through text-gray-500 ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
        </div>
      </div>
    </Card>
  );

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
          <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Ürünler
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
            Sign In
          </Link>
          <Link href="/login">
            <GradientButton 
              variant="blue-purple"
              size="lg"
            >
              Get Started
            </GradientButton>
          </Link>
          
          {/* Shopping Cart Icon */}
          <Button 
            variant="ghost"
            icon={<ShoppingCartIcon />}
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-blue-600"
          >
            <Badge count={3} size="sm" className="absolute -top-1 -right-1">
              <span></span>
            </Badge>
          </Button>
          
          {/* Profile Icon */}
          <Link href="/profile">
            <Button 
              variant="ghost"
              icon={<UserIcon />}
              className="hover:text-blue-600"
            >
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

          <Link href="/products" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <ShoppingIcon className="text-lg mb-1" />
            <span>Ürünler</span>
          </Link>
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCartIcon className="text-lg mb-1" />
            <span>Sepetim</span>
            <Badge count={3} size="sm" className="absolute -top-1 -right-1">
              <span></span>
            </Badge>
          </Button>
          <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <UserIcon className="text-lg mb-1" />
            <span>Profilim</span>
          </Link>
        </div>
      </div>

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
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
          <p className="text-lg text-gray-600">
            İhtiyacınız olan ürünleri kategorilere göre keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link href={`/products?category=${category.id}`} key={category.id}>
              <Card 
                hoverable 
                className="h-full text-center transition-all duration-300 hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                  <div className="text-white text-2xl">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">
                  {category.description}
                </p>
                <span className="text-gray-500">{category.productCount} ürün</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
          <p className="text-lg text-gray-600">
            En çok tercih edilen ürünlerimizi keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Yeni Gelenler</h2>
          <p className="text-lg text-gray-600">
            En son eklenen ürünlerimizi keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Ürünler</h2>
          <p className="text-lg text-gray-600">
            En çok satan ürünlerimizi keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Card 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center border-0"
        >
          <div className="p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Bültenimize Katılın</h2>
            <p className="text-xl mb-8 opacity-90 text-white">
              En son ürünler ve özel fırsatlar hakkında bilgi alın
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex w-full">
                <Input
                  size="lg"
                  placeholder="E-posta adresiniz"
                  prefix={<MailIcon />}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  onPressEnter={handleNewsletterSignup}
                  className="flex-1"
                />
                <GradientButton 
                  variant="purple-pink"
                  size="lg"
                  onClick={handleNewsletterSignup}
                  className="ml-2"
                >
                  Abone Ol
                </GradientButton>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            hoverable 
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-6 flex items-center justify-center">
                <StarIcon className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Hızlı Teslimat</h3>
              <p className="text-gray-600">
                Siparişleriniz 24 saat içinde kapınızda. Güvenli ve hızlı teslimat garantisi.
              </p>
            </div>
          </Card>
          
          <Card 
            hoverable 
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg mb-6 flex items-center justify-center">
                <SafetyIcon className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Güvenli Ödeme</h3>
              <p className="text-gray-600">
                SSL sertifikalı güvenli ödeme sistemi ile güvenle alışveriş yapın.
              </p>
            </div>
          </Card>
          
          <Card 
            hoverable 
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mb-6 flex items-center justify-center">
                <CustomerServiceIcon className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">7/24 Destek</h3>
              <p className="text-gray-600">
                Müşteri hizmetlerimiz her zaman yanınızda. Sorularınız için bize ulaşın.
              </p>
            </div>
          </Card>
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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
