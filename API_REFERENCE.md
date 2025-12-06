# API Reference - SMC-UserService

## Base URL
```
http://localhost:8080
```

## Authentication

Protected endpoints require these headers:
```
X-User-ID: <telegram_user_id>
X-User-Role: <client|manager|superuser>
```

---

## User Management

### POST /users
**Create a new user (Public)**

Request:
```json
{
  "tg_user_id": 123456789,
  "name": "Иван",
  "phone_number": "+79991234567",
  "tg_link": "@ivan",
  "role": "client"
}
```

Response (201):
```json
{
  "tg_user_id": 123456789,
  "name": "Иван",
  "phone_number": "+79991234567",
  "tg_link": "@ivan",
  "role": "client",
  "created_at": "2024-12-06T10:20:00Z"
}
```

---

### GET /users/me
**Get current user with all cars (Protected)**

Headers:
```
X-User-ID: 123456789
X-User-Role: client
```

Response (200):
```json
{
  "tg_user_id": 123456789,
  "name": "Иван",
  "phone_number": "+79991234567",
  "tg_link": "@ivan",
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

---

### PUT /users/me
**Update current user profile (Protected)**

Request:
```json
{
  "name": "Иван Петров",
  "phone_number": "+79999999999"
}
```

Response (200): Updated user object

---

### DELETE /users/me
**Delete current user profile (Protected)**

Response (200):
```json
{
  "message": "User deleted successfully"
}
```

---

## Car Management

### POST /users/me/cars
**Create a new car (Protected)**

Request:
```json
{
  "brand": "BMW",
  "model": "X5",
  "license_plate": "Р927СО777",
  "color": "Черный",
  "size": "J"
}
```

Response (201):
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

**Note:** First created car is automatically selected

---

### PATCH /users/me/cars/{car_id}
**Update car details (Protected)**

Request (partial update):
```json
{
  "color": "Белый",
  "size": "J"
}
```

Response (200): Updated car object

---

### DELETE /users/me/cars/{car_id}
**Delete a car (Protected)**

Response (200):
```json
{
  "message": "Car deleted successfully"
}
```

**Note:** If deleted car was selected, first remaining car becomes selected

---

### PUT /users/me/cars/{car_id}/select
**Set car as selected (Protected)**

Response (200):
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

**Note:** Previous selected car is automatically deselected

---

## Internal Endpoints

### GET /internal/users/{tg_user_id}
**Get user with all cars (Inter-service communication)**

Response (200):
```json
{
  "tg_user_id": 123456789,
  "name": "Иван",
  "phone_number": "+79991234567",
  "tg_link": "@ivan",
  "role": "client",
  "cars": [...]
}
```

---

### GET /internal/users/{tg_user_id}/cars/selected
**Get selected car for user (Inter-service communication)**

Response (200):
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

---

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Invalid request data"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Access denied to this car"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Internal server error"
}
```

---

## Car Size Classes

Valid values for `size` field:
- `A` - Мини (Mini)
- `B` - Малые (Small)
- `C` - Средние/Гольф-класс (Compact)
- `D` - Большие средние (Mid-size)
- `E` - Бизнес-класс (Executive)
- `F` - Люксовые (Luxury)
- `J` - Внедорожники (SUV)
- `M` - Минивэны (Minivan)
- `S` - Спорткары (Sports)

---

## JavaScript Usage

```javascript
// Load credentials
loadUserCredentials();

// Create user
const user = await createUser({
  tgUserID: 123456789,
  name: 'Иван',
  phoneNumber: '+79991234567',
  tgLink: '@ivan',
  role: 'client'
});

// Get current user
const currentUser = await getCurrentUser();

// Update user
await updateCurrentUser({
  name: 'Иван Петров',
  phone_number: '+79999999999'
});

// Create car
const car = await createCar({
  brand: 'BMW',
  model: 'X5',
  licensePlate: 'Р927СО777',
  color: 'Черный',
  size: 'J'
});

// Update car
await updateCar(carID, { color: 'Белый' });

// Delete car
await deleteCar(carID);

// Select car
await selectCar(carID);

// Get selected car
const selectedCar = await getSelectedCar(tgUserID);
```

---

## Rate Limiting

No rate limiting implemented yet.

## Monitoring

Metrics available at:
```
GET /metrics
```

Prometheus format with labels:
- `http_requests_total` - Total requests
- `http_request_duration_seconds` - Request duration
- `http_requests_in_flight` - Active requests
