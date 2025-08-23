'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowUp } from 'lucide-react';

// Components
import {
  ProductsHeader,
  ProductsFilters,
  ProductsGrid,
  ProductsList,
  ProductsPagination,
  ProductsLoading,
  ProductsError,
  ProductsEmpty,
  ProductsFooter,
  ProductsFiltersDrawer
} from '../components/products';
import ProductsFiltersDesktop from '../components/products/ProductsFiltersDesktop';
// CartSidebar overlay moved to root layout
import { Product } from '../types/Product';

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
  const filterType = searchParams.get('filter');
  const { addToCart, totalItems } = useCart();

  // State
  // Cart open state is now managed globally in CartContext
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);

  // Kategorileri frontend'den üret
  const categories = Object.entries(categoryMap).map(([name, id]) => ({ id, name }));
  
  // Backend'den gelen kategori isimlerini kullanarak dinamik map oluştur
  const [dynamicCategoryMap, setDynamicCategoryMap] = useState<Record<string, number>>({});
  
  // Markaları ürünlerden çıkar
  const [brands, setBrands] = useState<string[]>([]);

  // API'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        
        // Tüm ürünleri çek, filtreleme frontend'de yapılacak
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
        const apiUrl = `${API_BASE}/api/products?limit=100&page=1`;
        console.log('API URL:', apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        const apiProducts = Array.isArray(response.data.data?.products)
          ? response.data.data.products
          : Array.isArray(response.data.products)
          ? response.data.products
          : [];

        const mappedProducts = apiProducts.map((item: any) => ({
          id: item.id || item._id,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.thumbnail || (item.images && item.images[0]) || '',
          category: item.category,
          brand: item.brand,
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          description: item.description || '',
          inStock: typeof item.stock === 'number' ? item.stock > 0 : true,
          isNew: item.isNew || item.isFeatured || item.createdAt ? new Date(item.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
          isPopular: item.isPopular || item.isFeatured || (item.rating && item.rating > 4) || (item.reviewCount && item.reviewCount > 100),
        }));

        console.log('=== API RESPONSE DEBUG ===');
        console.log('Full API Response:', response.data);
        console.log('API Response Data:', response.data.data);
        console.log('API Products Count:', apiProducts.length);
        console.log('API Products:', apiProducts);
        console.log('Mapped Products Count:', mappedProducts.length);
        console.log('Mapped Products:', mappedProducts);
        console.log('Available categories from API:', [...new Set(apiProducts.map((p: any) => p.category))]);
        console.log('Frontend category map:', categoryMap);
        console.log('Reverse category map:', reverseCategoryMap);
        
        // Her ürünün kategorisini kontrol et
        apiProducts.forEach((product: any, index: number) => {
          console.log(`Product ${index + 1}: ${product.name} - Category: ${product.category}`);
        });
        
        // Backend'den gelen kategori isimlerini kullanarak dinamik map oluştur
        const apiCategories = [...new Set(apiProducts.map((p: any) => p.category))] as string[];
        const dynamicMap: Record<string, number> = {};
        apiCategories.forEach((category: string, index) => {
          dynamicMap[category] = index + 1;
        });
        setDynamicCategoryMap(dynamicMap);
        console.log('Dynamic category map:', dynamicMap);
        console.log('API Categories:', apiCategories);
        
        // Max price hesapla ve priceRange'i başlangıçta ayarla
        const computedMaxPrice = mappedProducts.length > 0
          ? Math.max(...mappedProducts.map((p:any) => Number(p.price) || 0))
          : 10000;
        const normalizedMax = Math.max(0, Math.ceil(computedMaxPrice));
        setMaxPrice(normalizedMax);
        setPriceRange(([min]) => [min ?? 0, normalizedMax]);
        console.log('Computed max price:', normalizedMax);

        // Markaları çıkar
        const apiBrands = [...new Set(apiProducts.map((p: any) => p.brand).filter(Boolean))] as string[];
        setBrands(apiBrands);
        console.log('API Brands:', apiBrands);
        console.log('=== END API RESPONSE DEBUG ===');

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
  }, []); // Sadece sayfa yüklendiğinde API çağrısı yap

  // URL'den kategori parametresi varsa state'e aktar
  useEffect(() => {
    console.log('URL categoryId:', categoryId);
    console.log('Current selectedCategories:', selectedCategories);
    
    if (categoryId) {
      const categoryName = decodeURIComponent(categoryId);
      console.log('Decoded category name:', categoryName);
      
      // Dinamik map'ten kategori ID'sini bul
      const categoryIdNum = Object.entries(dynamicCategoryMap)
        .find(([name, id]) => name === categoryName)?.[1];
      
      console.log('Found category ID:', categoryIdNum);
      
      if (categoryIdNum && !selectedCategories.includes(categoryIdNum)) {
        console.log('Setting selected categories to:', [categoryIdNum]);
        setSelectedCategories([categoryIdNum]);
      }
    } else if (selectedCategories.length > 0) {
      console.log('Clearing selected categories');
      setSelectedCategories([]);
    }
  }, [categoryId, dynamicCategoryMap]);

  // Search debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Filtreleme
  useEffect(() => {
    let filtered = Array.isArray(products) ? [...products] : [];

    console.log('=== FILTERING DEBUG ===');
    console.log('Initial products count:', products.length);
    console.log('All products:', products);
    console.log('Selected categories:', selectedCategories);
    console.log('Filter type:', filterType);
    console.log('Search query:', searchQuery);
    console.log('Price range:', priceRange);
    console.log('Show in stock only:', showInStockOnly);
    console.log('Selected ratings:', selectedRatings);
    console.log('Sort by:', sortBy);

    // GEÇİCİ OLARAK TÜM FİLTRELEME DEVRE DIŞI - SADECE TÜM ÜRÜNLERİ GÖSTER
    console.log('ALL FILTERING DISABLED - SHOWING ALL PRODUCTS');

    // Kategori filtreleme frontend'de yapılıyor
    if (selectedCategories.length > 0) {
      console.log('=== CATEGORY FILTER ===');
      console.log('Selected categories:', selectedCategories);
      console.log('Dynamic category map:', dynamicCategoryMap);
      
      // Seçilen kategori ID'lerine karşılık gelen kategori isimlerini bul
      const selectedCategoryNames = Object.entries(dynamicCategoryMap)
        .filter(([name, id]) => selectedCategories.includes(id))
        .map(([name, id]) => name);
      
      console.log('Selected category names:', selectedCategoryNames);
      
      // Kategori filtreleme
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => {
        const productCategory = product.category;
        const matches = selectedCategoryNames.includes(productCategory);
        console.log(`Product: ${product.name}, Category: "${productCategory}", Matches: ${matches}`);
        return matches;
      });
      console.log(`Filtered from ${beforeFilter} to ${filtered.length} products`);
    } else {
      console.log('No category filter applied - showing all products');
    }

    // Filter type'a göre filtreleme
    if (filterType === 'popular') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => product.isPopular);
      console.log(`Popular filter: ${beforeFilter} → ${filtered.length} products`);
    } else if (filterType === 'new') {
      const beforeFilter = filtered.length;
      filtered = filtered.filter(product => product.isNew);
      console.log(`New filter: ${beforeFilter} → ${filtered.length} products`);
    } else {
      console.log('No filter type applied - showing all products');
    }

    // Arama filtresi
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();
      console.log('Search query:', query);
      const beforeSearch = filtered.length;
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query)) ||
        product.category.toLowerCase().includes(query)
      );
      console.log(`Search filtered from ${beforeSearch} to ${filtered.length} products`);
    } else {
      console.log('No search query - showing all products');
    }

    // Fiyat aralığı filtresi
    console.log('Price range filter:', priceRange);
    const beforePrice = filtered.length;
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    console.log(`Price filter: ${beforePrice} → ${filtered.length} products`);
    
    // Stok filtresi
    if (showInStockOnly) {
      const beforeStock = filtered.length;
      filtered = filtered.filter(product => product.inStock);
      console.log(`Stock filter: ${beforeStock} → ${filtered.length} products`);
    } else {
      console.log('No stock filter applied - showing all products');
    }
    
    // Puan filtresi
    if (selectedRatings.length > 0) {
      const beforeRating = filtered.length;
      filtered = filtered.filter(product => selectedRatings.includes(Math.floor(product.rating)));
      console.log(`Rating filter: ${beforeRating} → ${filtered.length} products`);
    } else {
      console.log('No rating filter applied - showing all products');
    }
    
    // Marka filtresi
    if (selectedBrands.length > 0) {
      const beforeBrand = filtered.length;
      filtered = filtered.filter(product => selectedBrands.includes(product.brand || ''));
      console.log(`Brand filter: ${beforeBrand} → ${filtered.length} products`);
    } else {
      console.log('No brand filter applied - showing all products');
    }
    
    // İndirim filtresi
    if (showDiscountedOnly) {
      const beforeDiscount = filtered.length;
      filtered = filtered.filter(product => product.originalPrice && product.originalPrice > product.price);
      console.log(`Discount filter: ${beforeDiscount} → ${filtered.length} products`);
    } else {
      console.log('No discount filter applied - showing all products');
    }
    
    // Sıralama
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
    console.log('After sorting:', filtered);

    console.log('Final filtered products count:', filtered.length);
    console.log('=== END FILTERING DEBUG ===');
    
    // Her ürünün detayını göster
    console.log('=== ALL PRODUCTS DETAILS ===');
    filtered.forEach((product, index) => {
      console.log(`Product ${index + 1}: ${product.name} - Category: ${product.category} - Price: ${product.price}`);
    });
    console.log('=== END PRODUCTS DETAILS ===');
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, selectedCategories, filterType, debouncedSearchQuery, priceRange, showInStockOnly, selectedRatings, sortBy, selectedBrands, showDiscountedOnly]);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <ProductsHeader 
          filterType={filterType}
          categoryId={categoryId}
          categories={categories}
        />

        {/* Search and Filters Bar */}
        <ProductsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          categories={Object.entries(dynamicCategoryMap).map(([name, id]) => ({ id, name }))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onFiltersOpen={() => {
            console.log('Opening filters, current showFilters:', showFilters);
            setShowFilters(true);
          }}
          filteredProductsCount={filteredProducts.length}
          router={router}
          selectedBrands={selectedBrands}
          onBrandChange={setSelectedBrands}
          brands={brands}
          showDiscountedOnly={showDiscountedOnly}
          onDiscountedChange={setShowDiscountedOnly}
          selectedRatings={selectedRatings}
          showInStockOnly={showInStockOnly}
          priceRange={priceRange}
          maxPrice={maxPrice}
        />

        {/* Loading State */}
        {loading && <ProductsLoading />}

        {/* Error State */}
        {error && !loading && (
          <ProductsError error={error} onRetry={handleRetry} />
        )}

        {/* Products Display */}
        {!loading && !error && paginatedProducts.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <ProductsGrid products={paginatedProducts} onAddToCart={handleAddToCart} />
            ) : (
              <ProductsList products={paginatedProducts} />
            )}

            {/* Pagination */}
            <ProductsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalProducts={filteredProducts.length}
            />
          </>
        )}

        {/* No Products Found */}
        {!loading && !error && paginatedProducts.length === 0 && (
          <ProductsEmpty />
        )}
      </div>

              {/* Footer */}
        <div className="mt-8 sm:mt-12">
          <ProductsFooter />
        </div>

      {/* Filters Drawer - Mobile */}
      <ProductsFiltersDrawer
        isOpen={showFilters}
        onClose={() => {
          console.log('Closing mobile filters, showFilters:', showFilters);
          setShowFilters(false);
        }}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedRatings={selectedRatings}
        onRatingChange={setSelectedRatings}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showInStockOnly={showInStockOnly}
        onStockFilterChange={setShowInStockOnly}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={Object.entries(dynamicCategoryMap).map(([name, id]) => ({ id, name }))}
        router={router}
        selectedBrands={selectedBrands}
        onBrandChange={setSelectedBrands}
        brands={brands}
        showDiscountedOnly={showDiscountedOnly}
        onDiscountedChange={setShowDiscountedOnly}
        maxPrice={maxPrice}
      />

      {/* Filters Desktop - Desktop */}
      <ProductsFiltersDesktop
        isOpen={showFilters}
        onClose={() => {
          console.log('Closing desktop filters, showFilters:', showFilters);
          setShowFilters(false);
        }}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedRatings={selectedRatings}
        onRatingChange={setSelectedRatings}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        showInStockOnly={showInStockOnly}
        onStockFilterChange={setShowInStockOnly}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={Object.entries(dynamicCategoryMap).map(([name, id]) => ({ id, name }))}
        router={router}
        selectedBrands={selectedBrands}
        onBrandChange={setSelectedBrands}
        brands={brands}
        showDiscountedOnly={showDiscountedOnly}
        onDiscountedChange={setShowDiscountedOnly}
        maxPrice={maxPrice}
      />

      {/* Cart Sidebar shown globally in layout */}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
          aria-label="Yukarı çık"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
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