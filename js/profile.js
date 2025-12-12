// Flag to prevent multiple simultaneous requests
let isUpdating = false;

// Timeout for operations (30 seconds)
const OPERATION_TIMEOUT = 30000;

// Helper function to execute with timeout
async function executeWithTimeout(promise, timeoutMs = OPERATION_TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Операция заняла слишком много времени. Пожалуйста, попробуйте еще раз.')), timeoutMs)
    )
  ]);
}

// Function to determine car class based on brand and model
function determineCarClass(brand, model) {
  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // Luxury brands - Class A
  const luxuryBrands = ['rolls-royce', 'bentley', 'maybach', 'lamborghini', 'ferrari', 'porsche'];
  if (luxuryBrands.some(b => brandLower.includes(b))) {
    return 'A';
  }
  
  // Premium brands - Class B
  const premiumBrands = ['mercedes', 'bmw', 'audi', 'jaguar', 'lexus', 'infiniti', 'cadillac', 'lincoln'];
  if (premiumBrands.some(b => brandLower.includes(b))) {
    return 'B';
  }
  
  // Mid-range brands - Class C
  const midRangeBrands = ['volkswagen', 'volvo', 'mazda', 'honda', 'toyota', 'nissan', 'hyundai', 'kia', 'skoda'];
  if (midRangeBrands.some(b => brandLower.includes(b))) {
    return 'C';
  }
  
  // Budget brands - Class D
  const budgetBrands = ['lada', 'chevrolet', 'daewoo', 'geely', 'chery', 'lifan'];
  if (budgetBrands.some(b => brandLower.includes(b))) {
    return 'D';
  }
  
  // Default to Class C for unknown brands
  return 'C';
}

// Load user data on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Add small delay to ensure all DOM elements are ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Check if required elements exist
    const requiredElements = ['62_1445', '62_1446', '62_1457', '62_1458', '62_1459', '62_1462', '62_1468', 'car-dropdown-menu'];
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
      logger.warn('Missing DOM elements:', { missingElements });
    }
    
    loadUserCredentials();
    
    // Validate user ID
    if (!currentUserID) {
      logger.error('No user ID found in URL or localStorage');
      errorHandler.showNotification('Ошибка: не указан ID пользователя. Используйте ссылку вида: ?X-UserID=123456789', 'error');
      return;
    }
    
    logger.info('Loading user data from backend', { userID: currentUserID });
    
    // Load user data from backend with timeout
    const user = await executeWithTimeout(getCurrentUser());
    
    logger.info('User data loaded successfully', { name: user.name, carsCount: user.cars.length });
    
    // Update profile section
    const nameElement = document.getElementById('62_1445');
    const phoneElement = document.getElementById('62_1446');
    
    if (nameElement) {
      // Use user name from the response
      const displayName = user.name || currentUserName || 'Введите ваше имя';
      nameElement.textContent = displayName;
      logger.info('Updated name element', { name: displayName, source: user.name ? 'backend' : 'localStorage' });
    } else {
      logger.warn('Name element (62_1445) not found');
    }
    
    if (phoneElement) {
      const phoneText = user.phone_number ? `тел. ${user.phone_number}` : 'тел. не указан';
      phoneElement.textContent = phoneText;
      logger.info('Updated phone element', { phone: user.phone_number });
    } else {
      logger.warn('Phone element (62_1446) not found');
    }
    
    // Update cars list
    logger.info('Updating cars list from backend', { cars: user.cars });
    updateCarsListFromBackend(user.cars);
    
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'profile.js DOMContentLoaded');
    logger.error('Failed to load user data:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
});

