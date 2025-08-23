import { Product } from '../types/Product';

interface RecommendationRequest {
  productId: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  allProducts: Product[];
}

interface RecommendationResponse {
  recommendedProductIds: string[];
  reasoning: string;
  rateLimited?: boolean;
  message?: string;
}

export async function getProductRecommendations(
  request: RecommendationRequest
): Promise<RecommendationResponse> {
  try {
    const { productId, productName, productDescription, productCategory, allProducts } = request;
    
    // Ürün listesini hazırla (mevcut ürün hariç)
    const otherProducts = allProducts
      .filter(p => String(p.id) !== productId)
      .map(p => ({
        id: String(p.id),
        name: p.name,
        description: p.description || '',
        category: p.category,
        price: p.price
      }));

    const prompt = `
    Aşağıdaki ürün için benzer ürünler öner:

    Ürün: ${productName}
    Açıklama: ${productDescription}
    Kategori: ${productCategory}

    Mevcut ürünler:
    ${otherProducts.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n')}

    Lütfen en uygun 3 ürünü öner ve her öneri için kısa bir açıklama yap.
    Yanıtını şu formatta ver:
    {
      "recommendedProductIds": ["id1", "id2", "id3"],
      "reasoning": "Öneri mantığı açıklaması"
    }
    `;

    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        productId,
        allProducts: otherProducts
      }),
    });

    const data = await response.json();

    // Handle rate limit response
    if (response.status === 429) {
      return {
        ...data,
        rateLimited: true
      };
    }

    if (!response.ok) {
      throw new Error('Öneri sistemi şu anda kullanılamıyor');
    }

    return data;
  } catch (error) {
    console.error('Öneri sistemi hatası:', error);
    
    // Fallback: Aynı kategorideki ürünleri öner
    const { productId, productCategory, allProducts } = request;
    const sameCategoryProducts = allProducts
      .filter(p => String(p.id) !== productId && p.category === productCategory)
      .slice(0, 3);

    return {
      recommendedProductIds: sameCategoryProducts.map(p => String(p.id)),
      reasoning: `Aynı kategorideki (${productCategory}) benzer ürünler önerildi.`,
      rateLimited: true
    };
  }
}

// Basit öneri sistemi - API hatası durumunda kullanılır
export function getSimpleRecommendations(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  // 1. Aynı kategorideki ürünler
  const sameCategory = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  // 2. Benzer fiyat aralığındaki ürünler
  const priceRange = product.price * 0.3;
  const similarPrice = allProducts
    .filter(p => 
      p.id !== product.id && 
      Math.abs(p.price - product.price) <= priceRange
    )
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, limit - sameCategory.length);

  return [...sameCategory, ...similarPrice];
}

export function getSimilarProductsByCategory(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  return allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getSimilarProductsByPrice(
  product: Product,
  allProducts: Product[],
  limit: number = 3
): Product[] {
  const priceRange = product.price * 0.3; // %30 fiyat aralığı
  
  return allProducts
    .filter(p => 
      p.id !== product.id && 
      Math.abs(p.price - product.price) <= priceRange
    )
    .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
    .slice(0, limit);
}
