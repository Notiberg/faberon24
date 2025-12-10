/**
 * Configuration file for API endpoints
 * This file is loaded before other scripts to set up environment variables
 */

// Get API URLs from window object (set by Vercel environment variables)
// or use defaults for local development

window.API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080';
window.SELLER_API_BASE = window.SELLER_API_BASE || 'http://localhost:8081/api/v1';
window.PRICE_API_BASE = window.PRICE_API_BASE || 'http://localhost:8082/api/v1';

// Log configuration (only in development)
if (typeof logger !== 'undefined') {
  logger.info('API Configuration loaded', {
    API_BASE_URL: window.API_BASE_URL,
    SELLER_API_BASE: window.SELLER_API_BASE,
    PRICE_API_BASE: window.PRICE_API_BASE
  });
}
