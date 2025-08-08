import Link from 'next/link';
import Image from 'next/image';
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
      <Card hoverable className="h-full transition-all duration-300 hover:shadow-xl">
        <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg overflow-hidden">
          {product.image ? (
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="text-white text-2xl" />
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isNew && (
              <Tag color="green" className="text-xs">
                <Clock className="w-3 h-3" /> New
              </Tag>
            )}
            {product.isPopular && (
              <Tag color="red" className="text-xs">
                <Flame className="w-3 h-3" /> Popular
              </Tag>
            )}
          </div>
          
          {product.originalPrice && (
            <Tag color="blue" className="absolute top-2 right-2 text-xs">
              Sale
            </Tag>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-3">
            <Rate disabled value={product.rating} size="sm" />
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="line-through text-gray-500 text-sm">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          
          <div className="mt-4">
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
