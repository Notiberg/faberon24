/**
 * Configuration file for API endpoints
 * This file is loaded before other scripts to set up environment variables
 */

// Function to get environment variables from meta tags or use defaults
function getEnvVar(name, defaultValue) {
  // First, try to get from meta tag (Vercel injects via meta tags)
  const metaTag = document.querySelector(`meta[name="${name}"]`);
  if (metaTag && metaTag.getAttribute('content')) {
    return metaTag.getAttribute('content');
  }
  
  // Second, try from window object
  if (window[name]) {
    return window[name];
  }
  
  // Finally, use default
  return defaultValue;
}

// Set API URLs - will be overridden by Vercel environment variables
window.API_BASE_URL = getEnvVar('API_BASE_URL', 'http://localhost:8080');
window.SELLER_API_BASE = getEnvVar('SELLER_API_BASE', 'http://localhost:8081/api/v1');
window.PRICE_API_BASE = getEnvVar('PRICE_API_BASE', 'http://localhost:8082/api/v1');

// Log configuration
console.log('API Configuration loaded:', {
  API_BASE_URL: window.API_BASE_URL,
  SELLER_API_BASE: window.SELLER_API_BASE,
  PRICE_API_BASE: window.PRICE_API_BASE
});
