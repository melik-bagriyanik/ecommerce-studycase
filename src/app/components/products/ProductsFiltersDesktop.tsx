"use client";
import Button from '../ui/Button';
import Rate from '../ui/Rate';
import { useEffect } from 'react';

interface ProductsFiltersDesktopProps {
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

export default function ProductsFiltersDesktop({
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
}: ProductsFiltersDesktopProps) {
  // ESC tuşu ile modal'ı kapat ve body scroll'unu sadece görünür modal için engelle
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Sadece desktop modal için scroll kilidi uygula
      const isDesktop = window.matchMedia('(min-width: 768px)').matches;
      if (isDesktop) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);
  const clearFilters = () => {
    console.log('Clear filters called');
    onCategoryChange([]);
    onRatingChange([]);
    onPriceRangeChange([0, maxPrice]);
    onStockFilterChange(false);
    onSearchChange('');
    onBrandChange([]);
    onDiscountedChange(false);
  };

  const handleClose = () => {
    console.log('Modal close called');
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[9999] ${isOpen ? 'md:flex' : 'hidden'} bg-black/10 backdrop-blur-[1px]`} onClick={handleClose}>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Gelişmiş Filtreler</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
        
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Brands */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Markalar</h3>
                <div className="space-y-2 max-h-45 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
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
                        className="mr-3"
                      />
                      <span className="text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
                 {/* Stock & Discount */}
              <div className="space-y-3 mt-6 pt-5">
                <label className="flex items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => onStockFilterChange(e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm">Sadece stokta olanlar</span>
                </label>
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
                {/* Active Filters Display */}
          {(selectedCategories.length > 0 || selectedRatings.length > 0 || selectedBrands.length > 0 || 
            showInStockOnly || showDiscountedOnly || priceRange[0] > 0 || priceRange[1] < 10000) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-800 mb-3">Aktif Filtreler:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Kategori: {selectedCategories.length} seçili
                  </span>
                )}
                {selectedRatings.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Puan: {selectedRatings.join(', ')}+
                  </span>
                )}
                {selectedBrands.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Marka: {selectedBrands.join(', ')}
                  </span>
                )}
                {showInStockOnly && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Stokta
                  </span>
                )}
                {showDiscountedOnly && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    İndirimli
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    Fiyat: {priceRange[0]}-{priceRange[1]} TL
                  </span>
                )}
              </div>
            </div>
          )}
          
            </div>


            {/* Right Column */}
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Fiyat Aralığı</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
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
                  <div className="flex items-center space-x-3">
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
                <h3 className="text-lg font-semibold mb-3">Değerlendirmeler</h3>
                <div className="space-y-2">
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
              </div>

           
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="px-6"
            >
              Filtreleri Temizle
            </Button>
            <Button
              onClick={handleClose}
              className="px-6"
            >
              Filtreleri Uygula
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
