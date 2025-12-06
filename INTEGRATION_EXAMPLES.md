# Integration Examples

## Profile Page Integration

### 1. Load User Data on Page Load

```javascript
// In profile.js, add at the beginning:

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved credentials
  loadUserCredentials();
  
  // If no user ID, redirect to login or show login modal
  if (!currentUserID) {
    console.log('No user logged in');
    return;
  }
  
  try {
    // Load user data from backend
    const user = await getCurrentUser();
    
    // Update profile section
    document.getElementById('62_1445').textContent = user.name;
    document.getElementById('62_1446').textContent = `тел. ${user.phone_number}`;
    
    // Update cars list
    updateCarsListFromAPI(user.cars);
    
  } catch (error) {
    console.error('Failed to load user data:', error);
    alert('Ошибка при загрузке данных профиля');
  }
});

// Helper function to update cars list
function updateCarsListFromAPI(cars) {
  const carsData = {};
  
  cars.forEach(car => {
    const carKey = `${car.brand} ${car.model} - ${car.license_plate}`;
    carsData[carKey] = {
      brand: car.brand,
      model: car.model,
      number: car.license_plate,
      carClass: car.size || 'Неизвестно'
    };
  });
  
  // Update global carsData object
  Object.assign(window.carsData || {}, carsData);
}
```

### 2. Update Profile Settings

```javascript
// Modify handleProfileSettingsSubmit in profile.js:

async function handleProfileSettingsSubmit(event) {
  event.preventDefault();
  
  const firstName = document.getElementById('profile-first-name').value;
  const lastName = document.getElementById('profile-last-name').value;
  const phone = document.getElementById('profile-phone').value;
  
  try {
    // Send to backend
    await updateCurrentUser({
      name: `${firstName} ${lastName}`,
      phone_number: phone
    });
    
    // Update UI
    const fullName = `${firstName} ${lastName}`;
    document.getElementById('62_1445').textContent = fullName;
    document.getElementById('62_1446').textContent = `тел. ${phone}`;
    
    closeProfileSettingsModal();
    alert('Профиль успешно обновлен!');
    
  } catch (error) {
    console.error('Failed to update profile:', error);
    alert('Ошибка при обновлении профиля: ' + error.message);
  }
}
```

### 3. Add Car Integration

```javascript
// Modify handleAddCar in profile.js:

async function handleAddCar(event) {
  event.preventDefault();
  
  const brand = document.getElementById('car-brand').value;
  const model = document.getElementById('car-model').value;
  const number = document.getElementById('car-number').value;
  
  try {
    // Create car in backend
    const newCar = await createCar({
      brand: brand,
      model: model,
      licensePlate: number,
      color: null,
      size: null
    });
    
    // Update dropdown menu
    const carKey = `${brand} ${model} - ${number}`;
    const carDropdownMenu = document.getElementById('car-dropdown-menu');
    
    const newOption = document.createElement('div');
    newOption.className = 'car-dropdown-item';
    newOption.textContent = carKey;
    newOption.onclick = () => selectCar(carKey);
    carDropdownMenu.appendChild(newOption);
    
    // Select the new car
    selectCar(carKey);
    
    closeAddCarModal();
    alert(`Автомобиль ${brand} ${model} успешно добавлен!`);
    
  } catch (error) {
    console.error('Failed to add car:', error);
    alert('Ошибка при добавлении автомобиля: ' + error.message);
  }
}
```

### 4. Update Car Integration

```javascript
// Modify handleEditCar in profile.js:

async function handleEditCar(event) {
  event.preventDefault();
  
  const brand = document.getElementById('edit-car-brand').value;
  const model = document.getElementById('edit-car-model').value;
  const number = document.getElementById('edit-car-number').value;
  const carClass = document.getElementById('edit-car-class').value;
  
  try {
    // Get current car ID (need to store it)
    const currentCarID = window.currentCarID;
    
    // Update in backend
    await updateCar(currentCarID, {
      color: null, // Update as needed
      size: carClass
    });
    
    // Update UI
    document.getElementById('62_1457').textContent = brand;
    document.getElementById('62_1458').textContent = model;
    document.getElementById('62_1459').textContent = number;
    document.getElementById('62_1462').textContent = carClass;
    
    closeEditCarModal();
    alert(`Автомобиль ${brand} ${model} успешно обновлен!`);
    
  } catch (error) {
    console.error('Failed to update car:', error);
    alert('Ошибка при обновлении автомобиля: ' + error.message);
  }
}
```

### 5. Delete Car Integration