// Helper function to update cars list from backend
function updateCarsListFromBackend(cars) {
  const carDropdownMenu = document.getElementById('car-dropdown-menu');
  
  // Clear existing items
  carDropdownMenu.innerHTML = '';
  
  // Check if there are any cars
  if (!cars || cars.length === 0) {
    logger.warn('No cars found for user');
    const emptyOption = document.createElement('div');
    emptyOption.className = 'car-dropdown-item';
    emptyOption.textContent = 'Нет автомобилей';
    emptyOption.style.opacity = '0.5';
    emptyOption.style.cursor = 'default';
    carDropdownMenu.appendChild(emptyOption);
    
    // Clear car display
    document.getElementById('62_1468').textContent = 'Нет автомобилей';
    document.getElementById('62_1457').textContent = '-';
    document.getElementById('62_1458').textContent = '-';
    document.getElementById('62_1459').textContent = '-';
    document.getElementById('62_1462').textContent = '-';
    window.currentCarID = null;
    return;
  }
  
  // Add cars from backend
  let selectedCar = null;
  cars.forEach(car => {
    const carKey = `${car.brand} ${car.model} - ${car.license_plate}`;
    const option = document.createElement('div');
    option.className = 'car-dropdown-item';
    option.textContent = carKey;
    option.onclick = () => selectCarFromBackend(car.id, carKey);
    carDropdownMenu.appendChild(option);
    
    // If this car is selected, save it
    if (car.is_selected) {
      selectedCar = car;
    }
  });
  
  // Update the display with the selected car
  // If no car is marked as selected, use the first one
  if (!selectedCar && cars.length > 0) {
    selectedCar = cars[0];
    logger.warn('No selected car found, using first car as default');
  }
  
  if (selectedCar) {
    const carKey = `${selectedCar.brand} ${selectedCar.model} - ${selectedCar.license_plate}`;
    
    // Update all car display elements
    const carDisplayElements = {
      '62_1468': carKey,
      '62_1457': selectedCar.brand,
      '62_1458': selectedCar.model,
      '62_1459': selectedCar.license_plate,
      '62_1462': selectedCar.size || 'Неизвестно'
    };
    
    // Update each element and log
    Object.entries(carDisplayElements).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId);
      if (element) {
        const oldValue = element.textContent;
        element.textContent = value;
        logger.info(`Updated element ${elementId}:`, { oldValue, newValue: value });
      } else {
        logger.error(`Element ${elementId} not found in DOM`);
      }
    });
    
    window.currentCarID = selectedCar.id;
    logger.info('Selected car updated', { 
      carID: selectedCar.id, 
      brand: selectedCar.brand, 
      model: selectedCar.model,
      licensePlate: selectedCar.license_plate
    });
  } else {
    logger.warn('No car to display');
  }
  
  logger.info('Cars list updated', { count: cars.length });
}

// Add Car Modal Functions
const addCarModal = document.getElementById('add-car-modal');
const addCarForm = document.getElementById('add-car-form');
const addCarButton = document.getElementById('62_1474');
let addCarLastClickTime = 0;
const ADD_CAR_CLICK_DELAY = 300; // milliseconds

function openAddCarModal() {
  const now = Date.now();
  if (now - addCarLastClickTime < ADD_CAR_CLICK_DELAY) {
    return; // Prevent rapid clicks
  }
  addCarLastClickTime = now;
  
  addCarModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
}

function closeAddCarModal() {
  addCarModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.body.classList.remove('modal-open');
  addCarForm.reset();
}

