# Browser Console Testing Guide

## 🧪 Quick Test Commands

Open browser console (F12 → Console) and run these commands:

### 1. Check API Service

```javascript
// Check if api.js is loaded
console.log('✓ API Service Loaded:', typeof createUser === 'function');
console.log('✓ Functions available:', {
  createUser: typeof createUser,
  getCurrentUser: typeof getCurrentUser,
  createCar: typeof createCar,
  updateCar: typeof updateCar,
  deleteCar: typeof deleteCar,
  selectCar: typeof selectCar,
  setUserCredentials: typeof setUserCredentials,
  loadUserCredentials: typeof loadUserCredentials,
  getAuthHeaders: typeof getAuthHeaders,
  formatCarData: typeof formatCarData,
  formatUserData: typeof formatUserData
});
```

Expected output:
```
✓ API Service Loaded: true
✓ Functions available: {
  createUser: "function",
  getCurrentUser: "function",
  createCar: "function",
  updateCar: "function",
  deleteCar: "function",
  selectCar: "function",
  setUserCredentials: "function",
  loadUserCredentials: "function",
  getAuthHeaders: "function",
  formatCarData: "function",
  formatUserData: "function"
}
```

### 2. Test Credential Management

```javascript
// Set credentials
setUserCredentials(123456789, 'client');

// Verify they're set
console.log('✓ User ID:', currentUserID);
console.log('✓ User Role:', currentUserRole);
console.log('✓ Auth Headers:', getAuthHeaders());

// Check localStorage
console.log('✓ localStorage userID:', localStorage.getItem('userID'));
console.log('✓ localStorage userRole:', localStorage.getItem('userRole'));
```

Expected output:
```
✓ User ID: 123456789
✓ User Role: client
✓ Auth Headers: {X-User-ID: "123456789", X-User-Role: "client"}
✓ localStorage userID: 123456789
✓ localStorage userRole: client
```

### 3. Test Data Formatting

```javascript
// Test car formatting
const testCar = {
  id: 1,
  brand: 'BMW',
  model: 'X5',
  license_plate: 'Р927СО777',
  color: 'Черный',
  size: 'J',
  is_selected: true
};

const formattedCar = formatCarData(testCar);
console.log('✓ Formatted Car:', formattedCar);

// Verify formatting
console.log('✓ Keys match:', 
  formattedCar.licensePlate === 'Р927СО777' &&
  formattedCar.isSelected === true
);
```

Expected output:
```
✓ Formatted Car: {
  id: 1,
  brand: "BMW",
  model: "X5",
  licensePlate: "Р927СО777",
  color: "Черный",
  size: "J",
  isSelected: true
}
✓ Keys match: true
```

### 4. Test User Formatting

```javascript
// Test user formatting
const testUser = {
  tg_user_id: 123456789,
  name: 'Иван Петров',
  phone_number: '+79991234567',
  tg_link: '@ivan',
  role: 'client',
  cars: [
    {
      id: 1,
      brand: 'BMW',
      model: 'X5',
      license_plate: 'Р927СО777',
      color: 'Черный',
      size: 'J',
      is_selected: true
    }
  ]
};

const formattedUser = formatUserData(testUser);
console.log('✓ Formatted User:', formattedUser);

// Verify formatting
console.log('✓ User keys match:', 
  formattedUser.tgUserID === 123456789 &&
  formattedUser.phoneNumber === '+79991234567' &&
  formattedUser.cars.length === 1
);
```

Expected output:
```
✓ Formatted User: {
  tgUserID: 123456789,
  name: "Иван Петров",
  phoneNumber: "+79991234567",
  tgLink: "@ivan",
  role: "client",
  cars: [...]
}
✓ User keys match: true
```

### 5. Check Image Loading

```javascript
// Check for 404 errors
const images = document.querySelectorAll('img, [style*="background-image"]');
console.log('✓ Total elements with images:', images.length);

// Check specific images
const imageUrls = [
  'Vector_22_4.png',
  'Vector_21_182.png',
  'Vector_23_9.png',
  'Vector_23_13.png',
  'chip.png'
];

imageUrls.forEach(url => {
  fetch(`/image/${url}`)
    .then(r => console.log(`✓ ${url}: ${r.status}`))
    .catch(e => console.error(`✗ ${url}: Error`));
});
```

Expected output:
```
✓ Total elements with images: XX
✓ Vector_22_4.png: 200
✓ Vector_21_182.png: 200
✓ Vector_23_9.png: 200
✓ Vector_23_13.png: 200
✓ chip.png: 200
```

### 6. Check localStorage Persistence

```javascript
// Set credentials
setUserCredentials(987654321, 'manager');

// Reload page (Ctrl+R)
// Then run:
loadUserCredentials();
console.log('✓ Loaded User ID:', currentUserID);
console.log('✓ Loaded User Role:', currentUserRole);
```

Expected output (after page reload):
```
✓ Loaded User ID: 987654321
✓ Loaded User Role: manager
```

## 📋 Full Test Sequence

Run these commands in order:

```javascript
// 1. Check API
console.log('=== API SERVICE TEST ===');
console.log('API Loaded:', typeof createUser === 'function');

// 2. Test credentials
console.log('\n=== CREDENTIAL TEST ===');
setUserCredentials(123456789, 'client');
console.log('User ID:', currentUserID);
console.log('User Role:', currentUserRole);

// 3. Test formatting
console.log('\n=== FORMATTING TEST ===');
const car = formatCarData({
  id: 1, brand: 'BMW', model: 'X5', license_plate: 'Р927СО777',
  color: 'Черный', size: 'J', is_selected: true
});
console.log('Car formatted:', car.licensePlate === 'Р927СО777');

// 4. Test images
console.log('\n=== IMAGE LOADING TEST ===');
fetch('/image/Vector_22_4.png').then(r => console.log('Vector_22_4.png:', r.status));
fetch('/image/Vector_21_182.png').then(r => console.log('Vector_21_182.png:', r.status));

console.log('\n✓ All tests completed!');
```

## 🔍 Network Tab Inspection

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page (Ctrl+R)
4. Look for:
   - ✅ All images should have status 200
   - ❌ No 404 errors
   - ✅ api.js should load successfully
   - ✅ index.js and profile.js should load

## 🐛 Troubleshooting

### API functions not found
- Check that `api.js` is loaded in Network tab
- Check that `<script src="js/api.js" defer></script>` is in HTML
- Refresh page (Ctrl+Shift+R)

### Image 404 errors
- Check Network tab for which images fail
- Verify file exists in `/image/` folder
- Check CSS path is correct (`../image/filename`)

### localStorage not working
- Check browser privacy settings
- Try in incognito mode
- Check DevTools → Application → localStorage

### Credentials not persisting
- Check that `loadUserCredentials()` is called
- Verify localStorage has the data
- Check that `setUserCredentials()` was called first

## ✅ Success Criteria

All of these should be true:

- [ ] API functions are available
- [ ] Credentials can be set and retrieved
- [ ] Data formatting works correctly
- [ ] All images load with status 200
- [ ] No 404 errors in Network tab
- [ ] localStorage persists credentials
- [ ] Page loads without console errors

## 🚀 Next Steps

Once all tests pass:

1. Wait for Docker to be available
2. Start backend: `make docker-up`
3. Test API endpoints with curl
4. Test API calls from browser
5. Integrate API calls in profile.js and index.js