```javascript
// Add to profile.js:

async function handleDeleteCar() {
  if (confirm('Вы уверены, что хотите удалить этот автомобиль?')) {
    try {
      const currentCarID = window.currentCarID;
      
      // Delete from backend
      await deleteCar(currentCarID);
      
      // Reload user data to update cars list
      const user = await getCurrentUser();
      updateCarsListFromAPI(user.cars);
      
      closeEditCarModal();
      alert('Автомобиль успешно удален!');
      
    } catch (error) {
      console.error('Failed to delete car:', error);
      alert('Ошибка при удалении автомобиля: ' + error.message);
    }
  }
}
```

### 6. Select Car Integration

```javascript
// Modify selectCar function in profile.js:

async function selectCar(carName) {
  const carText = document.getElementById('62_1468');
  carText.textContent = carName;
  
  try {
    // Find car ID from current user's cars
    const user = await getCurrentUser();
    const car = user.cars.find(c => 
      `${c.brand} ${c.model} - ${c.license_plate}` === carName
    );
    
    if (car) {
      // Select in backend
      await selectCar(car.id);
      
      // Update car info display
      document.getElementById('62_1457').textContent = car.brand;
      document.getElementById('62_1458').textContent = car.model;
      document.getElementById('62_1459').textContent = car.license_plate;
      document.getElementById('62_1462').textContent = car.size || 'Неизвестно';
      
      // Store current car ID for later use
      window.currentCarID = car.id;
    }
    
  } catch (error) {
    console.error('Failed to select car:', error);
  }
  
  dropdownOpen = false;
  carDropdownMenu.classList.remove('active');
}
```

## Main Page Integration

### 1. Load User Info on Page Load

```javascript
// In index.js, add at the beginning:

document.addEventListener('DOMContentLoaded', async () => {
  // Load saved credentials
  loadUserCredentials();
  
  // If user is logged in, load their data
  if (currentUserID) {
    try {
      const user = await getCurrentUser();
      
      // Update UI with user name if needed
      console.log('User loaded:', user.name);
      
      // You can use user.cars[0] for selected car info
      if (user.cars && user.cars.length > 0) {
        const selectedCar = user.cars.find(c => c.is_selected);
        if (selectedCar) {
          console.log('Selected car:', selectedCar);
        }
      }
      
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  }
});
```

## Login/Registration Flow

### 1. Create User (First Time)

```javascript
// Example: Create user from Telegram data
async function loginWithTelegram(tgData) {
  try {
    // Create user in backend
    const user = await createUser({
      tgUserID: tgData.id,
      name: tgData.first_name + ' ' + (tgData.last_name || ''),
      phoneNumber: tgData.phone_number || '',
      tgLink: tgData.username ? '@' + tgData.username : null,
      role: 'client'
    });
    
    // Credentials are automatically set in createUser
    
    // Redirect to profile or main page
    window.location.href = '/profile.html';
    
  } catch (error) {
    console.error('Failed to create user:', error);
    alert('Ошибка при регистрации: ' + error.message);
  }
}
```

### 2. Login Existing User

```javascript
// Example: Login existing user
async function loginExistingUser(tgUserID, role = 'client') {
  try {
    // Set credentials
    setUserCredentials(tgUserID, role);
    
    // Verify user exists
    const user = await getCurrentUser();
    
    // Redirect to profile
    window.location.href = '/profile.html';
    
  } catch (error) {
    console.error('Failed to login:', error);
    alert('Ошибка при входе: ' + error.message);
  }
}
```

## Error Handling Best Practices

```javascript
// Wrap all API calls in try-catch
async function safeAPICall(apiFunction, errorMessage) {
  try {
    return await apiFunction();
  } catch (error) {
    console.error(errorMessage, error);
    
    // Show user-friendly error message
    if (error.message.includes('404')) {
      alert('Данные не найдены');
    } else if (error.message.includes('403')) {
      alert('У вас нет доступа к этим данным');
    } else if (error.message.includes('400')) {
      alert('Неверные данные. Проверьте введенную информацию');
    } else {
      alert(errorMessage + ': ' + error.message);
    }
    
    return null;
  }
}

// Usage
const user = await safeAPICall(
  () => getCurrentUser(),
  'Ошибка при загрузке профиля'
);
```

## Testing in Browser Console

```javascript
// Load credentials
loadUserCredentials();

// Create test user
await createUser({
  tgUserID: 123456789,
  name: 'Test User',
  phoneNumber: '+79991234567',
  tgLink: '@testuser',
  role: 'client'
});

// Get current user
const user = await getCurrentUser();
console.log(user);

// Create car
const car = await createCar({
  brand: 'BMW',
  model: 'X5',
  licensePlate: 'Р927СО777',
  color: 'Черный',
  size: 'J'
});
console.log(car);

// Update user
await updateCurrentUser({
  name: 'Updated Name',
  phone_number: '+79999999999'
});

// Get updated user
const updatedUser = await getCurrentUser();
console.log(updatedUser);
```