async function handleAddCar(event) {
  event.preventDefault();
  
  const brand = document.getElementById('car-brand').value;
  const model = document.getElementById('car-model').value;
  const number = document.getElementById('car-number').value;
  
  try {
    // Validate input
    if (!brand || !model || !number) {
      errorHandler.showNotification('Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    // Determine car class automatically
    const carClass = determineCarClass(brand, model);
    logger.info('Car class determined automatically', { brand, model, carClass });
    
    // Create car in backend with timeout
    const newCar = await executeWithTimeout(createCar({
      brand: brand,
      model: model,
      licensePlate: number,
      color: null,
      size: carClass
    }));
    
    logger.info('Car created successfully', { brand, model, carClass });
    
    closeAddCarModal();
    errorHandler.showNotification(`Автомобиль ${brand} ${model} (Класс ${carClass}) успешно добавлен!`, 'success');
    
    // Reload user data automatically
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = await executeWithTimeout(getCurrentUser());
    updateCarsListFromBackend(user.cars);
    
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'handleAddCar');
    logger.error('Failed to add car:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
}

// Add click listener to add car button
if (addCarButton) {
  addCarButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openAddCarModal();
  });
}

// Close modal when clicking outside
addCarModal.addEventListener('click', (e) => {
  if (e.target === addCarModal) {
    closeAddCarModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && addCarModal.classList.contains('active')) {
    closeAddCarModal();
  }
});

// Car Dropdown Menu Functions
const carDropdownButton = document.getElementById('62_1463');
const carDropdownMenu = document.getElementById('car-dropdown-menu');
let dropdownOpen = false;

function toggleCarDropdown() {
  dropdownOpen = !dropdownOpen;
  if (dropdownOpen) {
    carDropdownMenu.classList.add('active');
  } else {
    carDropdownMenu.classList.remove('active');
  }
}

async function selectCarFromBackend(carID, carName) {
  try {
    // Select car in backend with timeout
    await executeWithTimeout(selectCar(carID));
    
    logger.info('Car selected:', { carID, carName });
    errorHandler.showNotification(`Автомобиль ${carName} выбран!`, 'success');
    
    // Reload user data automatically
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = await executeWithTimeout(getCurrentUser());
    updateCarsListFromBackend(user.cars);
    
    // Reload services with new car prices
    logger.info('Reloading services with new car prices');
    if (typeof loadAndRenderServices === 'function') {
      await loadAndRenderServices();
    }
    
    dropdownOpen = false;
    carDropdownMenu.classList.remove('active');
    
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'selectCarFromBackend');
    logger.error('Failed to select car:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
}

// Add click listener to dropdown button
if (carDropdownButton) {
  carDropdownButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleCarDropdown();
  });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!carDropdownButton.contains(e.target) && !carDropdownMenu.contains(e.target)) {
    if (dropdownOpen) {
      dropdownOpen = false;
      carDropdownMenu.classList.remove('active');
    }
  }
});

// Edit Car Modal Functions
const editCarModal = document.getElementById('edit-car-modal');
const editCarForm = document.getElementById('edit-car-form');
const editCarButton = document.getElementById('62_1455');
let editCarLastClickTime = 0;
const EDIT_CAR_CLICK_DELAY = 300; // milliseconds

function openEditCarModal() {
  const now = Date.now();
  if (now - editCarLastClickTime < EDIT_CAR_CLICK_DELAY) {
    return; // Prevent rapid clicks
  }
  editCarLastClickTime = now;
  
  // Check if currentCarID is set
  if (!window.currentCarID) {
    logger.warn('No car selected for editing');
    errorHandler.showNotification('Пожалуйста, выберите автомобиль для редактирования', 'error');
    return;
  }
  
  // Populate form with current car data
  const brand = document.getElementById('62_1457').textContent;
  const model = document.getElementById('62_1458').textContent;
  const number = document.getElementById('62_1459').textContent;
  
  document.getElementById('edit-car-brand').value = brand;
  document.getElementById('edit-car-model').value = model;
  document.getElementById('edit-car-number').value = number;
  
  editCarModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
}

function closeEditCarModal() {
  editCarModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.body.classList.remove('modal-open');
  editCarForm.reset();
}

async function handleEditCar(event) {
  event.preventDefault();
  
  const brand = document.getElementById('edit-car-brand').value;
  const model = document.getElementById('edit-car-model').value;
  const number = document.getElementById('edit-car-number').value;
  
  try {
    // Validate input
    if (!brand || !model || !number) {
      errorHandler.showNotification('Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    const currentCarID = window.currentCarID;
    if (!currentCarID) {
      logger.error('Cannot update car: currentCarID is not set');
      errorHandler.showNotification('Ошибка: автомобиль не выбран', 'error');
      return;
    }
    
    logger.info('Updating car', { carID: currentCarID, brand, model, number });
    
    closeEditCarModal();
    errorHandler.showNotification(`Данные автомобиля ${brand} ${model} синхронизированы! Перезагрузите страницу для обновления.`, 'success');
    
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'handleEditCar');
    logger.error('Failed to update car:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
}

async function handleDeleteCar() {
  if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
    try {
      const currentCarID = window.currentCarID;
      
      // Check if currentCarID is valid
      if (!currentCarID) {
        logger.error('Cannot delete car: currentCarID is not set');
        errorHandler.showNotification('Ошибка: автомобиль не выбран', 'error');
        return;
      }
      
      logger.info('Deleting car', { carID: currentCarID });
      
      // Delete car from backend with timeout
      await executeWithTimeout(deleteCar(currentCarID));
      
      logger.info('Car deleted successfully');
      
      closeEditCarModal();
      errorHandler.showNotification('Автомобиль успешно удален!', 'success');
      
      // Reload user data automatically
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = await executeWithTimeout(getCurrentUser());
      updateCarsListFromBackend(user.cars);
      
    } catch (error) {
      const errorInfo = errorHandler.handle(error, 'handleDeleteCar');
      logger.error('Failed to delete car:', errorInfo);
      errorHandler.showNotification(errorInfo.userMessage, 'error');
    }
  }
}

// Add click listener to edit car button
if (editCarButton) {
  editCarButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openEditCarModal();
  });
}

