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
  ShoppingCart, 
  User, 
  Home as HomeIcon,
  Package,
  ShoppingBag,
  Star,
  Flame,
  Clock,
  ArrowLeft,
  Minus,
  Plus,
  Heart,
  Share2,
  BarChart3
} from 'lucide-react';
import CartSidebar from '../../components/CartSidebar';
import GradientButton from '../../components/GradientButton';
import axios from 'axios';

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
  const productId = params.id as string;
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        console.log("Fetching product with ID:", productId);
        
        // API'den tüm ürünleri çek ve ID'ye göre filtrele
        const response = await axios.get(`http://localhost:3000/api/products`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("API Response:", response.data);
        const allProducts = response.data.data?.products || response.data.products || [];
        console.log("All products:", allProducts);
        
        // ID'ye göre ürünü bul
        const productData = allProducts.find((p: any) => p._id === productId || p.id === productId);
        console.log("Found product:", productData);
        
        if (!productData) {
          setError('Ürün bulunamadı');
          return;
        }

        // API'den gelen veriyi interface'e uygun hale getir
        const mappedProduct = {
          id: productData._id || productData.id,
          name: productData.name,
          price: productData.price,
          originalPrice: productData.originalPrice,
          description: productData.description,
          longDescription: productData.description, // API'de longDescription yok
          images: productData.images || [],
          category: productData.category,
          rating: productData.rating || 0,
          reviewCount: productData.reviewCount || 0,
          inStock: productData.stock > 0,
          stockQuantity: productData.stock || 0,
          isNew: productData.isNew || productData.isFeatured || (productData.createdAt ? new Date(productData.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false),
          isPopular: productData.isPopular || productData.isFeatured || (productData.rating && productData.rating > 4) || (productData.reviewCount && productData.reviewCount > 100),
          specifications: productData.specifications || {},
          reviews: productData.reviews || []
        };

        console.log("Mapped product:", mappedProduct);
        console.log("Product images:", mappedProduct.images);
        console.log("Product thumbnail:", productData.thumbnail);
        setProduct(mappedProduct);
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.message || 'Ürün yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Add to recently viewed
  useEffect(() => {
    if (productId && product) {
      setRecentlyViewed(prev => {
        const newList = [productId, ...prev.filter(id => id !== productId)].slice(0, 4);
        return newList;
      });
    }
  }, [productId, product]);

  const relatedProducts: RelatedProduct[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB Titanium',
      price: 1199.99,
      originalPrice: 1299.99,
      image: '/iphone-1.jpg',
      rating: 4.8,
      reviewCount: 1247,
      isNew: true,
      isPopular: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra 512GB',
      price: 1099.99,
      originalPrice: 1199.99,
      image: '/samsung-1.jpg',
      rating: 4.6,
      reviewCount: 892,
      isNew: true,
      isPopular: false
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      price: 129.99,
      originalPrice: 159.99,
      image: '/nike-1.jpg',
      rating: 4.7,
      reviewCount: 456,
      isNew: false,
      isPopular: true
    },
    {
      id: 4,
      name: 'Adidas Ultraboost 22',
      price: 189.99,
      originalPrice: 209.99,
      image: '/adidas-1.jpg',
      rating: 4.9,
      reviewCount: 678,
      isNew: true,
      isPopular: false
    },
    {
      id: 5,
      name: 'Harry Potter Complete Set',
      price: 79.99,
      originalPrice: 99.99,
      image: '/harry-potter-1.jpg',
      rating: 4.9,
      reviewCount: 2156,
      isNew: true,
      isPopular: true
    },
    {
      id: 6,
      name: 'LEGO Star Wars Millennium Falcon',
      price: 159.99,
      originalPrice: 179.99,
      image: '/lego-1.jpg',
      rating: 4.8,
      reviewCount: 789,
      isNew: true,
      isPopular: true
    },
    {
      id: 7,
      name: 'MacBook Pro 14" M3 Pro',
      price: 2499.99,
      originalPrice: 2699.99,
      image: '/macbook-1.jpg',
      rating: 4.9,
      reviewCount: 567,
      isNew: true,
      isPopular: false
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold">Yükleniyor...</h2>
            <p className="text-sm text-gray-600">Ürün detayları yükleniyor, lütfen bekleyin.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
            <p className="text-gray-600 mb-6">{error || 'Aradığınız ürün mevcut değil.'}</p>
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
          <Link href="/register" className="text-gray-600 hover:text-gray-900 transition-colors">
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
          
          {/* Shopping Cart Icon */}
          <Button 
            variant="ghost"
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-blue-600"
          >
            <ShoppingBag className="w-5 h-5" />
            <Badge count={3} size="sm" className="absolute -top-1 -right-1">
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
          <Link href="/products" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <Package className="text-lg mb-1" />
            <span>Ürünler</span>
          </Link>
          <Button 
            variant="ghost"
            className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="text-lg mb-1" />
            <span>Sepetim</span>
            <Badge count={3} size="sm" className="absolute -top-1 -right-1">
              <span></span>
            </Badge>
          </Button>
          <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <User className="text-lg mb-1" />
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
            onClick={() => router.back()}
            className="text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5" />
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
            <div className="relative h-96 lg:h-[500px] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {product.images && product.images.length > 0 && product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="text-white text-4xl" />
                </div>
              )}
              {product.isNew && (
                <Tag color="green" className="absolute top-4 left-4">
                  <Clock /> New
                </Tag>
              )}
              {product.isPopular && (
                <Tag color="red" className="absolute top-4 left-4">
                  <Flame /> Popular
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
              {(product.images || []).map((image: string, index: number) => (
                <div
                  key={index}
                  className={`h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg cursor-pointer transition-all overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <Package className="text-white text-sm" />
                      </div>
                    </div>
                  )}
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
                  {product.rating > 0 && <Rate disabled value={product.rating} />}
                  {product.reviewCount > 0 && (
                    <span className="text-sm text-gray-600">({product.reviewCount} değerlendirme)</span>
                  )}
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
                    onClick={() => handleQuantityChange(false)}
                    disabled={quantity <= 1}
                    className="p-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    onClick={() => handleQuantityChange(true)}
                    disabled={quantity >= product.stockQuantity}
                    className="p-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <GradientButton
                  variant="blue-purple"
                  size="lg"
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </GradientButton>
                <Button
                  variant="outline"
                  className="px-6"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Favori
                </Button>
                <Button
                  variant="outline"
                  className="px-6"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Paylaş
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Teknik Özellikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="text-gray-900 font-medium">{String(value)}</span>
                  </div>
                ))}
                {(!product.specifications || Object.keys(product.specifications || {}).length === 0) && (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    Teknik özellik bilgisi bulunmuyor.
                  </div>
                )}
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
            {(product.reviews || []).map((review: any) => (
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
            {(!product.reviews || product.reviews.length === 0) && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Henüz değerlendirme bulunmuyor.
              </div>
            )}
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
                      <Package className="text-white text-xl" />
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
                        <Package className="text-white text-xl" />
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