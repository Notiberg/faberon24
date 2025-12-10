/**
 * Configuration file for API endpoints
 * This file is loaded before other scripts to set up environment variables
 */

// Function to get environment variables from multiple sources
function getEnvVar(name, defaultValue) {
  // 1. Try to get from meta tag (for Vercel injection)
  const metaTag = document.querySelector(`meta[name="${name}"]`);
  if (metaTag && metaTag.getAttribute('content')) {
    const value = metaTag.getAttribute('content');
    if (value) return value;
  }
  
  // 2. Try from window object
  if (window[name]) {
    return window[name];
  }
  
  // 3. Try from localStorage (user can set manually)
  const stored = localStorage.getItem(name);
  if (stored) {
    return stored;
  }
  
  // 4. Use default
  return defaultValue;
}

// Check for API URLs in URL parameters
const urlParams = new URLSearchParams(window.location.search);
const apiBaseFromUrl = urlParams.get('API_BASE_URL');
const sellerApiFromUrl = urlParams.get('SELLER_API_BASE');
const priceApiFromUrl = urlParams.get('PRICE_API_BASE');

// Set API URLs with priority: URL params > localStorage > defaults
window.API_BASE_URL = apiBaseFromUrl || getEnvVar('API_BASE_URL', 'http://localhost:8080');
window.SELLER_API_BASE = sellerApiFromUrl || getEnvVar('SELLER_API_BASE', 'http://localhost:8081/api/v1');
window.PRICE_API_BASE = priceApiFromUrl || getEnvVar('PRICE_API_BASE', 'http://localhost:8082/api/v1');

// Log configuration
console.log('API Configuration loaded:', {
  API_BASE_URL: window.API_BASE_URL,
  SELLER_API_BASE: window.SELLER_API_BASE,
  PRICE_API_BASE: window.PRICE_API_BASE
});

// Function to manually set API URLs (for testing or manual configuration)
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
  console.log('API Configuration updated:', {
    API_BASE_URL: window.API_BASE_URL,
    SELLER_API_BASE: window.SELLER_API_BASE,
    PRICE_API_BASE: window.PRICE_API_BASE
  });
};
