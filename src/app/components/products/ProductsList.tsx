import ProductListItem from './ProductListItem';
import { Product } from '../../types/Product';

interface ProductsListProps {
  products: Product[];
}

export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      {products.map((product) => (
        <ProductListItem key={product.id} product={product} />
      ))}
    </div>
  );
}
