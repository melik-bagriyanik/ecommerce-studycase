'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Tag from '../../components/ui/Tag';
import Rate from '../../components/ui/Rate';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  HomeIcon,
  CategoryIcon,
  ShoppingIcon,
  SearchIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  ArrowLeftIcon
} from '../../components/icons/index';
import CartSidebar from '../../components/CartSidebar';
import GradientButton from '../../components/GradientButton';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: number;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
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

function CategoryContent() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
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
      icon: <CategoryIcon />,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 6,
      name: 'Health & Beauty',
      description: 'Beauty and wellness',
      productCount: 134,
      icon: <StarIcon />,
      color: 'from-pink-600 to-rose-600'
    }
  ];

  const currentCategory = categories.find(cat => cat.id === categoryId);

  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 899.99,
      originalPrice: 999.99,
      image: '/iphone.jpg',
      category: 1,
      rating: 4.8,
      reviewCount: 1247,
      description: 'En son teknoloji ile donatılmış akıllı telefon',
      inStock: true,
      isPopular: true
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      price: 799.99,
      image: '/samsung.jpg',
      category: 1,
      rating: 4.6,
      reviewCount: 892,
      description: 'Güçlü performans ve uzun pil ömrü',
      inStock: true,
      isNew: true
    },
    {
      id: 3,
      name: 'Nike Air Max 270',
      price: 129.99,
      originalPrice: 159.99,
      image: '/nike.jpg',
      category: 2,
      rating: 4.7,
      reviewCount: 456,
      description: 'Konforlu ve şık spor ayakkabı',
      inStock: true,
      isPopular: true
    },
    {
      id: 4,
      name: 'Adidas Ultraboost 22',
      price: 189.99,
      image: '/adidas.jpg',
      category: 2,
      rating: 4.9,
      reviewCount: 678,
      description: 'Profesyonel koşu ayakkabısı',
      inStock: false,
      isNew: true
    },
    {
      id: 5,
      name: 'IKEA Malm Yatak Odası Takımı',
      price: 599.99,
      image: '/ikea.jpg',
      category: 3,
      rating: 4.5,
      reviewCount: 234,
      description: 'Modern ve fonksiyonel yatak odası takımı',
      inStock: true
    },
    {
      id: 6,
      name: 'Wilson Tennis Racket',
      price: 89.99,
      image: '/wilson.jpg',
      category: 4,
      rating: 4.4,
      reviewCount: 123,
      description: 'Profesyonel tenis raketi',
      inStock: true
    },
    {
      id: 7,
      name: 'Harry Potter Complete Set',
      price: 79.99,
      originalPrice: 99.99,
      image: '/harry-potter.jpg',
      category: 5,
      rating: 4.9,
      reviewCount: 2156,
      description: 'J.K. Rowling\'in tüm Harry Potter serisi',
      inStock: true,
      isPopular: true
    },
    {
      id: 8,
      name: 'L\'Oreal Paris Skincare Set',
      price: 49.99,
      image: '/loreal.jpg',
      category: 6,
      rating: 4.3,
      reviewCount: 445,
      description: 'Cilt bakım seti - nemlendirici ve temizleyici',
      inStock: true
    },
    {
      id: 9,
      name: 'LEGO Star Wars Millennium Falcon',
      price: 159.99,
      image: '/lego.jpg',
      category: 7,
      rating: 4.8,
      reviewCount: 789,
      description: 'Detaylı Star Wars LEGO seti',
      inStock: true,
      isPopular: true
    },
    {
      id: 10,
      name: 'Organic Honey 500g',
      price: 12.99,
      image: '/honey.jpg',
      category: 8,
      rating: 4.6,
      reviewCount: 234,
      description: 'Doğal organik bal',
      inStock: true
    },
    {
      id: 11,
      name: 'MacBook Pro M3',
      price: 1999.99,
      image: '/macbook.jpg',
      category: 1,
      rating: 4.9,
      reviewCount: 567,
      description: 'Güçlü M3 işlemci ile MacBook Pro',
      inStock: true,
      isNew: true
    },
    {
      id: 12,
      name: 'Sony WH-1000XM5',
      price: 349.99,
      image: '/sony.jpg',
      category: 1,
      rating: 4.8,
      reviewCount: 234,
      description: 'Gürültü önleyici kablosuz kulaklık',
      inStock: true,
      isNew: true
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

  useEffect(() => {
    let filtered = products.filter(product => product.category === categoryId);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock
    if (showInStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Filter by ratings
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(product => selectedRatings.includes(Math.floor(product.rating)));
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, categoryId, sortBy, priceRange, showInStockOnly, searchQuery, selectedRatings]);

  const addToCart = (productId: number) => {
    console.log(`Added product ${productId} to cart`);
    alert('Ürün sepete eklendi!');
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
          {!product.inStock && (
            <Tag color="gray" className="absolute top-2 right-2">
              Out of Stock
            </Tag>
          )}
        </div>
      }
      actions={[
        <GradientButton 
          key="add-to-cart" 
          variant="blue-purple" 
          size="sm"
          disabled={!product.inStock}
          onClick={() => addToCart(product.id)}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
              <h4 className="text-lg">${product.price}</h4>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {categories.find(cat => cat.id === product.category)?.name}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
            <ShoppingIcon className="text-white text-sm" />
          </div>
          {product.isNew && (
            <Tag color="green" className="absolute -top-1 -left-1">
              New
            </Tag>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          {product.isPopular && <Tag color="red">Popular</Tag>}
          {product.originalPrice && <Tag color="blue">Sale</Tag>}
                     {!product.inStock && <Tag color="gray">Out of Stock</Tag>}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Rate disabled defaultValue={product.rating} />
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
        <h4 className="text-lg">${product.price}</h4>
        {product.originalPrice && (
          <span className="ml-2 text-sm text-gray-500 line-through">
            ${product.originalPrice}
          </span>
        )}
      </div>
    </div>
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Kategori Bulunamadı</h2>
          <Link href="/categories">
            <GradientButton variant="blue-purple">
              Kategorilere Dön
            </GradientButton>
          </Link>
        </div>
      </div>
    );
  }

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
          <Link href="/login">
            <GradientButton 
              variant="blue-purple"
              size="large"
            >
              Get Started
            </GradientButton>
          </Link>
          
          {/* Shopping Cart Icon */}
          <Button 
            type="text"
            icon={<ShoppingCartIcon />}
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-blue-600"
          >
            <Badge count={3} size="small" className="absolute -top-1 -right-1" />
          </Button>
          
          {/* Profile Icon */}
          <Link href="/profile">
            <Button 
              type="text" 
              icon={<UserIcon />}
              className="hover:text-blue-600"
            />
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
          <Link href="/categories" className="flex flex-col items-center text-xs text-blue-600">
            <CategoryIcon className="text-lg mb-1" />
            <span>Kategoriler</span>
          </Link>
          <Link href="/products" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <ShoppingIcon className="text-lg mb-1" />
            <span>Ürünler</span>
          </Link>
          <Button 
            type="text"
            className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600 relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCartIcon className="text-lg mb-1" />
            <span>Sepetim</span>
            <Badge count={3} size="small" className="absolute -top-1 -right-1" />
          </Button>
          <Link href="/profile" className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-600">
            <UserIcon className="text-lg mb-1" />
            <span>Profilim</span>
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/categories">
            <Button 
              type="text" 
              icon={<ArrowLeftIcon />}
              className="mb-4"
            >
              Kategorilere Dön
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentCategory.color} rounded-lg flex items-center justify-center`}>
              <div className="text-white text-3xl">
                {currentCategory.icon}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{currentCategory.name}</h1>
              <p className="text-lg text-gray-700 mb-2">{currentCategory.description}</p>
              <span className="text-sm text-gray-500">{filteredProducts.length} ürün bulundu</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Ürün ara..."
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<SearchIcon />}
              />
            </div>
            <div>
              <select
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'rating' | 'newest')}
              >
                <option value="name">İsme göre</option>
                <option value="price">Fiyata göre</option>
                <option value="rating">Puana göre</option>
                <option value="newest">En yeni</option>
              </select>
            </div>
            <div>
              <Button
                size="large"
                icon={<FilterIcon />}
                onClick={() => setShowFilters(true)}
                className="w-full"
              >
                Filtreler
              </Button>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {viewMode === 'grid' ? <GridIcon /> : <ListIcon />}
              </button>
            </div>
            <div className="col-span-full md:col-span-1 text-right">
              <span className="text-sm text-gray-500">{filteredProducts.length} ürün bulundu</span>
            </div>
          </div>
        </div>

        {/* Products Display */}
        {paginatedProducts.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md">
                <ul className="divide-y divide-gray-200">
                  {paginatedProducts.map((product) => (
                    <li key={product.id}>
                      <ProductListItem product={product} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pagination */}
            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-2 text-gray-700">
                Page {currentPage} of {Math.ceil(filteredProducts.length / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / pageSize), prev + 1))}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                disabled={currentPage === Math.ceil(filteredProducts.length / pageSize)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-lg text-gray-500">Bu kategoride ürün bulunamadı</h3>
          </div>
        )}
      </div>

      {/* Filters Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden bg-black bg-opacity-50 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Filtreler</h2>
            <div className="space-y-4">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Fiyat Aralığı</h3>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Değerlendirmeler</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        value={rating}
                        checked={selectedRatings.includes(rating)}
                        onChange={(e) => {
                          const newRatings = selectedRatings.includes(rating)
                            ? selectedRatings.filter(r => r !== rating)
                            : [...selectedRatings, rating];
                          setSelectedRatings(newRatings);
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`rating-${rating}`} className="text-sm text-gray-700">
                        <Rate disabled defaultValue={rating} />
                        <span className="ml-2">{rating}+ yıldız</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <input
                  type="checkbox"
                  id="inStockOnly"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="inStockOnly" className="text-sm text-gray-700">
                  Sadece stokta olanlar
                </label>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedRatings([]);
                  setPriceRange([0, 2000]);
                  setShowInStockOnly(false);
                  setSearchQuery('');
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Filtreleri Temizle
              </button>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="mt-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Kapat
            </button>
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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Yükleniyor...</h2>
          <p className="text-lg text-gray-700">Kategori yükleniyor, lütfen bekleyin.</p>
        </div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
} 