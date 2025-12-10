# 🚀 FINAL SETUP - Полная инструкция развертывания

## ✅ СИСТЕМА ГОТОВА!

Все файлы загружены на GitHub. Теперь нужно правильно настроить Vercel.

---

## 📋 ШАГИ НАСТРОЙКИ:

### Шаг 1: Убедиться, что Backend работает

```bash
# Проверить UserService
curl http://localhost:8080/users/me -H "X-User-ID: 123456789"

# Проверить SellerService
curl http://localhost:8081/api/v1/companies

# Проверить PriceService
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{"company_id": 1, "service_ids": [106], "user_id": 123456789}'
```

Все должны вернуть 200 OK.

### Шаг 2: Запустить ngrok туннель

```bash
cd /tmp
curl -s https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-darwin-amd64.zip -o ngrok.zip
unzip ngrok.zip
chmod +x ngrok

./ngrok http 8080
```

**Скопируйте URL из вывода!** (например: `https://abc123-xyz789.ngrok.io`)

### Шаг 3: Перейти в Vercel Dashboard

1. Открить https://vercel.com/dashboard
2. Выбрать проект **`faberon24`**
3. Перейти в **Settings** → **Environment Variables**

### Шаг 4: Добавить Environment Variables

**ВАЖНО: Замените `abc123-xyz789` на ваш реальный ngrok URL!**

Добавить 3 переменные:

#### Переменная 1:
```
Name: API_BASE_URL
Value: https://abc123-xyz789.ngrok.io
```

#### Переменная 2:
```
Name: SELLER_API_BASE
Value: https://abc123-xyz789.ngrok.io:8081/api/v1
```

#### Переменная 3:
```
Name: PRICE_API_BASE
Value: https://abc123-xyz789.ngrok.io:8082/api/v1
```

**Для каждой переменной выберите:**
- ✅ Production
- ✅ Preview
- ✅ Development

### Шаг 5: Redeploy на Vercel

1. Перейти в **Deployments**
2. Нажать на последнее развертывание (должно быть зеленое)
3. Нажать **"Redeploy"** (кнопка справа)
4. Дождаться завершения (должно быть зеленое)

### Шаг 6: Открыть приложение

```
https://faberon24.vercel.app?X-UserID=123456789
```

**Все должно работать!** ✅

---

## 🧪 ПРОВЕРКА:

Откройте DevTools (F12) и в Console выполните:

```javascript
console.log('API_BASE_URL:', window.API_BASE_URL)
console.log('SELLER_API_BASE:', window.SELLER_API_BASE)
console.log('PRICE_API_BASE:', window.PRICE_API_BASE)
```

Должны вывести ngrok URLs (https://abc123-xyz789.ngrok.io), а не localhost!

---

## ⚠️ ЕСЛИ НЕ РАБОТАЕТ:

### Проблема: Все еще localhost URLs

**Решение:**
1. Проверить, что Environment Variables добавлены в Vercel
2. Убедиться, что выбраны все окружения (Production, Preview, Development)
3. Нажать **"Redeploy"** еще раз
4. Дождаться завершения
5. Очистить кэш браузера (Cmd+Shift+R)

### Проблема: CORS ошибка

**Решение:**
1. Убедиться, что ngrok работает: `./ngrok http 8080`
2. Убедиться, что Backend работает: `docker-compose ps`
3. Проверить, что ngrok URL правильный в Vercel Environment Variables

### Проблема: 404 на API запросах

**Решение:**
1. Проверить, что Backend сервисы запущены на правильных портах
2. Проверить, что ngrok туннель работает
3. Проверить логи Backend: `docker-compose logs app`

---

## 📊 АРХИТЕКТУРА:

```
┌─────────────────────────────────────────┐
│     VERCEL (Frontend)                   │
│  https://faberon24.vercel.app           │
│  - Статический HTML/CSS/JS              │
│  - config.js с ngrok URLs               │
│  - Environment Variables                │
└──────────────────┬──────────────────────┘
                   │
                   │ API Calls (HTTPS)
                   │ через ngrok туннель
                   ↓
┌─────────────────────────────────────────┐
│     LOCAL DOCKER (Backend)              │
│  192.168.3.26:8080/8081/8082            │
│  - UserService                          │
│  - SellerService                        │
│  - PriceService                         │
│  - PostgreSQL Database                  │
└─────────────────────────────────────────┘
```

---

## 🎯 ИТОГОВЫЙ ЧЕКЛИСТ:

- [ ] Backend запущен (docker-compose ps)
- [ ] ngrok туннель работает (./ngrok http 8080)
- [ ] ngrok URL скопирован
- [ ] Environment Variables добавлены в Vercel
- [ ] Выбраны все окружения (Production, Preview, Development)
- [ ] Redeploy выполнен на Vercel
- [ ] Vercel развертывание завершено (зеленое)
- [ ] Открыта ссылка: https://faberon24.vercel.app?X-UserID=123456789
- [ ] Проверено в DevTools: window.API_BASE_URL содержит ngrok URL
- [ ] Загружаются машины и услуги ✅

---

## 📞 БЫСТРАЯ СПРАВКА:

| Что | Команда |
|-----|---------|
| Запустить Backend | `cd SMC-UserService-main && docker-compose up -d` |
| Запустить ngrok | `./ngrok http 8080` |
| Проверить Backend | `docker-compose ps` |
| Проверить логи | `docker-compose logs app` |
| Открыть Vercel | https://vercel.com/dashboard |
| Открыть приложение | https://faberon24.vercel.app?X-UserID=123456789 |

---

**Last Updated**: December 10, 2025
**Status**: ✅ READY FOR PRODUCTION
