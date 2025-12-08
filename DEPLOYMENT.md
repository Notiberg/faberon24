# Faberon24 - Deployment Guide

## Проект структура

Проект состоит из трех основных компонентов:

### 1. Фронтенд (этот репозиторий)
- Статический сайт с HTML/CSS/JavaScript
- Главная страница с услугами автомойки
- Страница профиля пользователя
- Развертывается на **Vercel**

### 2. SMC-UserService (Backend)
- Управление пользователями и их машинами
- REST API на порту 8080
- PostgreSQL база данных
- Развертывается в **Docker**

### 3. SMC-SellerService (Backend)
- Управление компаниями и услугами
- REST API на порту 8081
- PostgreSQL база данных
- Развертывается в **Docker**

## Локальное развертывание

### Требования
- Node.js (для фронтенда)
- Docker и Docker Compose (для бэкенда)
- Python 3 (для утилит)

### Запуск фронтенда локально
```bash
# Простой HTTP сервер
python3 -m http.server 8000
# или
npx http-server -p 8000
```

### Запуск бэкенда локально
```bash
# UserService
cd SMC-UserService-main
docker-compose up -d

# SellerService
cd SMC-SellerService-main
docker-compose up -d
```

## Развертывание на Vercel

### Шаг 1: Подготовка репозитория
```bash
# Убедитесь, что все файлы загружены на GitHub
git add -A
git commit -m "Prepare for Vercel deployment"
git push
```

### Шаг 2: Развертывание на Vercel
```bash
# Установите Vercel CLI
npm install -g vercel

# Разверните проект
vercel
```

### Шаг 3: Конфигурация переменных окружения
В Vercel Dashboard установите переменные окружения:
- `API_BASE_URL` - URL бэкенда UserService (например, https://your-userservice.com)
- `SELLER_API_BASE` - URL бэкенда SellerService (например, https://your-sellerservice.com)

### Шаг 4: Обновление API URL в коде
Обновите файлы для использования переменных окружения:
- `js/api.js` - используйте `process.env.API_BASE_URL` или `window.API_BASE_URL`
- `js/seller.js` - используйте `process.env.SELLER_API_BASE` или `window.SELLER_API_BASE`

## Развертывание бэкенда

### Docker Hub
```bash
# Для UserService
cd SMC-UserService-main
docker build -f Dockerfile.userService -t your-username/smc-userservice:latest .
docker push your-username/smc-userservice:latest

# Для SellerService
cd SMC-SellerService-main
docker build -f Dockerfile.sellerservice -t your-username/smc-sellerservice:latest .
docker push your-username/smc-sellerservice:latest
```

### Railway, Render или другие платформы
1. Создайте аккаунт на платформе
2. Подключите GitHub репозиторий
3. Установите переменные окружения (DB_HOST, DB_PORT, и т.д.)
4. Разверните контейнер

## Переменные окружения

### Фронтенд (Vercel)
```
API_BASE_URL=https://userservice.example.com
SELLER_API_BASE=https://sellerservice.example.com
```

### UserService (Docker)
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smc_userservice
DB_SSLMODE=disable
HTTP_PORT=8080
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log
```

### SellerService (Docker)
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=smc_sellerservice
DB_SSLMODE=disable
HTTP_PORT=8081
LOG_LEVEL=info
LOG_FILE=/app/logs/app.log
```

## Проверка развертывания

### Фронтенд
```bash
curl https://your-vercel-domain.vercel.app/index.html
```

### UserService
```bash
curl -H "X-User-ID: 123456789" -H "X-User-Role: client" \
  https://your-userservice.example.com/users/me
```

### SellerService
```bash
curl https://your-sellerservice.example.com/api/v1/companies
```

## Troubleshooting

### CORS ошибки
Убедитесь, что оба бэкенда имеют правильную конфигурацию CORS:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-User-ID, X-User-Role`

### Проблемы с подключением к БД
- Проверьте переменные окружения DB_HOST, DB_PORT
- Убедитесь, что БД запущена и доступна
- Проверьте логи контейнера: `docker logs container-name`

### Проблемы с фронтендом
- Очистите кэш браузера (Ctrl+Shift+Delete)
- Проверьте консоль браузера на ошибки
- Убедитесь, что API URL правильно установлены

## Полезные команды

```bash
# Проверить статус контейнеров
docker-compose ps

# Посмотреть логи
docker-compose logs -f service-name

# Перезагрузить сервис
docker-compose restart service-name

# Остановить все сервисы
docker-compose down

# Запустить с пересборкой
docker-compose up -d --build
```

## Контакты и поддержка

Для вопросов и проблем создавайте Issues в GitHub репозитории.
