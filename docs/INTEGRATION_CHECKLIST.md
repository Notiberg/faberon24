# Backend Integration Checklist

## ✅ Completed

- [x] Created `js/api.js` with all API functions
- [x] Added API service to both `index.html` and `profile.html`
- [x] Created `BACKEND_INTEGRATION.md` with setup instructions
- [x] Created `API_REFERENCE.md` with all endpoints documentation
- [x] Implemented user credentials management (localStorage)
- [x] Implemented error handling for API requests

## 📋 API Functions Available

### User Management
- [x] `createUser(userData)` - Create new user
- [x] `getCurrentUser()` - Get current user with cars
- [x] `updateCurrentUser(updateData)` - Update profile
- [x] `deleteCurrentUser()` - Delete profile
- [x] `getUserByID(tgUserID)` - Get user by ID (internal)

### Car Management
- [x] `createCar(carData)` - Create new car
- [x] `updateCar(carID, updateData)` - Update car
- [x] `deleteCar(carID)` - Delete car
- [x] `selectCar(carID)` - Select car
- [x] `getSelectedCar(tgUserID)` - Get selected car (internal)

### Utilities
- [x] `setUserCredentials(userID, role)` - Set auth credentials
- [x] `loadUserCredentials()` - Load credentials from localStorage
- [x] `getAuthHeaders()` - Get auth headers
- [x] `formatCarData(car)` - Format car for display
- [x] `formatUserData(user)` - Format user for display

## 🔧 Next Steps for Frontend Integration

### Profile Page (`profile.html`)

1. **Load user data on page load**
   ```javascript
   // In profile.js
   document.addEventListener('DOMContentLoaded', async () => {
     loadUserCredentials();
     try {
       const user = await getCurrentUser();
       // Update UI with user data
       document.getElementById('62_1445').textContent = user.name;
       document.getElementById('62_1446').textContent = `тел. ${user.phone_number}`;
       // Update cars list
       updateCarsList(user.cars);
     } catch (error) {
       console.error('Failed to load user:', error);
     }
   });
   ```

2. **Update profile settings modal**
   ```javascript
   // In handleProfileSettingsSubmit
   await updateCurrentUser({
     name: firstName + ' ' + lastName,
     phone_number: phone
   });
   ```

3. **Integrate car management**
   ```javascript
   // In handleAddCar
   const car = await createCar({
     brand, model, licensePlate, color, size
   });
   
   // In handleEditCar
   await updateCar(carID, { color, size });
   
   // In handleDeleteCar
   await deleteCar(carID);
   
   // In selectCar
   await selectCar(carID);
   ```

### Main Page (`index.html`)

1. **Load user data on page load**
   ```javascript
   document.addEventListener('DOMContentLoaded', async () => {
     loadUserCredentials();
     try {
       const user = await getCurrentUser();
       // Update UI with user name/info
     } catch (error) {
       console.error('Failed to load user:', error);
     }
   });
   ```

2. **Update QR code with user info**
   ```javascript
   // Generate QR code with user ID or selected car info
   ```

## 🚀 Running the Backend

### Docker (Recommended)
```bash
cd SMC-UserService-main
make docker-up
```

### Local Development
```bash
cd SMC-UserService-main
make dev          # Start infrastructure
make run          # Start application
```

Backend will be available at `http://localhost:8080`

## 🧪 Testing

### Test User Creation
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "tg_user_id": 123456789,
    "name": "Test User",
    "phone_number": "+79991234567",
    "tg_link": "@testuser",
    "role": "client"
  }'
```

### Test Get Current User
```bash
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

### Test Create Car
```bash
curl -X POST http://localhost:8080/users/me/cars \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "BMW",
    "model": "X5",
    "license_plate": "Р927СО777",
    "color": "Черный",
    "size": "J"
  }'
```

## 📚 Documentation Files

- `BACKEND_INTEGRATION.md` - Setup and integration guide
- `API_REFERENCE.md` - Complete API documentation
- `js/api.js` - API service implementation
- `SMC-UserService-main/README.md` - Backend documentation
- `SMC-UserService-main/CLAUDE.md` - Backend architecture guide

## ⚠️ Important Notes

1. **Authentication**: All protected endpoints require `X-User-ID` and `X-User-Role` headers
2. **User ID**: Use Telegram user ID (int64)
3. **Car ID**: Use car ID returned from backend (int64)
4. **First Car**: First created car is automatically selected
5. **Selected Car**: Only one car can be selected at a time
6. **Role-Based Access**: Clients can only access their own data

## 🔐 Roles

- **client** - Can access only own data
- **manager** - Can access own data + company settings
- **superuser** - Full access to all data

## 📞 Support

For backend issues, check:
- Backend logs: `make docker-logs-app`
- Backend documentation: `SMC-UserService-main/README.md`
- API specification: `SMC-UserService-main/schemas/api/schema.yaml`

For frontend issues, check:
- Browser console for errors
- Network tab for API requests
- Check that backend is running on `http://localhost:8080`
