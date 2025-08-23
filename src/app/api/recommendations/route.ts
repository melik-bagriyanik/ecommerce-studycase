import { NextRequest, NextResponse } from 'next/server';
import { getConfig } from '../../utils/config';

const config = getConfig();

// In-memory cache for recommendations
const recommendationCache = new Map<string, any>();

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { 
      count: 1, 
      resetTime: now + config.RATE_LIMIT.WINDOW_MS 
    });
    return false;
  }
  
  if (clientData.count >= config.RATE_LIMIT.REQUESTS_PER_MINUTE) {
    return true;
  }
  
  clientData.count++;
  return false;
}

function getClientId(request: NextRequest): string {
  // Use IP address as client identifier
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return ip;
}

// Improved fallback recommendation logic
function getFallbackRecommendations(productId: string, allProducts: any[]): any {
  const currentProduct = allProducts.find((p: any) => p.id === productId || p._id === productId);
  
  if (!currentProduct) {
    // If product not found, return random products
    const randomProducts = allProducts.slice(0, config.FALLBACK.MAX_RECOMMENDATIONS);
    return {
      recommendedProductIds: randomProducts.map((p: any) => p.id || p._id),
      reasoning: 'Popüler ürünler önerildi.'
    };
  }

  // Same category products
  const sameCategoryProducts = allProducts
    .filter((p: any) => 
      (p.id !== productId && p._id !== productId) && 
      p.category === currentProduct.category
    )
    .slice(0, Math.ceil(config.FALLBACK.MAX_RECOMMENDATIONS / 2));

  // Similar price range products
  const priceRange = currentProduct.price * config.FALLBACK.PRICE_RANGE_PERCENTAGE;
  const similarPriceProducts = allProducts
    .filter((p: any) => 
      (p.id !== productId && p._id !== productId) && 
      p.category !== currentProduct.category &&
      Math.abs(p.price - currentProduct.price) <= priceRange
    )
    .slice(0, config.FALLBACK.MAX_RECOMMENDATIONS - sameCategoryProducts.length);

  const recommendedProducts = [...sameCategoryProducts, ...similarPriceProducts];
  
  return {
    recommendedProductIds: recommendedProducts.map((p: any) => p.id || p._id),
    reasoning: 'Kategori ve fiyat bazlı akıllı öneriler sunuldu.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    
    // Check rate limiting
    if (isRateLimited(clientId)) {
      const { productId, allProducts } = await request.json();
      const fallbackResult = getFallbackRecommendations(productId, allProducts);
      
      return NextResponse.json(
        { 
          ...fallbackResult,
          rateLimited: true,
          message: 'Rate limit aşıldı. Akıllı öneriler sunuluyor.'
        },
        { status: 429 }
      );
    }

    const { prompt, productId, allProducts } = await request.json();

    // Check cache first
    if (config.CACHE.ENABLED) {
      const cacheKey = `${productId}-${allProducts.length}`;
      const cachedResult = recommendationCache.get(cacheKey);
      
      if (cachedResult && (Date.now() - cachedResult.timestamp) < config.CACHE.DURATION_MS) {
        console.log('Serving from cache for product:', productId);
        return NextResponse.json(cachedResult.data);
      }
    }

    // OpenAI API anahtarını environment'tan al
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OpenAI API anahtarı bulunamadı, fallback öneriler kullanılıyor');
      
      const fallbackResult = getFallbackRecommendations(productId, allProducts);

      // Cache the fallback result
      if (config.CACHE.ENABLED) {
        const cacheKey = `${productId}-${allProducts.length}`;
        recommendationCache.set(cacheKey, {
          data: fallbackResult,
          timestamp: Date.now()
        });
      }

      return NextResponse.json(fallbackResult);
    }

    // OpenAI API çağrısı with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.OPENAI.TIMEOUT_MS);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: config.OPENAI.MODEL,
          messages: [
            {
              role: 'system',
              content: 'Sen bir e-ticaret öneri sistemi uzmanısın. Kullanıcılara en uygun ürünleri önerirsin.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: config.OPENAI.MAX_TOKENS,
          temperature: config.OPENAI.TEMPERATURE,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('OpenAI API rate limit exceeded, using improved fallback');
          
          const fallbackResult = getFallbackRecommendations(productId, allProducts);

          // Cache the fallback result
          if (config.CACHE.ENABLED) {
            const cacheKey = `${productId}-${allProducts.length}`;
            recommendationCache.set(cacheKey, {
              data: fallbackResult,
              timestamp: Date.now()
            });
          }

          return NextResponse.json(fallbackResult);
        }
        
        throw new Error(`OpenAI API hatası: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('AI yanıtı alınamadı');
      }

      // AI yanıtını parse et
      try {
        const parsedResponse = JSON.parse(aiResponse);
        
        // Cache the successful result
        if (config.CACHE.ENABLED) {
          const cacheKey = `${productId}-${allProducts.length}`;
          recommendationCache.set(cacheKey, {
            data: parsedResponse,
            timestamp: Date.now()
          });
        }
        
        return NextResponse.json(parsedResponse);
      } catch (parseError) {
        console.error('AI yanıtı parse edilemedi:', aiResponse);
        
        const fallbackResult = getFallbackRecommendations(productId, allProducts);

        // Cache the fallback result
        if (config.CACHE.ENABLED) {
          const cacheKey = `${productId}-${allProducts.length}`;
          recommendationCache.set(cacheKey, {
            data: fallbackResult,
            timestamp: Date.now()
          });
        }

        return NextResponse.json(fallbackResult);
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.warn('OpenAI API timeout, using fallback');
      } else {
        console.error('OpenAI API error:', fetchError);
      }
      
      const fallbackResult = getFallbackRecommendations(productId, allProducts);

      // Cache the fallback result
      if (config.CACHE.ENABLED) {
        const cacheKey = `${productId}-${allProducts.length}`;
        recommendationCache.set(cacheKey, {
          data: fallbackResult,
          timestamp: Date.now()
        });
      }

      return NextResponse.json(fallbackResult);
    }

  } catch (error) {
    console.error('Öneri sistemi hatası:', error);
    
    // Try to get fallback recommendations even in case of error
    try {
      const { productId, allProducts } = await request.json();
      const fallbackResult = getFallbackRecommendations(productId, allProducts);
      
      return NextResponse.json(fallbackResult);
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: 'Öneri sistemi şu anda kullanılamıyor',
          recommendedProductIds: [],
          reasoning: 'Sistem hatası nedeniyle öneriler sunulamıyor.'
        },
        { status: 500 }
      );
    }
  }
}
