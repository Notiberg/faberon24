/**
 * API Service for SMC-UserService Backend Integration
 * Base URL: http://localhost:8080
 */

const API_BASE_URL = 'http://localhost:8080';

let currentUserID = null;
let currentUserRole = 'client';

// Set user credentials
function setUserCredentials(userID, role = 'client') {
  currentUserID = userID;
  currentUserRole = role;
  localStorage.setItem('userID', userID);
  localStorage.setItem('userRole', role);
}

// Load credentials from storage
function loadUserCredentials() {
  currentUserID = localStorage.getItem('userID');
  currentUserRole = localStorage.getItem('userRole') || 'client';
}

// Get auth headers
function getAuthHeaders() {
  return {
    'X-User-ID': currentUserID,
    'X-User-Role': currentUserRole
  };
}

// Make API request
async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    logger.error(`API Error (${method} ${endpoint}):`, error);
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
  return apiRequest('GET', '/users/me');
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
  return apiRequest('PATCH', `/users/me/cars/${carID}`, updateData);
}

// Delete car
async function deleteCar(carID) {
  return apiRequest('DELETE', `/users/me/cars/${carID}`);
}

// Select car
async function selectCar(carID) {
  return apiRequest('PUT', `/users/me/cars/${carID}/select`);
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
