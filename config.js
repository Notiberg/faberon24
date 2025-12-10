/**
 * Auto-generated configuration file
 * Generated at: 2025-12-10T19:41:54.868Z
 */

/**
 * API Configuration
 * Supports environment variables and localStorage
 */

// Get API URLs from environment or localStorage
window.API_BASE_URL = localStorage.getItem('API_BASE_URL') || 'http://localhost:8080';
window.SELLER_API_BASE = localStorage.getItem('SELLER_API_BASE') || 'http://localhost:8081/api/v1';
window.PRICE_API_BASE = localStorage.getItem('PRICE_API_BASE') || 'http://localhost:8082/api/v1';

console.log('✅ API Configuration loaded:', {
  API_BASE_URL: window.API_BASE_URL,
  SELLER_API_BASE: window.SELLER_API_BASE,
  PRICE_API_BASE: window.PRICE_API_BASE
});

// Function to manually set API URLs (for testing)
window.setAPIConfig = function(apiBaseUrl, sellerApiBase, priceApiBase) {
  if (apiBaseUrl) {
    window.API_BASE_URL = apiBaseUrl;
    localStorage.setItem('API_BASE_URL', apiBaseUrl);
  }
  if (sellerApiBase) {
    window.SELLER_API_BASE = sellerApiBase;
    localStorage.setItem('SELLER_API_BASE', sellerApiBase);
  }
  if (priceApiBase) {
    window.PRICE_API_BASE = priceApiBase;
    localStorage.setItem('PRICE_API_BASE', priceApiBase);
  }
  console.log('✅ API Configuration updated:', {
    API_BASE_URL: window.API_BASE_URL,
    SELLER_API_BASE: window.SELLER_API_BASE,
    PRICE_API_BASE: window.PRICE_API_BASE
  });
};
