import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for recommendations
const recommendationCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }
  
  if (clientData.count >= RATE_LIMIT) {
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

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    
    // Check rate limiting
    if (isRateLimited(clientId)) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          recommendedProductIds: [],
          reasoning: 'Rate limit nedeniyle öneriler sunulamıyor.'
        },
        { status: 429 }
      );
    }

    const { prompt, productId, allProducts } = await request.json();

    // Check cache first
    const cacheKey = `${productId}-${allProducts.length}`;
    const cachedResult = recommendationCache.get(cacheKey);
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      console.log('Serving from cache for product:', productId);
      return NextResponse.json(cachedResult.data);
    }

    // OpenAI API anahtarını environment'tan al
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OpenAI API anahtarı bulunamadı, fallback öneriler kullanılıyor');
      
      // Fallback: Basit kategori bazlı öneriler
      const sameCategoryProducts = allProducts
        .filter((p: any) => p.category === allProducts.find((p: any) => p.id === productId)?.category)
        .slice(0, 3);

      const fallbackResult = {
        recommendedProductIds: sameCategoryProducts.map((p: any) => p.id),
        reasoning: 'Aynı kategorideki benzer ürünler önerildi.'
      };

      // Cache the fallback result
      recommendationCache.set(cacheKey, {
        data: fallbackResult,
        timestamp: Date.now()
      });

      return NextResponse.json(fallbackResult);
    }

    // OpenAI API çağrısı
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
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
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('OpenAI API rate limit exceeded, using fallback');
        
        // Fallback: Basit öneriler
        const fallbackProducts = allProducts.slice(0, 3);
        const fallbackResult = {
          recommendedProductIds: fallbackProducts.map((p: any) => p.id),
          reasoning: 'API rate limit nedeniyle basit öneriler sunuldu.'
        };

        // Cache the fallback result
        recommendationCache.set(cacheKey, {
          data: fallbackResult,
          timestamp: Date.now()
        });

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
      recommendationCache.set(cacheKey, {
        data: parsedResponse,
        timestamp: Date.now()
      });
      
      return NextResponse.json(parsedResponse);
    } catch (parseError) {
      console.error('AI yanıtı parse edilemedi:', aiResponse);
      
      // Fallback: Basit öneriler
      const fallbackProducts = allProducts.slice(0, 3);
      const fallbackResult = {
        recommendedProductIds: fallbackProducts.map((p: any) => p.id),
        reasoning: 'AI yanıtı işlenemedi, genel öneriler sunuldu.'
      };

      // Cache the fallback result
      recommendationCache.set(cacheKey, {
        data: fallbackResult,
        timestamp: Date.now()
      });

      return NextResponse.json(fallbackResult);
    }

  } catch (error) {
    console.error('Öneri sistemi hatası:', error);
    
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
