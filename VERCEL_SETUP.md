# 🌐 VERCEL SETUP - ПОШАГОВАЯ ИНСТРУКЦИЯ

## ✅ BACKEND ГОТОВ!

Все сервисы запущены и работают:

```
✅ UserService:    http://192.168.3.26:8080
✅ SellerService:  http://192.168.3.26:8081
✅ PriceService:   http://192.168.3.26:8082
```

---

## 📋 ШАГИ РАЗВЕРТЫВАНИЯ НА VERCEL

### Шаг 1: Убедиться, что GitHub обновлен

```bash
cd /Users/yaroslav/Desktop/Faberon

# Проверить статус
git status

# Если есть изменения, закоммитить
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Шаг 2: Перейти на Vercel

1. Открить https://vercel.com
2. Войти в аккаунт (или создать, если нет)
3. Нажать **"New Project"**

### Шаг 3: Импортировать репозиторий

1. Нажать **"Import Git Repository"**
2. Выбрать **"GitHub"**
3. Найти репозиторий **`faberon24`**
4. Нажать **"Import"**

### Шаг 4: Настроить проект

**Project Name**: `faberon24` (или другое имя)

**Framework Preset**: Оставить пустым или выбрать **"HTML"** (если доступно)

**Build Command**: Оставить пустым (не требуется для статического HTML)

**Output Directory**: `.` (текущая директория)

Нажать **"Deploy"** (пока без переменных окружения)

### Шаг 5: Дождаться развертывания

- Vercel начнет развертывание
- Это займет 1-2 минуты
- Когда готово, вы получите URL (например: `https://faberon24.vercel.app`)

### Шаг 6: Добавить Environment Variables

После успешного развертывания:

1. Перейти в **Settings** → **Environment Variables**
2. Добавить переменные:

```
API_BASE_URL = http://192.168.3.26:8080
PRICE_API_BASE = http://192.168.3.26:8082/api/v1
SELLER_API_BASE = http://192.168.3.26:8081/api/v1
```

3. Нажать **"Save"**

### Шаг 7: Redeploy проекта

1. Перейти в **Deployments**
2. Нажать на последнее развертывание
3. Нажать **"Redeploy"**
4. Дождаться завершения

---

## 🧪 ТЕСТИРОВАНИЕ

### Проверить Frontend

```
https://faberon24.vercel.app?X-UserID=123456789
```

Должны загрузиться:
- ✅ Машины пользователя
- ✅ Услуги
- ✅ Цены

### Проверить в DevTools

1. Открить DevTools (F12)
2. Перейти в **Network**
3. Проверить запросы:
   - `GET /users/me` → должен вернуть 200
   - `GET /api/v1/companies` → должен вернуть 200
   - `POST /api/v1/prices/calculate` → должен вернуть 200

### Проверить Console

Не должно быть ошибок:
- ❌ CORS ошибок
- ❌ 404 ошибок
- ❌ Network ошибок

---

## 🔗 РЕШЕНИЕ ПРОБЛЕМЫ: Frontend не видит Backend

### Проблема: CORS ошибка или "Failed to fetch"

**Причина**: Vercel (облако) не может подключиться к локальному Backend

**Решение 1: Использовать ngrok (РЕКОМЕНДУЕТСЯ)**

```bash
# 1. Установить ngrok
brew install ngrok

# 2. Запустить туннель для UserService
ngrok http 8080

# Вы получите URL вроде: https://abc123-xyz789.ngrok.io

# 3. Обновить в Vercel Environment Variables:
API_BASE_URL = https://abc123-xyz789.ngrok.io

# 4. Аналогично для других сервисов:
PRICE_API_BASE = https://def456-uvw012.ngrok.io:8082/api/v1
SELLER_API_BASE = https://ghi789-rst345.ngrok.io:8081/api/v1

# 5. Redeploy на Vercel (git push или кнопка Redeploy)
```

**Решение 2: Развернуть Backend на облаке**

Если ngrok не подходит, развернуть Backend на:
- AWS
- DigitalOcean
- Heroku
- Google Cloud
- Azure

---

## 📊 ФИНАЛЬНАЯ АРХИТЕКТУРА

```
┌─────────────────────────────────────────────────┐
│         VERCEL (Frontend)                       │
│  https://faberon24.vercel.app                   │
│  - HTML/CSS/JavaScript                          │
│  - Global CDN                                   │
│  - Environment Variables                        │
└──────────────────┬──────────────────────────────┘
                   │
                   │ API Calls
                   │ (через ngrok туннель)
                   ↓
┌─────────────────────────────────────────────────┐
│      LOCAL DOCKER (Backend)                     │
│  192.168.3.26:8080 (UserService)                │
│  192.168.3.26:8081 (SellerService)              │
│  192.168.3.26:8082 (PriceService)               │
│  - PostgreSQL Database                          │
│  - Go Microservices                             │
│  - Docker Compose                               │
└─────────────────────────────────────────────────┘
```

---

## 🎯 ГОТОВО!

После выполнения всех шагов:

✅ Frontend развернут на Vercel
✅ Backend работает локально на Docker
✅ Полная интеграция между ними
✅ Каждый пользователь видит свои данные

**Система полностью готова к использованию!** 🚀

---

## 📞 БЫСТРАЯ СПРАВКА

| Что | Где | URL |
|-----|-----|-----|
| Frontend | Vercel | https://faberon24.vercel.app |
| UserService | Docker | http://192.168.3.26:8080 |
| SellerService | Docker | http://192.168.3.26:8081 |
| PriceService | Docker | http://192.168.3.26:8082 |
| GitHub | GitHub | https://github.com/Notiberg/faberon24 |
| Vercel Dashboard | Vercel | https://vercel.com/dashboard |

---

**Last Updated**: December 10, 2025
**Status**: ✅ READY FOR DEPLOYMENT
