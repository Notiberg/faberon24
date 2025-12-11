/**
 * API Configuration
 * Production URLs from Railway
 */

// Get API URLs from localStorage or use production defaults
window.API_BASE_URL = localStorage.getItem('API_BASE_URL') || 'https://faberon-userservice-production.up.railway.app';
window.SELLER_API_BASE = localStorage.getItem('SELLER_API_BASE') || 'https://faberon-sellerservice-production.up.railway.app/api/v1';
window.PRICE_API_BASE = localStorage.getItem('PRICE_API_BASE') || 'https://faberon-priceservice-production.up.railway.app/api/v1';

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
