# API Testing Guide

## ✅ Frontend Testing (Browser Console)

### 1. Test API Service Loading

Open browser console (F12) and run:

```javascript
// Check if api.js is loaded
console.log(typeof createUser);  // Should be 'function'
console.log(typeof getCurrentUser);  // Should be 'function'
console.log(typeof createCar);  // Should be 'function'
```

Expected output:
```
function
function
function
```

### 2. Test Credential Management

```javascript
// Set credentials
setUserCredentials(123456789, 'client');

// Load credentials
loadUserCredentials();

// Check credentials
console.log(currentUserID);      // Should be 123456789
console.log(currentUserRole);    // Should be 'client'

// Get auth headers
console.log(getAuthHeaders());   // Should show X-User-ID and X-User-Role
```

Expected output:
```
123456789
client
{X-User-ID: "123456789", X-User-Role: "client"}
```

### 3. Test Data Formatting

```javascript
// Test formatCarData
const testCar = {
  id: 1,
  brand: 'BMW',
  model: 'X5',
  license_plate: 'Р927СО777',
  color: 'Черный',
  size: 'J',
  is_selected: true
};

const formatted = formatCarData(testCar);
console.log(formatted);
```

Expected output:
```javascript
{
  id: 1,
  brand: 'BMW',
  model: 'X5',
  licensePlate: 'Р927СО777',
  color: 'Черный',
  size: 'J',
  isSelected: true
}
```

### 4. Test User Formatting

```javascript
// Test formatUserData
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

const formatted = formatUserData(testUser);
console.log(formatted);
```

Expected output:
```javascript
{
  tgUserID: 123456789,
  name: 'Иван Петров',
  phoneNumber: '+79991234567',
  tgLink: '@ivan',
  role: 'client',
  cars: [
    {
      id: 1,
      brand: 'BMW',
      model: 'X5',
      licensePlate: 'Р927СО777',
      color: 'Черный',
      size: 'J',
      isSelected: true
    }
  ]
}
```

## 🧪 Backend Testing (curl)

### Prerequisites

Backend must be running on `http://localhost:8080`

```bash
# Check if backend is running
curl -s http://localhost:8080/metrics | head -5
```

### 1. Create User

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

Expected response (201):
```json
{
  "tg_user_id": 123456789,
  "name": "Test User",
  "phone_number": "+79991234567",
  "tg_link": "@testuser",
  "role": "client",
  "created_at": "2024-12-06T..."
}
```

### 2. Get Current User

```bash
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

Expected response (200):
```json
{
  "tg_user_id": 123456789,
  "name": "Test User",
  "phone_number": "+79991234567",
  "tg_link": "@testuser",
  "role": "client",
  "cars": []
}
```

### 3. Create Car

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

Expected response (201):
```json
{
  "id": 1,
  "brand": "BMW",
  "model": "X5",
  "license_plate": "Р927СО777",
  "color": "Черный",
  "size": "J",
  "is_selected": true
}
```

### 4. Get User with Cars

```bash
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

Expected response (200):
```json
{
  "tg_user_id": 123456789,
  "name": "Test User",
  "phone_number": "+79991234567",
  "tg_link": "@testuser",
  "role": "client",
  "cars": [
    {
      "id": 1,
      "brand": "BMW",
      "model": "X5",
      "license_plate": "Р927СО777",
      "color": "Черный",
      "size": "J",
      "is_selected": true
    }
  ]
}
```

### 5. Update Car

```bash
curl -X PATCH http://localhost:8080/users/me/cars/1 \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client" \
  -H "Content-Type: application/json" \
  -d '{
    "color": "Белый",
    "size": "J"
  }'
```

Expected response (200):
```json
{
  "id": 1,
  "brand": "BMW",
  "model": "X5",
  "license_plate": "Р927СО777",
  "color": "Белый",
  "size": "J",
  "is_selected": true
}
```

### 6. Create Second Car

```bash
curl -X POST http://localhost:8080/users/me/cars \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Mercedes",
    "model": "C-Class",
    "license_plate": "А123БВ77",
    "color": "Серебристый",
    "size": "D"
  }'
```

Expected response (201):
```json
{
  "id": 2,
  "brand": "Mercedes",
  "model": "C-Class",
  "license_plate": "А123БВ77",
  "color": "Серебристый",
  "size": "D",
  "is_selected": false
}
```

### 7. Select Second Car

```bash
curl -X PUT http://localhost:8080/users/me/cars/2/select \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

Expected response (200):
```json
{
  "id": 2,
  "brand": "Mercedes",
  "model": "C-Class",
  "license_plate": "А123БВ77",
  "color": "Серебристый",
  "size": "D",
  "is_selected": true
}
```

### 8. Update User

```bash
curl -X PUT http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "phone_number": "+79999999999"
  }'
```

Expected response (200):
```json
{
  "tg_user_id": 123456789,
  "name": "Updated Name",
  "phone_number": "+79999999999",
  "tg_link": "@testuser",
  "role": "client"
}
```

### 9. Delete Car

```bash
curl -X DELETE http://localhost:8080/users/me/cars/1 \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

Expected response (200):
```json
{
  "message": "Car deleted successfully"
}
```

### 10. Delete User

```bash
curl -X DELETE http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

Expected response (200):
```json
{
  "message": "User deleted successfully"
}
```

## 🔍 Testing Checklist

### Frontend (Browser Console)

- [ ] API functions are loaded
- [ ] Credential management works
- [ ] Data formatting works correctly
- [ ] localStorage persists credentials

### Backend (curl or Postman)

- [ ] Create user works
- [ ] Get user works
- [ ] Update user works
- [ ] Delete user works
- [ ] Create car works
- [ ] Get user with cars works
- [ ] Update car works
- [ ] Select car works
- [ ] Delete car works
- [ ] Error handling works (404, 403, 400)

### Integration (Browser)

- [ ] API service loads without errors
- [ ] Functions are callable
- [ ] Error handling works
- [ ] Data formatting is correct

## 📝 Notes

- All timestamps are in ISO 8601 format
- Car ID is int64 (BIGINT)
- User ID is int64 (Telegram user ID)
- First created car is automatically selected
- Only one car can be selected at a time
- Clients can only access their own data

## 🐛 Troubleshooting

### Backend not responding

```bash
# Check if running
curl -v http://localhost:8080/metrics

# Check logs
cd SMC-UserService-main
make docker-logs-app

# Restart
make docker-down
make docker-up
```

### CORS errors

- Backend should be on `http://localhost:8080`
- Frontend should call the same URL
- Check browser console for details

### Authentication errors

- Verify X-User-ID and X-User-Role headers are sent
- Check that user exists in database
- Verify role is valid (client, manager, superuser)
