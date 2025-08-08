import ProductCard from './ProductCard';
import { Product } from '../../types/Product';

interface ProductsGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductsGrid({ products, onAddToCart }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}
