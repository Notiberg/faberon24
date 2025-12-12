/**
 * API Service for SMC-UserService Backend Integration
 * Base URL: http://localhost:8080
 */

// Use window.API_BASE_URL (set by config.js) or fallback to localhost
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080';

let currentUserID = null;
let currentUserRole = 'client';
let currentUserName = null;

// Parse X-UserID from URL query parameters
function parseUserIDFromURL() {
  const params = new URLSearchParams(window.location.search);
  const userIDFromURL = params.get('X-UserID');
  
  if (userIDFromURL) {
    logger.info('User ID from URL', { userIDFromURL });
    return userIDFromURL;
  }
  
  return null;
}

// Set user credentials
function setUserCredentials(userID, role = 'client', userName = null) {
  currentUserID = userID;
  currentUserRole = role;
  if (userName) {
    currentUserName = userName;
    localStorage.setItem('userName', userName);
  }
  localStorage.setItem('userID', userID);
  localStorage.setItem('userRole', role);
}

// Load credentials from URL or storage
function loadUserCredentials() {
  // First, try to get userID from URL parameters
  const userIDFromURL = parseUserIDFromURL();
  
  if (userIDFromURL) {
    // If found in URL, use it and save to localStorage
    setUserCredentials(userIDFromURL, 'client');
    logger.info('User credentials loaded from URL', { userID: userIDFromURL });
  } else {
    // Otherwise, load from localStorage
    currentUserID = localStorage.getItem('userID');
    currentUserRole = localStorage.getItem('userRole') || 'client';
    currentUserName = localStorage.getItem('userName');
    logger.info('User credentials loaded from localStorage', { userID: currentUserID, userName: currentUserName });
  }
}

// Get auth headers
function getAuthHeaders() {
  // Ensure userID is a string for headers
  const userID = String(currentUserID);
  
  if (!userID || userID === 'null' || userID === 'undefined') {
    logger.warn('Missing user ID in auth headers', { currentUserID });
  }
  
  return {
    'X-User-ID': userID,
    'X-User-Role': currentUserRole
  };
}

// Make API request
async function apiRequest(method, endpoint, body = null) {
  // Validate endpoint
  if (!endpoint || typeof endpoint !== 'string') {
    throw new Error('Invalid endpoint: must be a non-empty string');
  }
  
  // Validate user credentials
  if (!currentUserID) {
    throw new Error('User not authenticated: currentUserID is not set');
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Log request for debugging
  logger.debug(`API Request: ${method} ${url}`, { 
    userID: currentUserID,
    role: currentUserRole 
  });
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    
    // Log response status
    logger.debug(`API Response: ${method} ${url} - Status ${response.status}`);
    
    // Handle 204 No Content (success with no body)
    if (response.status === 204) {
      logger.debug('API Success (204 No Content)');
      return { success: true };
    }
    
    // Try to parse JSON response
    let data;
    try {
      const responseText = await response.text();
      if (responseText) {
        data = JSON.parse(responseText);
      } else {
        data = { success: response.ok };
      }
    } catch (jsonError) {
      logger.warn(`Failed to parse response: ${jsonError.message}`);
      // If response is not JSON, create error object
      data = {
        message: `Server returned ${response.status}: ${response.statusText}`
      };
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || `API Error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    logger.error(`API Error (${method} ${endpoint}):`, {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

// Create user (public)
async function createUser(userData) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tg_user_id: userData.tgUserID,
      name: userData.name,
      phone_number: userData.phoneNumber,
      tg_link: userData.tgLink || null,
      role: userData.role || 'client'
    })
  };

  const response = await fetch(`${API_BASE_URL}/users`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create user');
  }

  setUserCredentials(userData.tgUserID, userData.role || 'client');
  return data;
}

// Get current user
async function getCurrentUser() {
  const user = await apiRequest('GET', '/users/me');
  
  // Save user name to global variable and localStorage
  if (user && user.name) {
    currentUserName = user.name;
    localStorage.setItem('userName', user.name);
    logger.info('User name updated from backend', { name: user.name });
  }
  
  return user;
}

// Update current user
async function updateCurrentUser(updateData) {
  return apiRequest('PUT', '/users/me', updateData);
}

// Delete current user
async function deleteCurrentUser() {
  return apiRequest('DELETE', '/users/me');
}

// Get user by ID (internal)
async function getUserByID(tgUserID) {
  const url = `${API_BASE_URL}/internal/users/${tgUserID}`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get user');
  }

  return data;
}

// ============================================================================
// CAR MANAGEMENT
// ============================================================================

// Create car
async function createCar(carData) {
  return apiRequest('POST', '/users/me/cars', {
    brand: carData.brand,
    model: carData.model,
    license_plate: carData.licensePlate,
    color: carData.color || null,
    size: carData.size || null
  });
}

// Update car
async function updateCar(carID, updateData) {
  // Validate carID
  if (carID === null || carID === undefined || carID === '') {
    throw new Error('Invalid car ID: carID is required');
  }
  
  // Ensure carID is a number
  const numCarID = parseInt(carID, 10);
  if (isNaN(numCarID) || numCarID <= 0) {
    throw new Error(`Invalid car ID: "${carID}" is not a valid positive number`);
  }
  
  // Validate updateData
  if (!updateData || typeof updateData !== 'object') {
    throw new Error('Invalid update data: must be an object');
  }
  
  logger.info('Updating car', { carID: numCarID, updateData });
  return apiRequest('PATCH', `/users/me/cars/${numCarID}`, updateData);
}

// Delete car
async function deleteCar(carID) {
  // Validate carID
  if (carID === null || carID === undefined || carID === '') {
    throw new Error('Invalid car ID: carID is required');
  }
  
  // Ensure carID is a number
  const numCarID = parseInt(carID, 10);
  if (isNaN(numCarID) || numCarID <= 0) {
    throw new Error(`Invalid car ID: "${carID}" is not a valid positive number`);
  }
  
  logger.info('Deleting car', { carID: numCarID });
  return apiRequest('DELETE', `/users/me/cars/${numCarID}`);
}

// Select car
async function selectCar(carID) {
  // Validate carID
  if (carID === null || carID === undefined || carID === '') {
    throw new Error('Invalid car ID: carID is required');
  }
  
  // Ensure carID is a number
  const numCarID = parseInt(carID, 10);
  if (isNaN(numCarID) || numCarID <= 0) {
    throw new Error(`Invalid car ID: "${carID}" is not a valid positive number`);
  }
  
  logger.info('Selecting car', { carID: numCarID });
  return apiRequest('PUT', `/users/me/cars/${numCarID}/select`);
}

// Get selected car (internal)
async function getSelectedCar(tgUserID) {
  const url = `${API_BASE_URL}/internal/users/${tgUserID}/cars/selected`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get selected car');
  }

  return data;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Format car data for display
function formatCarData(car) {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    licensePlate: car.license_plate,
    color: car.color,
    size: car.size,
    isSelected: car.is_selected
  };
}

// Format user data for display
function formatUserData(user) {
  return {
    tgUserID: user.tg_user_id,
    name: user.name,
    phoneNumber: user.phone_number,
    tgLink: user.tg_link,
    role: user.role,
    cars: user.cars ? user.cars.map(formatCarData) : []
  };
}
