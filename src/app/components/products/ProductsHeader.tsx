interface ProductsHeaderProps {
  filterType?: string | null;
  categoryId?: string | null;
  categories: Array<{ id: number; name: string }>;
}

export default function ProductsHeader({ filterType, categoryId, categories }: ProductsHeaderProps) {
  const getTitle = () => {
    if (filterType === 'popular') return 'Öne Çıkan Ürünler';
    if (filterType === 'new') return 'Yeni Gelen Ürünler';
    if (categoryId && categories.find(cat => cat.id === parseInt(categoryId))) {
      return `${categories.find(cat => cat.id === parseInt(categoryId))?.name} Ürünleri`;
    }
    return 'Ürünler';
  };

  const getDescription = () => {
    if (filterType === 'popular') {
      return 'En çok tercih edilen ürünlerimizi keşfedin.';
    }
    if (filterType === 'new') {
      return 'En son eklenen ürünlerimizi keşfedin.';
    }
    if (categoryId && categories.find(cat => cat.id === parseInt(categoryId))) {
      return `${categories.find(cat => cat.id === parseInt(categoryId))?.name} kategorisindeki ürünleri keşfedin.`;
    }
    return 'Binlerce kaliteli ürün arasından seçiminizi yapın. Filtreleme ve sıralama seçenekleri ile istediğiniz ürünü kolayca bulun.';
  };

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {getTitle()}
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        {getDescription()}
      </p>
    </div>
  );
}
