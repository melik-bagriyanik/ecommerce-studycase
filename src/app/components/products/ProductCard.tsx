import Link from 'next/link';
import { ShoppingBag, Clock, Flame } from 'lucide-react';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import Rate from '../ui/Rate';
import GradientButton from '../GradientButton';

import { Product } from '../../types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card hoverable className="h-full">
        <div className="relative h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="text-white text-lg" />
            </div>
          )}
          {product.isNew && (
            <Tag color="green" className="absolute top-2 left-2">
              <Clock /> New
            </Tag>
          )}
          {product.isPopular && (
            <Tag color="red" className="absolute top-2 left-2">
              <Flame /> Popular
            </Tag>
          )}
          {product.originalPrice && (
            <Tag color="blue" className="absolute top-2 right-2">
              Sale
            </Tag>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2 mb-2">
            <Rate disabled value={product.rating} />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-base">${product.price}</span>
              {product.originalPrice && (
                <span className="line-through text-gray-500 ml-2 text-sm">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{product.category}</span>
          </div>
          <div className="mt-3">
            <GradientButton 
              variant="blue-purple" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart(product);
              }}
              className="w-full"
            >
              Add to Cart
            </GradientButton>
          </div>
        </div>
      </Card>
    </Link>
  );
}
