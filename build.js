#!/usr/bin/env node

/**
 * Build script for Faberon24
 * Generates config.js with environment variables
 */

const fs = require('fs');
const path = require('path');

// Get environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';
const SELLER_API_BASE = process.env.SELLER_API_BASE || 'http://localhost:8081/api/v1';
const PRICE_API_BASE = process.env.PRICE_API_BASE || 'http://localhost:8082/api/v1';

// Generate config.js content
const configContent = `/**
 * Auto-generated configuration file
 * Generated at: ${new Date().toISOString()}
 */

// API Configuration
window.API_BASE_URL = '${API_BASE_URL}';
window.SELLER_API_BASE = '${SELLER_API_BASE}';
window.PRICE_API_BASE = '${PRICE_API_BASE}';

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
`;

// Write config.js
const configPath = path.join(__dirname, 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ config.js generated successfully');
console.log('📝 Configuration:');
console.log(`   API_BASE_URL: ${API_BASE_URL}`);
console.log(`   SELLER_API_BASE: ${SELLER_API_BASE}`);
console.log(`   PRICE_API_BASE: ${PRICE_API_BASE}`);
