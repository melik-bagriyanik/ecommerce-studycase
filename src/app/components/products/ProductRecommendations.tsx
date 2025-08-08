import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, TrendingUp, Clock } from 'lucide-react';
import { Product } from '../../types/Product';
import { getProductRecommendations } from '../../utils/recommendations';
import Card from '../ui/Card';
import Tag from '../ui/Tag';

interface ProductRecommendationsProps {
  currentProduct: Product;
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductRecommendations({ 
  currentProduct, 
  allProducts, 
  onAddToCart 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasoning, setReasoning] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getProductRecommendations({
        productId: String(currentProduct.id),
        productName: currentProduct.name,
        productDescription: currentProduct.description || '',
        productCategory: currentProduct.category,
        allProducts
      });

      // Önerilen ürünleri bul
      const recommendedProducts = allProducts.filter(product =>
        response.recommendedProductIds.includes(String(product.id))
      );

      setRecommendations(recommendedProducts);
      setReasoning(response.reasoning);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Öneri sistemi hatası:', err);
      
      // Rate limit hatası durumunda retry logic
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchRecommendations();
        }, 2000 * (retryCount + 1)); // Exponential backoff
        return;
      }
      
      setError('Öneriler yüklenirken bir hata oluştu');
      
      // Fallback: Aynı kategorideki ürünler
      const fallbackProducts = allProducts
        .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
        .slice(0, 3);
      setRecommendations(fallbackProducts);
      setReasoning('Aynı kategorideki benzer ürünler');
    } finally {
      setLoading(false);
    }
  }, [currentProduct, allProducts, retryCount]);

  useEffect(() => {
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchRecommendations();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Önerilen Ürünler</h3>
          {retryCount > 0 && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              Yeniden deneniyor... ({retryCount}/2)
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-24 mb-2"></div>
              <div className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Önerilen Ürünler</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setRetryCount(0);
              fetchRecommendations();
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Önerilen Ürünler</h3>
        {reasoning && (
          <Tag color="purple" className="text-xs">
            <TrendingUp className="w-3 h-3" />
            AI Önerisi
          </Tag>
        )}
      </div>
      
      {reasoning && (
        <p className="text-sm text-gray-600 mb-4 italic">
          "{reasoning}"
        </p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {recommendations.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card hoverable className="h-full transition-all duration-300 hover:shadow-lg">
              <div className="relative h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg overflow-hidden">
                {product.image ? (
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Clock className="text-white text-sm" />
                    </div>
                  </div>
                )}
                
                {product.isNew && (
                  <Tag color="green" className="absolute top-1 left-1 text-xs">
                    <Clock className="w-2 h-2" /> New
                  </Tag>
                )}
              </div>
              
              <div className="p-2">
                <h4 className="font-medium text-gray-900 mb-1 text-xs line-clamp-2 min-h-[2rem]">
                  {product.name}
                </h4>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-gray-900">
                    ${product.price}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-1 px-2 rounded text-xs font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Sepete Ekle
                </button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
