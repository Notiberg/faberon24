/**
 * Auto-generated configuration file
 * Generated at: 2025-12-10T22:39:00.000Z
 */

// API Configuration (defaults - will be overridden by build process)
window.API_BASE_URL = 'http://localhost:8080';
window.SELLER_API_BASE = 'http://localhost:8081/api/v1';
window.PRICE_API_BASE = 'http://localhost:8082/api/v1';

// Log configuration
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
