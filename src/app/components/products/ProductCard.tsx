"use client";
import { useEffect, useState, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Clock, Flame, Heart } from 'lucide-react';
import Card from '../ui/Card';
import Tag from '../ui/Tag';
import Rate from '../ui/Rate';
import GradientButton from '../GradientButton';

import { Product } from '../../types/Product';
import { useWishlist } from '../../store/useWishlist';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { hydrate, has, toggle } = useWishlist();
  const { showToast } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { setIsFavorite(has(product.id)); }, [has, product.id]);

  const toggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorite = has(product.id);
    toggle({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      originalPrice: (product as any).originalPrice,
      category: product.category,
    });
    setIsFavorite((v) => !v);
    showToast(`${product.name} ${wasFavorite ? 'favorilerden çıkarıldı' : 'favorilere eklendi'}!`, 'success');
  };
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
         {Boolean(product.isPopular) && (
  <Tag color="red" className="text-xs">
    <Flame className="w-3 h-3" /> Popular
  </Tag>
)}

          </div>
          
          {/* Favorite button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm"
            aria-label="Favorilere ekle"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
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
                e.stopPropagation();
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
