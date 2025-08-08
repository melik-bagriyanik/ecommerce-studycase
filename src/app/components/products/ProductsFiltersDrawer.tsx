import Button from '../ui/Button';
import Rate from '../ui/Rate';

interface ProductsFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
  selectedRatings: number[];
  onRatingChange: (ratings: number[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  showInStockOnly: boolean;
  onStockFilterChange: (show: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Array<{ id: number; name: string }>;
  router: any;
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
  showInStockOnly,
  onStockFilterChange,
  searchQuery,
  onSearchChange,
  categories,
  router
}: ProductsFiltersDrawerProps) {
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
    onCategoryChange([]);
    onRatingChange([]);
    onPriceRangeChange([0, 10000]);
    onStockFilterChange(false);
    onSearchChange('');
  };

  return (
    <div className={`fixed inset-0 z-50 md:hidden bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}>
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
                          onCategoryChange(newSelected);
                          // URL'i de güncelleyin:
                          if (newSelected.length === 1) {
                            const categoryName = categories.find(cat => cat.id === newSelected[0])?.name;
                            if (categoryName) {
                              router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                            }
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
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value), priceRange[1]])}
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
                        onRatingChange(newSelected);
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
                  onChange={(e) => onStockFilterChange(e.target.checked)}
                  className="mr-2"
                />
                Sadece stokta olanlar
              </label>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Filtreleri Temizle
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
