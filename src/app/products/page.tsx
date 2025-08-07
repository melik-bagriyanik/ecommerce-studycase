'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Tag from '../components/ui/Tag';
import Rate from '../components/ui/Rate';
import { 
  ShoppingCart, 
  User, 
  Home as HomeIcon,
  Package,
  ShoppingBag,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Flame,
  Clock,
  BarChart3
} from 'lucide-react';
import CartSidebar from '../components/CartSidebar';
import GradientButton from '../components/GradientButton';
import axios from 'axios';
import { useCart } from '../context/CartContext';

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string; // string!
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

// Kategori map'i ve ters map
const categoryMap: Record<string, number> = {
  'Electronics': 1,
  'Clothing': 2,
  'Home and Garden': 3,
  'Sports': 4,
  'Books': 5,
  'Health and Beauty': 6,
  'Toys': 7,
  'Food': 8,
};
const reverseCategoryMap: Record<number, string> = Object.fromEntries(
  Object.entries(categoryMap).map(([k, v]) => [v, k])
);

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryId = searchParams.get('category');
  const filterType = searchParams.get('filter'); // 'popular' or 'new'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart, totalItems } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kategorileri frontend'den üret
  const categories = Object.entries(categoryMap).map(([name, id]) => ({ id, name }));

  // API'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const mappedProducts = apiProducts.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.thumbnail || (item.images && item.images[0]) || '',
          category: item.category, // string olarak bırak!
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          description: item.description || '',
          inStock: typeof item.stock === 'number' ? item.stock > 0 : true,
          // Backend'de bu alanlar yok, manuel olarak ekliyoruz
          isNew: item.isNew || item.isFeatured || item.createdAt ? new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false, // Son 7 günde eklenenler
          isPopular: item.isPopular || item.isFeatured || (item.rating && item.rating > 4) || (item.reviewCount && item.reviewCount > 100), // Yüksek puanlı veya çok yorumlu olanlar
        }));

        console.log('API Products:', apiProducts);
        console.log('Mapped Products:', mappedProducts);
        console.log('Category Map:', categoryMap);
        console.log('Selected Categories:', selectedCategories);
        console.log('Filter Type:', filterType);
        console.log('API Products Count:', apiProducts.length);
        console.log('Mapped Products Count:', mappedProducts.length);

        setProducts(mappedProducts);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Ürünler yüklenirken bir hata oluştu');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtre state'leri
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50); // 8'den 50'ye çıkarıldı

  // URL'den kategori parametresi varsa state'e aktar
  useEffect(() => {
    if (categoryId) {
      // Kategori ID'si yerine kategori ismi geliyor
      const categoryName = decodeURIComponent(categoryId);
      
      // Kategori ismine göre ID bul
      const categoryIdNum = categoryMap[categoryName];
      if (categoryIdNum && !selectedCategories.includes(categoryIdNum)) {
        setSelectedCategories([categoryIdNum]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  // Filtreleme
  useEffect(() => {
    let filtered = Array.isArray(products) ? [...products] : [];

    console.log('Initial products:', products);
    console.log('Selected categories:', selectedCategories);
    console.log('Filter type:', filterType);

    // Geçici olarak tüm filtreleme kaldırıldı - sadece tüm ürünleri göster
    // let filtered = Array.isArray(products) ? [...products] : [];

    // Kategoriye göre filtreleme (category string, id ile eşleştir)
    // if (selectedCategories.length > 0) {
    //   const selectedNames = selectedCategories.map(id => reverseCategoryMap[id]);
    //   console.log('Selected category names:', selectedNames);
    //   filtered = filtered.filter(product => selectedNames.includes(product.category));
    //   console.log('After category filter:', filtered);
    // }

    // Filter type'a göre filtreleme
    // if (filterType === 'popular') {
    //   filtered = filtered.filter(product => product.isPopular);
    //   console.log('After popular filter:', filtered);
    // } else if (filterType === 'new') {
    //   filtered = filtered.filter(product => product.isNew);
    //   console.log('After new filter:', filtered);
    // }

    // Arama filtresi
    // if (searchQuery) {
    //   filtered = filtered.filter(product => 
    //     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     product.description.toLowerCase().includes(searchQuery.toLowerCase())
    //   );
    // }

    // Fiyat aralığı filtresi
    // filtered = filtered.filter(product => 
    //   product.price >= priceRange[0] && product.price <= priceRange[1]
    // );
    
    // Stok filtresi
    // if (showInStockOnly) {
    //   filtered = filtered.filter(product => product.inStock);
    // }
    
    // Puan filtresi
    // if (selectedRatings.length > 0) {
    //   filtered = filtered.filter(product => selectedRatings.includes(Math.floor(product.rating)));
    // }
    
    // Sıralama
    // filtered.sort((a, b) => {
    //   switch (sortBy) {
    //     case 'name':
    //       return a.name.localeCompare(b.name);
    //     case 'price':
    //       return a.price - b.price;
    //     case 'rating':
    //       return b.rating - a.rating;
    //     case 'newest':
    //       return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    //     default:
    //       return 0;
    //   }
    // });

    console.log('Final filtered products:', filtered);
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategories, filterType, searchQuery, priceRange, showInStockOnly, selectedRatings, sortBy]);

  const ProductCard = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`}>
      <Card hoverable className="h-full">
        <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white text-lg" />
            </div>
          )}
          {product.isNew && (
            <Tag color="green" className="absolute top-2 left-2">
              <Clock /> New
            </Tag>
          )}
          {product.isPopular && (
            <Tag color="red" className="absolute top-2 left-2">
              <Flame /> Popular
            </Tag>
          )}
          {product.originalPrice && (
            <Tag color="blue" className="absolute top-2 right-2">
              Sale
            </Tag>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <Rate disabled value={product.rating} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-base">${product.price}</span>
              {product.originalPrice && (
                <span className="line-through text-gray-500 ml-2 text-sm">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
          <div className="mt-3">
            <GradientButton 
              variant="blue-purple" 
              size="sm"
              onClick={() => {
                addToCart(product);
              }}
              className="w-full"
            >
              Add to Cart
            </GradientButton>
          </div>
        </div>
      </Card>
    </Link>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Link href={`/products/${product.id}`}>
      <div className="flex items-center space-x-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <ShoppingBag className="text-white text-sm" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 truncate">{product.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <Rate disabled value={product.rating} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
            <span className="text-lg">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  const paginatedProducts = filteredProducts; // Pagination'ı geçici olarak kaldır
  // const paginatedProducts = filteredProducts.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize
  // );

  console.log('Filtered Products Length:', filteredProducts.length);
  console.log('Paginated Products Length:', paginatedProducts.length);
  console.log('Current Page:', currentPage);
  console.log('Page Size:', pageSize);

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
          <Link href="/products" className="text-blue-600 font-medium transition-colors">
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
            onClick={() => setIsCartOpen(true)}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {filterType === 'popular' 
              ? 'Öne Çıkan Ürünler'
              : filterType === 'new'
              ? 'Yeni Gelen Ürünler'
              : categoryId && categories.find(cat => cat.id === parseInt(categoryId)) 
              ? `${categories.find(cat => cat.id === parseInt(categoryId))?.name} Ürünleri`
              : 'Ürünler'
            }
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {filterType === 'popular'
              ? 'En çok tercih edilen ürünlerimizi keşfedin.'
              : filterType === 'new'
              ? 'En son eklenen ürünlerimizi keşfedin.'
              : categoryId && categories.find(cat => cat.id === parseInt(categoryId))
              ? `${categories.find(cat => cat.id === parseInt(categoryId))?.name} kategorisindeki ürünleri keşfedin.`
              : 'Binlerce kaliteli ürün arasından seçiminizi yapın. Filtreleme ve sıralama seçenekleri ile istediğiniz ürünü kolayca bulun.'
            }
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Input
                placeholder="Ürün ara..."
                size="lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="text-gray-500" />}
              />
            </div>
            <div className="col-span-1 md:col-span-1">
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
            <div className="col-span-1 md:col-span-1">
              <select
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategories.length > 0 ? selectedCategories[0] : ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value) {
                    setSelectedCategories([value]);
                    // Kategori ismini URL'e ekle
                    const categoryName = reverseCategoryMap[value];
                    router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                  } else {
                    setSelectedCategories([]);
                    router.push('/products');
                  }
                }}
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <Button
                size="lg"
                icon={<Filter className="text-gray-500" />}
                onClick={() => setShowFilters(true)}
                className="w-full"
              >
                Filtreler
              </Button>
            </div>
            <div className="col-span-1 md:col-span-1">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`flex-1 p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="text-gray-500" />
                </button>
                <button
                  className={`flex-1 p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="col-span-1 md:col-span-1 text-center">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} ürün bulundu
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <h3 className="text-lg text-gray-600">Ürünler yükleniyor...</h3>
            <p className="text-sm text-gray-500">Lütfen bekleyin</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="py-12 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg text-red-600 mb-2">Hata Oluştu</h3>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                size="sm"
              >
                Tekrar Dene
              </Button>
            </div>
          </div>
        )}

        {/* Products Display */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg">
                {paginatedProducts.map((product) => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="text-center mt-8">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  &lt;
                </Button>
                {Array.from({ length: Math.ceil(filteredProducts.length / pageSize) }).map((_, index) => (
                  <Button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`p-2 rounded-full hover:bg-gray-200 ${currentPage === index + 1 ? 'bg-blue-600 text-white' : ''}`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredProducts.length / pageSize), prev + 1))}
                  disabled={currentPage === Math.ceil(filteredProducts.length / pageSize) || filteredProducts.length === 0}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  &gt;
                </Button>
              </div>
            </div>
          </>
        )}

        {/* No Products Found */}
        {!loading && !error && paginatedProducts.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="text-lg text-gray-600">Ürün bulunamadı</h3>
            <p className="text-sm text-gray-500">Lütfen farklı filtrelerle tekrar deneyin.</p>
          </div>
        )}
      </div>

      {/* Filters Drawer */}
      <div className={`fixed inset-0 z-50 md:hidden bg-black bg-opacity-50 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Filtreler</h2>
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Kategoriler</h3>
                <div className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <label key={category.name} className="flex items-center">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [...selectedCategories, category.id]
                            : selectedCategories.filter(id => id !== category.id);
                          setSelectedCategories(newSelected);
                          // URL'i de güncelleyin:
                          if (newSelected.length === 1) {
                            const categoryName = reverseCategoryMap[newSelected[0]];
                            router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                          } else if (newSelected.length === 0) {
                            router.push('/products');
                          }
                        }}
                        className="mr-2"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Fiyat Aralığı</h3>
                <div className="flex items-center space-x-2">
                  <span>${priceRange[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="flex-1"
                  />
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Değerlendirmeler</h3>
                <div className="flex flex-col space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        value={rating}
                        checked={selectedRatings.includes(rating)}
                        onChange={(e) => {
                          const newSelected = e.target.checked
                            ? [...selectedRatings, rating]
                            : selectedRatings.filter(r => r !== rating);
                          setSelectedRatings(newSelected);
                        }}
                        className="mr-2"
                      />
                      <Rate disabled value={rating} />
                      <span className="ml-2">{rating}+ yıldız</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="mr-2"
                  />
                  Sadece stokta olanlar
                </label>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedRatings([]);
                  setPriceRange([0, 2000]);
                  setShowInStockOnly(false);
                  setSearchQuery('');
                }}
                className="w-full"
              >
                Filtreleri Temizle
              </Button>
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

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Yükleniyor...</h2>
          <p className="text-sm text-gray-600">Ürünler yükleniyor, lütfen bekleyin.</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}