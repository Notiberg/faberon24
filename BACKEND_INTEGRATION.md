# Backend Integration Guide

## Overview

Фронтенд интегрирован с SMC-UserService backend для управления пользователями и автомобилями.

## Setup

### 1. Запуск Backend

```bash
cd SMC-UserService-main
make docker-up
```

Или локально:
```bash
make dev          # Запустить инфраструктуру
make run          # Запустить приложение
```

Backend будет доступен на `http://localhost:8080`

### 2. API Service

Файл `/js/api.js` содержит все функции для работы с backend:

```javascript
// Загрузить сохраненные учетные данные
loadUserCredentials();

// Установить учетные данные пользователя
setUserCredentials(tgUserID, role);

// Создать пользователя
await createUser({
  tgUserID: 123456789,
  name: 'Иван',
  phoneNumber: '+79991234567',
  tgLink: '@ivan',
  role: 'client'
});

// Получить текущего пользователя
const user = await getCurrentUser();

// Обновить профиль
await updateCurrentUser({
  name: 'Новое имя',
  phone_number: '+79999999999'
});

// Управление автомобилями
await createCar({
  brand: 'BMW',
  model: 'X5',
  licensePlate: 'Р927СО777',
  color: 'Черный',
  size: 'J'
});

await updateCar(carID, { color: 'Белый' });
await deleteCar(carID);
await selectCar(carID);
```

## API Endpoints

### User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users` | No | Создать пользователя |
| GET | `/users/me` | Yes | Получить текущего пользователя |
| PUT | `/users/me` | Yes | Обновить профиль |
| DELETE | `/users/me` | Yes | Удалить профиль |

### Car Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/me/cars` | Yes | Добавить автомобиль |
| PATCH | `/users/me/cars/{id}` | Yes | Обновить автомобиль |
| DELETE | `/users/me/cars/{id}` | Yes | Удалить автомобиль |
| PUT | `/users/me/cars/{id}/select` | Yes | Выбрать автомобиль |

### Internal Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/internal/users/{tg_user_id}` | Получить пользователя с автомобилями |
| GET | `/internal/users/{tg_user_id}/cars/selected` | Получить выбранный автомобиль |

## Authentication

Все защищенные endpoints требуют заголовки:

```
X-User-ID: <telegram_user_id>
X-User-Role: <client|manager|superuser>
```

Учетные данные автоматически сохраняются в `localStorage` и отправляются с каждым запросом.

## Integration Points

### Profile Page (`profile.html`)

1. **Load User Data**
```javascript
const user = await getCurrentUser();
// Обновить UI с данными пользователя
```

2. **Update Profile**
```javascript
await updateCurrentUser({
  name: firstName + ' ' + lastName,
  phone_number: phone
});
```

3. **Manage Cars**
```javascript
// Добавить автомобиль
await createCar({
  brand, model, licensePlate, color, size
});

// Обновить автомобиль
await updateCar(carID, { color, size });

// Удалить автомобиль
await deleteCar(carID);

// Выбрать автомобиль
await selectCar(carID);
```

### Main Page (`index.html`)

1. **Load Services** - Может использовать другой backend сервис
2. **QR Code** - Может содержать ссылку на выбранный автомобиль пользователя

## Error Handling

Все функции выбрасывают исключения при ошибке:

```javascript
try {
  const user = await getCurrentUser();
} catch (error) {
  console.error('Failed to load user:', error.message);
  // Показать ошибку пользователю
}
```

## Data Models

### User
```javascript
{
  tg_user_id: number,
  name: string,
  phone_number: string,
  tg_link: string | null,
  role: string,
  cars: Car[]
}
```

### Car
```javascript
{
  id: number,
  brand: string,
  model: string,
  license_plate: string,
  color: string | null,
  size: string | null,
  is_selected: boolean
}
```

## Testing

### Create Test User
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

### Get Current User
```bash
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

### Create Car
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

## Troubleshooting

### Backend not responding
- Убедитесь, что backend запущен: `make docker-up`
- Проверьте, что порт 8080 доступен
- Проверьте логи: `make docker-logs-app`

### Authentication errors
- Убедитесь, что `X-User-ID` и `X-User-Role` заголовки отправляются
- Проверьте, что пользователь существует в БД

### CORS errors
- Backend должен быть запущен на `http://localhost:8080`
- Проверьте, что фронтенд обращается к правильному URL

## Next Steps

1. Интегрировать загрузку данных пользователя при открытии профиля
2. Интегрировать сохранение изменений профиля
3. Интегрировать управление автомобилями
4. Добавить обработку ошибок и уведомления пользователю
5. Реализовать автоматическое обновление данных
