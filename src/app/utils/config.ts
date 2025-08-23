// Recommendations API Configuration
export const RECOMMENDATIONS_CONFIG = {
  // Rate limiting settings
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 30, // Increased from 10
    WINDOW_MS: 60 * 1000, // 1 minute
  },
  
  // Caching settings
  CACHE: {
    DURATION_MS: 10 * 60 * 1000, // 10 minutes (increased from 5)
    ENABLED: true,
  },
  
  // OpenAI settings
  OPENAI: {
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 500,
    TEMPERATURE: 0.7,
    TIMEOUT_MS: 10000, // 10 seconds
  },
  
  // Fallback settings
  FALLBACK: {
    PRICE_RANGE_PERCENTAGE: 0.5, // 50% price range for similar products
    MAX_RECOMMENDATIONS: 3,
    RETRY_ATTEMPTS: 1, // Reduced from 2
    RETRY_DELAY_MS: 3000, // 3 seconds
  },
  
  // UI settings
  UI: {
    DEBOUNCE_MS: 1000, // 1 second debounce for API calls
    LOADING_DELAY_MS: 500,
  }
};

// Environment-based overrides
export function getConfig() {
  const config = { ...RECOMMENDATIONS_CONFIG };
  
  // Override with environment variables if available
  if (process.env.RECOMMENDATIONS_RATE_LIMIT) {
    config.RATE_LIMIT.REQUESTS_PER_MINUTE = parseInt(process.env.RECOMMENDATIONS_RATE_LIMIT);
  }
  
  if (process.env.RECOMMENDATIONS_CACHE_DURATION) {
    config.CACHE.DURATION_MS = parseInt(process.env.RECOMMENDATIONS_CACHE_DURATION) * 60 * 1000;
  }
  
  return config;
}

