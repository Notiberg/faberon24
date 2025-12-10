# 🚀 БЫСТРЫЙ СТАРТ РАЗВЕРТЫВАНИЯ

## ⚡ 5 МИНУТ ДО ЗАПУСКА

### ШАГИ:

#### 1️⃣ **Запустить Backend (Docker)**

```bash
# Перейти в директорию UserService
cd /Users/yaroslav/Desktop/Faberon/SMC-UserService-main

# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Должны быть запущены:
# - smc-userservice-app
# - smc-userservice-db
# - smc-sellerservice-app
# - smc-sellerservice-db
# - smc-priceservice-app
# - smc-priceservice-db
```

#### 2️⃣ **Получить IP адрес**

```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Результат: inet 192.168.1.100 (запомните это число!)
```

#### 3️⃣ **Обновить GitHub**

```bash
# Перейти в директорию фронтенда
cd /Users/yaroslav/Desktop/Faberon

# Добавить все файлы
git add -A

# Коммитить
git commit -m "Ready for Vercel deployment"

# Загрузить на GitHub
git push origin main
```

#### 4️⃣ **Развернуть на Vercel**

1. Перейти на https://vercel.com
2. Нажать **"New Project"**
3. Выбрать **"Import Git Repository"**
4. Выбрать `faberon24`
5. Нажать **"Import"**

#### 5️⃣ **Настроить Environment Variables**

В Vercel Dashboard → Settings → Environment Variables:

```
API_BASE_URL = http://192.168.1.100:8080
PRICE_API_BASE = http://192.168.1.100:8082/api/v1
SELLER_API_BASE = http://192.168.1.100:8081/api/v1
```

**Замените 192.168.1.100 на ваш IP!**

#### 6️⃣ **Дождаться развертывания**

- Vercel автоматически развернет при push на GitHub
- Проверить статус на https://vercel.com/dashboard
- Получить URL (например: https://faberon24.vercel.app)

---

## ✅ ПРОВЕРКА

### Backend работает?

```bash
# Проверить UserService
curl http://localhost:8080/users/me -H "X-User-ID: 123456789"

# Должен вернуть JSON с данными пользователя
```

### Frontend работает?

1. Открыть в браузере: `https://faberon24.vercel.app?X-UserID=123456789`
2. Должны загрузиться машины и услуги
3. Открыть DevTools (F12) → Network
4. Проверить, что API запросы идут на Backend

---

## 🔗 РЕШЕНИЕ ПРОБЛЕМЫ: Frontend не видит Backend

### Проблема: CORS ошибка

**Решение: Использовать ngrok туннель**

```bash
# 1. Установить ngrok
brew install ngrok

# 2. Запустить туннель
ngrok http 8080

# 3. Скопировать URL (например: https://abc123.ngrok.io)

# 4. Обновить в Vercel:
# API_BASE_URL = https://abc123.ngrok.io

# 5. Redeploy на Vercel (git push)
```

---

## 📱 ИСПОЛЬЗОВАНИЕ

### Открыть приложение

```
https://faberon24.vercel.app?X-UserID=123456789
```

### Разные пользователи

```
https://faberon24.vercel.app?X-UserID=111111
https://faberon24.vercel.app?X-UserID=222222
https://faberon24.vercel.app?X-UserID=333333
```

Каждый пользователь видит только свои данные!

---

## 🎯 ГОТОВО!

Теперь у вас есть:
- ✅ Backend на локальном Docker
- ✅ Frontend на Vercel
- ✅ Полная интеграция
- ✅ User-specific data isolation

**Система полностью готова к использованию!** 🚀

---

**Для подробной информации смотрите**: `docs/DEPLOYMENT_GUIDE.md`