// Close modal when clicking outside
editCarModal.addEventListener('click', (e) => {
  if (e.target === editCarModal) {
    closeEditCarModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && editCarModal.classList.contains('active')) {
    closeEditCarModal();
  }
});

// Profile Settings Modal Functions
const profileSettingsModal = document.getElementById('profile-settings-modal');
const profileSettingsForm = document.getElementById('profile-settings-form');
const profileSettingsButton = document.getElementById('62_1450');
let profileSettingsLastClickTime = 0;
const PROFILE_SETTINGS_CLICK_DELAY = 300; // milliseconds

function openProfileSettingsModal() {
  const now = Date.now();
  if (now - profileSettingsLastClickTime < PROFILE_SETTINGS_CLICK_DELAY) {
    return; // Prevent rapid clicks
  }
  profileSettingsLastClickTime = now;
  
  // Populate form with current profile data
  const fullName = document.getElementById('62_1445').textContent;
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const phone = document.getElementById('62_1446').textContent.replace('тел. ', '');
  
  document.getElementById('profile-first-name').value = firstName;
  document.getElementById('profile-last-name').value = lastName;
  document.getElementById('profile-phone').value = phone;
  
  profileSettingsModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
}

function closeProfileSettingsModal() {
  profileSettingsModal.classList.remove('active');
  document.body.style.overflow = 'auto';
  document.body.classList.remove('modal-open');
  profileSettingsForm.reset();
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const avatarPreview = document.getElementById('avatar-preview-img');
      avatarPreview.src = e.target.result;
      
      // Also update the main avatar in the profile
      document.getElementById('62_1443').style.backgroundImage = `url('${e.target.result}')`;
    };
    reader.readAsDataURL(file);
  }
}

async function handleProfileSettingsSubmit(event) {
  event.preventDefault();
  
  const firstName = document.getElementById('profile-first-name').value;
  const lastName = document.getElementById('profile-last-name').value;
  const phone = document.getElementById('profile-phone').value;
  
  try {
    // Validate input
    if (!firstName || !lastName || !phone) {
      errorHandler.showNotification('Пожалуйста, заполните все поля', 'error');
      return;
    }
    
    // Update profile in backend with timeout
    await executeWithTimeout(updateCurrentUser({
      name: `${firstName} ${lastName}`,
      phone_number: phone
    }));
    
    logger.info('Profile updated successfully');
    errorHandler.showNotification(`Профиль успешно обновлен!`, 'success');
    
    closeProfileSettingsModal();
    
    // Reload user data automatically
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = await executeWithTimeout(getCurrentUser());
    
    // Update UI
    const fullName = `${firstName} ${lastName}`;
    document.getElementById('62_1445').textContent = fullName;
    document.getElementById('62_1446').textContent = `тел. ${phone}`;
    updateCarsListFromBackend(user.cars);
    
  } catch (error) {
    const errorInfo = errorHandler.handle(error, 'handleProfileSettingsSubmit');
    logger.error('Failed to update profile:', errorInfo);
    errorHandler.showNotification(errorInfo.userMessage, 'error');
  }
}

// Add click listener to profile settings button
if (profileSettingsButton) {
  profileSettingsButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openProfileSettingsModal();
  });
}

// Close modal when clicking outside
profileSettingsModal.addEventListener('click', (e) => {
  if (e.target === profileSettingsModal) {
    closeProfileSettingsModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && profileSettingsModal.classList.contains('active')) {
    closeProfileSettingsModal();
  }
});

// Navigation handled by href and onclick attributes
