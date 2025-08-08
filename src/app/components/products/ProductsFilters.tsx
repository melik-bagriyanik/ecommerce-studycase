import { Search, Filter, Grid3X3, List } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ProductsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: 'name' | 'price' | 'rating' | 'newest';
  onSortChange: (value: 'name' | 'price' | 'rating' | 'newest') => void;
  selectedCategories: number[];
  onCategoryChange: (categories: number[]) => void;
  categories: Array<{ id: number; name: string }>;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onFiltersOpen: () => void;
  filteredProductsCount: number;
  router: any;
}

export default function ProductsFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCategories,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
  onFiltersOpen,
  filteredProductsCount,
  router
}: ProductsFiltersProps) {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Input
            placeholder="Ürün ara..."
            size="lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search className="text-gray-500" />}
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'price' | 'rating' | 'newest')}
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
              console.log('Category selection changed:', value);
              console.log('Available categories:', categories);
              if (value) {
                const selectedCategory = categories.find(cat => cat.id === value);
                console.log('Selected category:', selectedCategory);
                onCategoryChange([value]);
                // Kategori ismini URL'e ekle
                const categoryName = selectedCategory?.name;
                if (categoryName) {
                  console.log('Updating URL with category:', categoryName);
                  router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                }
              } else {
                console.log('Clearing category selection');
                onCategoryChange([]);
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
            onClick={onFiltersOpen}
            className="w-full"
          >
            Filtreler
          </Button>
        </div>
        <div className="col-span-1 md:col-span-1">
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`flex-1 p-3 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="text-gray-500" />
            </button>
            <button
              className={`flex-1 p-3 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="col-span-1 md:col-span-1 text-center">
          <p className="text-sm text-gray-500">
            {filteredProductsCount} ürün bulundu
          </p>
        </div>
      </div>
    </div>
  );
}
