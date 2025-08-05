'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Tag from '../../components/ui/Tag';
import Rate from '../../components/ui/Rate';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HomeIcon,
  ShoppingIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  ArrowLeftIcon,
  HeartIcon,
  ShareIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon
} from '../../components/icons/index';
import CartSidebar from '../../components/CartSidebar';
import GradientButton from '../../components/GradientButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  category: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  isNew?: boolean;
  isPopular?: boolean;
  specifications: {
    [key: string]: string;
  };
  reviews: Review[];
}

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isPopular?: boolean;
}

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);

  // Comprehensive product database
  const productsDatabase: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB Titanium',
      price: 1199.99,
      originalPrice: 1299.99,
      description: 'En son teknoloji ile donatılmış akıllı telefon',
      longDescription: 'iPhone 15 Pro Max, Apple\'ın en gelişmiş iPhone modelidir. A17 Pro çip ile güçlendirilmiş bu cihaz, profesyonel fotoğrafçılık ve videografi için optimize edilmiştir. Titanium tasarımı ile hem şık hem de dayanıklıdır.',
      images: [
        '/iphone-1.jpg',
        '/iphone-2.jpg', 
        '/iphone-3.jpg',
        '/iphone-4.jpg'
      ],
      category: 1,
      rating: 4.8,
      reviewCount: 1247,
      inStock: true,
      stockQuantity: 15,
      isPopular: true,
      specifications: {
        'Ekran': '6.7 inch Super Retina XDR OLED',
        'İşlemci': 'A17 Pro chip',
        'RAM': '8GB',
        'Depolama': '256GB',
        'Kamera': '48MP Ana + 12MP Ultra Wide + 12MP Telephoto',
        'Pil': '4441mAh',
        'İşletim Sistemi': 'iOS 17',
        'Renk': 'Titanium',
        'Ağırlık': '221g',
        'Su Geçirmezlik': 'IP68'
      },
      reviews: [
        {
          id: 1,
          user: 'Ahmet Yılmaz',
          rating: 5,
          date: '2024-01-15',
          comment: 'Harika bir telefon! Kamera kalitesi inanılmaz ve performansı çok iyi. Kesinlikle tavsiye ederim.',
          helpful: 24
        },
        {
          id: 2,
          user: 'Fatma Demir',
          rating: 4,
          date: '2024-01-10',
          comment: 'Genel olarak çok memnunum. Tek sorun pil ömrü biraz kısa olabilir ama hızlı şarj ile sorun çözülüyor.',
          helpful: 18
        }
      ]
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 1099.99,
      originalPrice: 1199.99,
      description: 'Güçlü performans ve uzun pil ömrü',
      longDescription: 'Samsung Galaxy S24 Ultra, AI destekli özellikleri ve S Pen ile birlikte gelen premium deneyim sunar. Snapdragon 8 Gen 3 işlemci ve 200MP kamera sistemi ile profesyonel kullanım için tasarlanmıştır.',
      images: [
        '/samsung-1.jpg',
        '/samsung-2.jpg',
        '/samsung-3.jpg',
        '/samsung-4.jpg'
      ],
      category: 1,
      rating: 4.6,
      reviewCount: 892,
      inStock: true,
      stockQuantity: 8,
      isNew: true,
      specifications: {
        'Ekran': '6.8 inch Dynamic AMOLED 2X',
        'İşlemci': 'Snapdragon 8 Gen 3',
        'RAM': '12GB',
        'Depolama': '512GB',
        'Kamera': '200MP Ana + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto',
        'Pil': '5000mAh',
        'İşletim Sistemi': 'Android 14, One UI 6.1',
        'Renk': 'Titanium Gray',
        'Ağırlık': '232g',
        'Su Geçirmezlik': 'IP68'
      },
      reviews: [
        {
          id: 3,
          user: 'Mehmet Kaya',
          rating: 5,
          date: '2024-01-20',
          comment: 'S Pen özelliği çok kullanışlı. Kamera kalitesi de harika.',
          helpful: 31
        },
        {
          id: 4,
          user: 'Ayşe Özkan',
          rating: 4,
          date: '2024-01-18',
          comment: 'Performansı çok iyi ama biraz ağır. Genel olarak memnunum.',
          helpful: 15
        }
      ]
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      price: 129.99,
      originalPrice: 159.99,
      description: 'Konforlu ve şık spor ayakkabı',
      longDescription: 'Nike Air Max 270, günlük kullanım için tasarlanmış konforlu spor ayakkabıdır. Air Max teknolojisi ile maksimum konfor sağlar ve şık tasarımı ile her ortamda kullanılabilir.',
      images: [
        '/nike-1.jpg',
        '/nike-2.jpg',
        '/nike-3.jpg',
        '/nike-4.jpg'
      ],
      category: 2,
      rating: 4.7,
      reviewCount: 456,
      inStock: true,
      stockQuantity: 25,
      isPopular: true,
      specifications: {
        'Malzeme': 'Mesh üst, Sentetik alt',
        'Taban': 'Air Max 270',
        'Renk': 'Beyaz/Siyah',
        'Numara': '36-46',
        'Ağırlık': '320g',
        'Özellikler': 'Hafif, Nefes alabilir',
        'Kullanım': 'Günlük, Spor',
        'Garanti': '2 yıl'
      },
      reviews: [
        {
          id: 5,
          user: 'Can Demir',
          rating: 5,
          date: '2024-01-12',
          comment: 'Çok rahat ayakkabı. Gün boyu giyebiliyorum.',
          helpful: 42
        },
        {
          id: 6,
          user: 'Zeynep Arslan',
          rating: 4,
          date: '2024-01-08',
          comment: 'Güzel tasarım ama biraz büyük geliyor.',
          helpful: 12
        }
      ]
    },
    {
      id: 4,
      name: 'Adidas Ultraboost 22',
      price: 189.99,
      description: 'Profesyonel koşu ayakkabısı',
      longDescription: 'Adidas Ultraboost 22, profesyonel koşucular için tasarlanmış üst düzey performans ayakkabısıdır. Boost teknolojisi ve Continental kauçuk taban ile maksimum enerji geri dönüşümü sağlar.',
      images: [
        '/adidas-1.jpg',
        '/adidas-2.jpg',
        '/adidas-3.jpg',
        '/adidas-4.jpg'
      ],
      category: 2,
      rating: 4.9,
      reviewCount: 678,
      inStock: false,
      stockQuantity: 0,
      isNew: true,
      specifications: {
        'Malzeme': 'Primeknit üst',
        'Taban': 'Boost + Continental',
        'Renk': 'Siyah/Beyaz',
        'Numara': '36-46',
        'Ağırlık': '310g',
        'Özellikler': 'Hafif, Esnek',
        'Kullanım': 'Koşu, Antrenman',
        'Garanti': '2 yıl'
      },
      reviews: [
        {
          id: 7,
          user: 'Ali Koşucu',
          rating: 5,
          date: '2024-01-25',
          comment: 'Mükemmel koşu ayakkabısı. Çok rahat ve performanslı.',
          helpful: 67
        }
      ]
    },
    {
      id: 5,
      name: 'Harry Potter Complete Set',
      price: 79.99,
      originalPrice: 99.99,
      description: 'J.K. Rowling\'in tüm Harry Potter serisi',
      longDescription: 'Harry Potter serisinin tüm 7 kitabını içeren özel koleksiyon. Türkçe çevirisi ile birlikte gelen bu set, her yaştan okuyucu için mükemmel bir hediye seçeneğidir.',
      images: [
        '/harry-potter-1.jpg',
        '/harry-potter-2.jpg',
        '/harry-potter-3.jpg',
        '/harry-potter-4.jpg'
      ],
      category: 5,
      rating: 4.9,
      reviewCount: 2156,
      inStock: true,
      stockQuantity: 50,
      isPopular: true,
      specifications: {
        'Yazar': 'J.K. Rowling',
        'Çevirmen': 'Sevin Okyay',
        'Yayınevi': 'Yapı Kredi Yayınları',
        'Sayfa Sayısı': '3500+',
        'Dil': 'Türkçe',
        'Cilt': 'Sert Kapak',
        'Boyut': '13.5 x 21 cm',
        'ISBN': '9789750831234'
      },
      reviews: [
        {
          id: 8,
          user: 'Elif Yıldız',
          rating: 5,
          date: '2024-01-30',
          comment: 'Harika bir koleksiyon! Çocukluğumun kitapları.',
          helpful: 89
        },
        {
          id: 9,
          user: 'Burak Özkan',
          rating: 5,
          date: '2024-01-28',
          comment: 'Mükemmel baskı kalitesi. Hediye olarak aldım.',
          helpful: 45
        }
      ]
    },
    {
      id: 6,
      name: 'LEGO Star Wars Millennium Falcon',
      price: 159.99,
      description: 'Detaylı Star Wars LEGO seti',
      longDescription: 'LEGO Star Wars Millennium Falcon, 7541 parçadan oluşan detaylı bir modeldir. Han Solo\'nun efsanevi gemisinin birebir replikası olan bu set, koleksiyonerler için mükemmel bir seçenektir.',
      images: [
        '/lego-1.jpg',
        '/lego-2.jpg',
        '/lego-3.jpg',
        '/lego-4.jpg'
      ],
      category: 7,
      rating: 4.8,
      reviewCount: 789,
      inStock: true,
      stockQuantity: 12,
      isPopular: true,
      specifications: {
        'Parça Sayısı': '7541',
        'Yaş Grubu': '14+',
        'Boyutlar': '84 x 56 x 21 cm',
        'Minifigürler': '7 adet',
        'Seri': 'Star Wars',
        'Model': 'Millennium Falcon',
        'Zorluk': 'Orta-İleri',
        'Garanti': 'Sınırsız'
      },
      reviews: [
        {
          id: 10,
          user: 'Star Wars Fan',
          rating: 5,
          date: '2024-01-22',
          comment: 'İnanılmaz detaylı model. Yapması çok keyifli.',
          helpful: 123
        },
        {
          id: 11,
          user: 'LEGO Koleksiyoner',
          rating: 4,
          date: '2024-01-19',
          comment: 'Güzel set ama biraz pahalı.',
          helpful: 34
        }
      ]
    },
    {
      id: 7,
      name: 'MacBook Pro 14" M3 Pro',
      price: 2499.99,
      originalPrice: 2699.99,
      description: 'Profesyonel iş istasyonu',
      longDescription: 'MacBook Pro 14" M3 Pro, Apple\'ın en güçlü çiplerinden biri ile donatılmış profesyonel dizüstü bilgisayardır. 14.2 inch Liquid Retina XDR ekran ve 22 saate kadar pil ömrü ile mükemmel performans sunar.',
      images: [
        '/macbook-1.jpg',
        '/macbook-2.jpg',
        '/macbook-3.jpg',
        '/macbook-4.jpg'
      ],
      category: 3,
      rating: 4.9,
      reviewCount: 567,
      inStock: true,
      stockQuantity: 5,
      isNew: true,
      specifications: {
        'İşlemci': 'Apple M3 Pro',
        'RAM': '18GB',
        'Depolama': '512GB SSD',
        'Ekran': '14.2 inch Liquid Retina XDR',
        'Çözünürlük': '3024 x 1964',
        'Pil': '22 saat',
        'İşletim Sistemi': 'macOS Sonoma',
        'Ağırlık': '1.55kg',
        'Portlar': '3x Thunderbolt 4, HDMI, SDXC'
      },
      reviews: [
        {
          id: 12,
          user: 'Tasarımcı Ahmet',
          rating: 5,
          date: '2024-01-15',
          comment: 'Mükemmel performans. Video editing çok hızlı.',
          helpful: 78
        },
        {
          id: 13,
          user: 'Yazılımcı Mehmet',
          rating: 5,
          date: '2024-01-10',
          comment: 'Geliştirme için ideal. Çok hızlı ve stabil.',
          helpful: 56
        }
      ]
    }
  ];

  // Find product by ID
  const product = productsDatabase.find(p => p.id === productId);

  // If product not found, show error
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
            <p className="text-gray-600 mb-6">Aradığınız ürün mevcut değil.</p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Geri Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const relatedProducts: RelatedProduct[] = productsDatabase
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, 4)
    .map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images[0],
      rating: p.rating,
      reviewCount: p.reviewCount,
      isNew: p.isNew,
      isPopular: p.isPopular
    }));

  useEffect(() => {
    // Add to recently viewed
    if (productId) {
      setRecentlyViewed(prev => {
        const newList = [productId, ...prev.filter(id => id !== productId)].slice(0, 4);
        return newList;
      });
    }
  }, [productId]);

  const addToCart = () => {
    console.log(`Added ${quantity} of product ${productId} to cart`);
    alert(`${quantity} adet ${product.name} sepete eklendi!`);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDiscountPercentage = () => {
    if (product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Button 
            variant="ghost"
            icon={<ArrowLeftIcon />}
            onClick={() => router.back()}
            className="text-gray-600 hover:text-blue-600"
          >
            Geri
          </Button>
          <span className="text-gray-400">/</span>
          <Link href="/products" className="text-gray-600 hover:text-blue-600">
            Ürünler
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingIcon className="text-white text-4xl" />
              </div>
              {product.isNew && (
                <Tag color="green" className="absolute top-4 left-4">
                  <ClockIcon /> New
                </Tag>
              )}
              {product.isPopular && (
                <Tag color="red" className="absolute top-4 left-4">
                  <FireIcon /> Popular
                </Tag>
              )}
              {product.originalPrice && (
                <Tag color="blue" className="absolute top-4 right-4">
                  %{getDiscountPercentage()} İndirim
                </Tag>
              )}
              {!product.inStock && (
                <Tag color="gray" className="absolute top-4 right-4">
                  Stokta Yok
                </Tag>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg cursor-pointer transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center mx-auto mt-2">
                    <ShoppingIcon className="text-white text-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Rate disabled value={product.rating} />
                  <span className="text-sm text-gray-600">({product.reviewCount} değerlendirme)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Stok: {product.stockQuantity} adet</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                )}
                {product.originalPrice && (
                  <Badge color="green" className="text-sm">
                    %{getDiscountPercentage()} İndirim
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Açıklama</h3>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Adet:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    icon={<MinusIcon />}
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="p-2"
                  >
                    <span></span>
                  </Button>
                  <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    icon={<PlusIcon />}
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2"
                  >
                    <span></span>
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <GradientButton
                  variant="blue-purple"
                  size="lg"
                  icon={<ShoppingCartIcon />}
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </GradientButton>
                <Button
                  variant="outline"
                  icon={<HeartIcon />}
                  className="px-6"
                >
                  Favori
                </Button>
                <Button
                  variant="outline"
                  icon={<ShareIcon />}
                  className="px-6"
                >
                  Paylaş
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Müşteri Değerlendirmeleri</h2>
            <Button variant="outline">Tümünü Gör</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.reviews.map((review) => (
              <Card key={review.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.user}</h4>
                    <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                  </div>
                  <Rate disabled value={review.rating} />
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{review.helpful} kişi faydalı buldu</span>
                  <Button variant="ghost" size="sm">Faydalı</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link href={`/products/${relatedProduct.id}`} key={relatedProduct.id}>
                <Card hoverable className="h-full">
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <ShoppingIcon className="text-white text-xl" />
                    </div>
                    {relatedProduct.isNew && (
                      <Tag color="green" className="absolute top-2 left-2">
                        New
                      </Tag>
                    )}
                    {relatedProduct.isPopular && (
                      <Tag color="red" className="absolute top-2 left-2">
                        Popular
                      </Tag>
                    )}
                    {relatedProduct.originalPrice && (
                      <Tag color="blue" className="absolute top-2 right-2">
                        Sale
                      </Tag>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Rate disabled value={relatedProduct.rating} />
                      <span className="text-xs text-gray-500">({relatedProduct.reviewCount})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">${relatedProduct.price}</span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        {recentlyViewed.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Son Görüntülenenler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.slice(1).map((productId) => (
                <Link href={`/products/${productId}`} key={productId}>
                  <Card hoverable className="h-full">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <ShoppingIcon className="text-white text-xl" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Ürün {productId}</h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">$999.99</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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

export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Yükleniyor...</h2>
          <p className="text-sm text-gray-600">Ürün detayları yükleniyor, lütfen bekleyin.</p>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
} 