"use client";
import Button from '../ui/Button';
import Rate from '../ui/Rate';
import { useEffect } from 'react';

interface ProductsFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
  selectedRatings: number[];
  onRatingChange: (ratings: number[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  showInStockOnly: boolean;
  onStockFilterChange: (show: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Array<{ id: number; name: string }>;
  router: any;
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
  brands: string[];
  showDiscountedOnly: boolean;
  onDiscountedChange: (show: boolean) => void;
}

export default function ProductsFiltersDrawer({
  isOpen,
  onClose,
  selectedCategories,
  onCategoryChange,
  selectedRatings,
  onRatingChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  showInStockOnly,
  onStockFilterChange,
  searchQuery,
  onSearchChange,
  categories,
  router,
  selectedBrands,
  onBrandChange,
  brands,
  showDiscountedOnly,
  onDiscountedChange
}: ProductsFiltersDrawerProps) {
  // render even when closed to avoid React static flag issues; toggle visibility via CSS
  // ESC tuşu ile modal'ı kapat ve body scroll'unu sadece görünür modal için engelle
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Sadece mobile modal için scroll kilidi uygula
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      if (isMobile) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);
  const reverseCategoryMap: Record<number, string> = {
    1: 'Electronics',
    2: 'Clothing',
    3: 'Home and Garden',
    4: 'Sports',
    5: 'Books',
    6: 'Health and Beauty',
    7: 'Toys',
    8: 'Food',
  };

  const clearFilters = () => {
    console.log('Clear filters called (mobile)');
    onCategoryChange([]);
    onRatingChange([]);
    onPriceRangeChange([0, maxPrice]);
    onStockFilterChange(false);
    onSearchChange('');
    onBrandChange([]);
    onDiscountedChange(false);
  };

  const handleClose = () => {
    console.log('Modal close called (mobile)');
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'flex' : 'hidden'} md:hidden bg-black/10 backdrop-blur-[1px]`} onClick={handleClose}>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">Filtreler</h2>
          
          {/* Active Filters Display */}
          {(selectedCategories.length > 0 || selectedRatings.length > 0 || selectedBrands.length > 0 || 
            showInStockOnly || showDiscountedOnly || priceRange[0] > 0 || priceRange[1] < 10000) && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Aktif Filtreler:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Kategori: {selectedCategories.length} seçili
                  </span>
                )}
                {selectedRatings.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Puan: {selectedRatings.join(', ')}+
                  </span>
                )}
                {selectedBrands.length > 0 && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Marka: {selectedBrands.join(', ')}
                  </span>
                )}
                {showInStockOnly && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Stokta
                  </span>
                )}
                {showDiscountedOnly && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    İndirimli
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Fiyat: {priceRange[0]}-{priceRange[1]} TL
                  </span>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {/* Categories removed from modal */}

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Fiyat Aralığı</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Min:</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-600">TL</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Max:</span>
                  <input
                    type="number"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || maxPrice])}
                    className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`${maxPrice}`}
                  />
                  <span className="text-sm text-gray-600">TL</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Min: {priceRange[0]} TL</span>
                    <span>Max: {priceRange[1]} TL</span>
                  </div>
                  {(() => {
                    const min = 0;
                    const max = maxPrice ?? 10000;
                    const minPercent = ((priceRange[0] - min) / (max - min)) * 100;
                    const maxPercent = ((priceRange[1] - min) / (max - min)) * 100;
                    return (
                      <div className="relative h-6 select-none">
                        <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full bg-gray-200 rounded" />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-1 bg-blue-500 rounded"
                          style={{ left: `${minPercent}%`, width: `${Math.max(0, maxPercent - minPercent)}%` }}
                        />
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={priceRange[0]}
                          onChange={(e) => {
                            const nextMin = isNaN(parseInt(e.target.value)) ? min : parseInt(e.target.value);
                            const safeMin = Math.min(nextMin, Math.max(min, priceRange[1] - 1));
                            onPriceRangeChange([safeMin, priceRange[1]]);
                          }}
                          className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent cursor-pointer range-thumb-only"
                        />
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={priceRange[1]}
                          onChange={(e) => {
                            const nextMax = isNaN(parseInt(e.target.value)) ? max : parseInt(e.target.value);
                            const safeMax = Math.max(nextMax, Math.min(max, priceRange[0] + 1));
                            onPriceRangeChange([priceRange[0], safeMax]);
                          }}
                          className="absolute top-0 left-0 w-full h-6 appearance-none bg-transparent cursor-pointer range-thumb-only"
                        />
                        <style jsx>{`
                          input[type="range"].range-thumb-only { pointer-events: none; }
                          input[type="range"].range-thumb-only::-webkit-slider-thumb { pointer-events: all; }
                          input[type="range"].range-thumb-only::-moz-range-thumb { pointer-events: all; }
                        `}</style>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Değerlendirmeler</h3>
              <div className="space-y-3">
                <div className="flex flex-col space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          value={rating}
                          checked={selectedRatings.includes(rating)}
                          onChange={(e) => {
                            const newSelected = e.target.checked
                              ? [...selectedRatings, rating]
                              : selectedRatings.filter(r => r !== rating);
                            onRatingChange(newSelected);
                          }}
                          className="mr-3"
                        />
                        <Rate disabled value={rating} />
                        <span className="ml-2 text-sm">{rating}+ yıldız</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {rating === 5 ? 'Mükemmel' : 
                         rating === 4 ? 'Çok İyi' : 
                         rating === 3 ? 'İyi' : 
                         rating === 2 ? 'Orta' : 'Zayıf'}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Birden fazla seçebilirsiniz
                </div>
              </div>
            </div>

            {/* Brands */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Markalar</h3>
              <div className="flex flex-col space-y-2 max-h-32 overflow-y-auto">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      value={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...selectedBrands, brand]
                          : selectedBrands.filter(b => b !== brand);
                        onBrandChange(newSelected);
                      }}
                      className="mr-2"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Stok Durumu</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => onStockFilterChange(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm">Sadece stokta olanlar</span>
                </label>
              </div>
            </div>

            {/* Discount Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-2">İndirim Durumu</h3>
              <div className="space-y-2">
                <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={showDiscountedOnly}
                    onChange={(e) => onDiscountedChange(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm">Sadece indirimli ürünler</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Filtreleri Temizle
            </Button>
            <Button
              onClick={handleClose}
              className="w-full"
            >
              Filtreleri Uygula
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
