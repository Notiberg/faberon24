# 🔐 Vercel Environment Variables Setup

## ✅ РЕШЕНИЕ ПРОБЛЕМЫ

Теперь фронтенд поддерживает динамические API URLs через Environment Variables!

---

## 📋 ШАГ 1: Запустить ngrok туннель

```bash
cd /tmp
curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip -o ngrok.zip
unzip ngrok.zip
chmod +x ngrok

# Запустить туннель для UserService
./ngrok http 8080
```

Вы получите URL вроде:
```
https://abc123-xyz789.ngrok.io
```

**Скопируйте этот URL!**

---

## 📋 ШАГ 2: Добавить Environment Variables в Vercel

1. Перейти на https://vercel.com/dashboard
2. Выбрать проект **`faberon24`**
3. Перейти в **Settings** → **Environment Variables**
4. Добавить переменные:

### Переменные для Production (Vercel)

```
API_BASE_URL = https://abc123-xyz789.ngrok.io
SELLER_API_BASE = https://abc123-xyz789.ngrok.io:8081/api/v1
PRICE_API_BASE = https://abc123-xyz789.ngrok.io:8082/api/v1
```

**Замените `abc123-xyz789` на ваш ngrok URL!**

### Переменные для Preview (опционально)

Если хотите разные URLs для preview и production:

```
Preview:
API_BASE_URL = https://preview-abc123.ngrok.io
SELLER_API_BASE = https://preview-abc123.ngrok.io:8081/api/v1
PRICE_API_BASE = https://preview-abc123.ngrok.io:8082/api/v1

Production:
API_BASE_URL = https://prod-xyz789.ngrok.io
SELLER_API_BASE = https://prod-xyz789.ngrok.io:8081/api/v1
PRICE_API_BASE = https://prod-xyz789.ngrok.io:8082/api/v1
```

---

## 📋 ШАГ 3: Redeploy на Vercel

1. Перейти в **Deployments**
2. Нажать на последнее развертывание
3. Нажать **"Redeploy"**
4. Дождаться завершения

---

## 🧪 ШАГ 4: Тестировать

Откройте в браузере:

```
https://faberon24.vercel.app?X-UserID=123456789
```

Проверьте в DevTools (F12):

1. **Console** - не должно быть ошибок
2. **Network** - API запросы должны идти на ngrok URL
3. **Application** - должны загружаться машины и услуги

---

## 📊 КАК ЭТО РАБОТАЕТ

### Локально (localhost):

```javascript
// config.js устанавливает значения по умолчанию
window.API_BASE_URL = 'http://localhost:8080'
window.SELLER_API_BASE = 'http://localhost:8081/api/v1'
window.PRICE_API_BASE = 'http://localhost:8082/api/v1'
```

### На Vercel:

```javascript
// Vercel инъектирует переменные окружения
window.API_BASE_URL = 'https://abc123-xyz789.ngrok.io'
window.SELLER_API_BASE = 'https://abc123-xyz789.ngrok.io:8081/api/v1'
window.PRICE_API_BASE = 'https://abc123-xyz789.ngrok.io:8082/api/v1'
```

---

## 🔄 ОБНОВЛЕНИЕ NGROK URL

Если ngrok URL изменился:

1. Запустить ngrok заново
2. Скопировать новый URL
3. Обновить в Vercel Environment Variables
4. Нажать **"Redeploy"**

---

## ✅ ГОТОВО!

Теперь Vercel может подключаться к локальному Backend через ngrok! 🎉

---

**Last Updated**: December 10, 2025
