import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import Rate from '../ui/Rate';

import { Product } from '../../types/Product';

interface ProductListItemProps {
  product: Product;
}

export default function ProductListItem({ product }: ProductListItemProps) {
  return (
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
}
