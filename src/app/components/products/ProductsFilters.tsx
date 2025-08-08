import { Search, Filter, Grid3X3, List, X } from 'lucide-react';
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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
      {/* Mobile Layout */}
      <div className="block md:hidden space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Input
            placeholder="Ürün ara..."
            size="lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search className="text-gray-500" />}
            className="w-full"
          />
        </div>
        
        {/* Mobile Controls Row */}
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            icon={<Filter className="text-gray-500" />}
            onClick={onFiltersOpen}
            className="flex-1"
          >
            Filtreler
          </Button>
          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} hover:bg-blue-50 transition-colors`}
              onClick={() => onViewModeChange('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mobile Dropdowns */}
        <div className="grid grid-cols-2 gap-2">
          <select
            className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'price' | 'rating' | 'newest')}
          >
            <option value="name">İsme göre</option>
            <option value="price">Fiyata göre</option>
            <option value="rating">Puana göre</option>
            <option value="newest">En yeni</option>
          </select>
          
          <select
            className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategories.length > 0 ? selectedCategories[0] : ''}
            key={selectedCategories.length > 0 ? selectedCategories[0] : 'empty'}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value) {
                const selectedCategory = categories.find(cat => cat.id === value);
                onCategoryChange([value]);
                const categoryName = selectedCategory?.name;
                if (categoryName) {
                  router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                }
              } else {
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
        
        {/* Mobile Results Count */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {filteredProductsCount} ürün bulundu
          </p>
        </div>
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-6 gap-4">
        <div className="col-span-2">
          <Input
            placeholder="Ürün ara..."
            size="lg"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<Search className="text-gray-500" />}
          />
        </div>
        
        <div>
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
        
        <div>
          <select
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategories.length > 0 ? selectedCategories[0] : ''}
            key={selectedCategories.length > 0 ? selectedCategories[0] : 'empty'}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value) {
                const selectedCategory = categories.find(cat => cat.id === value);
                onCategoryChange([value]);
                const categoryName = selectedCategory?.name;
                if (categoryName) {
                  router.push(`/products?category=${encodeURIComponent(categoryName)}`);
                }
              } else {
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
        
        <div>
          <Button
            size="lg"
            icon={<Filter className="text-gray-500" />}
            onClick={onFiltersOpen}
            className="w-full"
          >
            Filtreler
          </Button>
        </div>
        
        <div>
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
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {filteredProductsCount} ürün bulundu
          </p>
        </div>
      </div>
    </div>
  );
}
