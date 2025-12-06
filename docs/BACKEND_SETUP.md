# Backend Setup & Quick Start

## 🚀 Quick Start

### 1. Start Backend

```bash
cd SMC-UserService-main
make docker-up
```

Backend будет доступен на `http://localhost:8080`

### 2. Frontend Already Integrated

Все необходимые файлы уже созданы:
- `js/api.js` - API сервис с функциями для всех endpoints
- `index.html` - подключен `api.js`
- `profile.html` - подключен `api.js`

### 3. Test Backend

```bash
# Create test user
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "tg_user_id": 123456789,
    "name": "Test User",
    "phone_number": "+79991234567",
    "tg_link": "@testuser",
    "role": "client"
  }'

# Get user
curl -X GET http://localhost:8080/users/me \
  -H "X-User-ID: 123456789" \
  -H "X-User-Role: client"
```

## 📚 Documentation

1. **API_REFERENCE.md** - Полный список всех endpoints с примерами
2. **BACKEND_INTEGRATION.md** - Инструкции по интеграции
3. **INTEGRATION_EXAMPLES.md** - Примеры кода для profile.js и index.js
4. **INTEGRATION_CHECKLIST.md** - Чек-лист выполненных и предстоящих задач

## 🔧 Available API Functions

```javascript
// User Management
await createUser(userData)
await getCurrentUser()
await updateCurrentUser(updateData)
await deleteCurrentUser()
await getUserByID(tgUserID)

// Car Management
await createCar(carData)
await updateCar(carID, updateData)
await deleteCar(carID)
await selectCar(carID)
await getSelectedCar(tgUserID)

// Utilities
setUserCredentials(userID, role)
loadUserCredentials()
getAuthHeaders()
formatCarData(car)
formatUserData(user)
```

## 🔑 Authentication

Все защищенные endpoints требуют:
```
X-User-ID: <telegram_user_id>
X-User-Role: <client|manager|superuser>
```

Автоматически отправляются с каждым запросом через `api.js`

## 📋 Next Steps

1. **Интегрировать в profile.js:**
   - Загрузка данных пользователя при открытии страницы
   - Сохранение изменений профиля
   - Управление автомобилями (добавление, редактирование, удаление)

2. **Интегрировать в index.js:**
   - Загрузка данных пользователя
   - Отображение информации о выбранном автомобиле

3. **Добавить обработку ошибок:**
   - Уведомления пользователю при ошибках
   - Логирование ошибок

4. **Реализовать аутентификацию:**
   - Форма входа/регистрации
   - Сохранение учетных данных

## 🐛 Troubleshooting

### Backend не запускается
```bash
# Проверить логи
make docker-logs-app

# Перезапустить
make docker-down
make docker-up
```

### API ошибки
- Убедитесь, что backend запущен на `http://localhost:8080`
- Проверьте заголовки `X-User-ID` и `X-User-Role`
- Посмотрите Network tab в браузере для деталей ошибки

### CORS ошибки
- Backend должен быть на `http://localhost:8080`
- Фронтенд должен обращаться к этому же URL

## 📞 Support

- Backend docs: `SMC-UserService-main/README.md`
- Backend architecture: `SMC-UserService-main/CLAUDE.md`
- API spec: `SMC-UserService-main/schemas/api/schema.yaml`

## ✅ Completed Integration

- [x] Created `js/api.js` with all API functions
- [x] Added API service to HTML files
- [x] Created comprehensive documentation
- [x] Provided integration examples
- [x] Set up error handling
- [x] Implemented credential management

## 🎯 Ready for Frontend Implementation

Все "ручки" (endpoints) готовы к использованию. Осталось интегрировать вызовы API в `profile.js` и `index.js` согласно примерам в `INTEGRATION_EXAMPLES.md`.
