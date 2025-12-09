# github.com/m04kA/SMC-PriceService

Микросервис расчёта цен для системы онлайн-записи на автомойку. Рассчитывает стоимость услуг в зависимости от компании, услуги и класса автомобиля клиента.

## Описание

PriceService отвечает за:
- Управление правилами ценообразования для услуг компаний
- Расчёт цен на услуги с учётом класса автомобиля пользователя
- Интеграцию с UserService для получения информации об автомобиле
- Graceful degradation при недоступности внешних сервисов

## Архитектура

Проект следует принципам Clean Architecture и разделён на слои:

```
├── cmd/                          # Точки входа приложения
│   └── main.go                  # Основной entry point
├── internal/                     # Внутренняя бизнес-логика
│   ├── api/                     # HTTP handlers и middleware
│   │   ├── handlers/            # HTTP handlers (по endpoint на пакет)
│   │   └── middleware/          # Middleware (metrics)
│   ├── service/                 # CRUD бизнес-логика
│   │   └── pricingrules/        # Сервис управления правилами ценообразования
│   ├── usecase/                 # Use cases (сложная бизнес-логика)
│   │   └── calculateprice/      # Use case расчёта цены
│   ├── infra/storage/           # Репозитории для работы с БД
│   │   └── pricingrule/         # Репозиторий правил ценообразования
│   ├── integrations/            # Клиенты внешних сервисов
│   │   └── userservice/         # Клиент UserService
│   ├── domain/                  # Доменные модели
│   └── config/                  # Конфигурация приложения
├── pkg/                         # Переиспользуемые пакеты
│   ├── metrics/                 # Клиент метрик Prometheus
│   ├── dbmetrics/               # Обёртка над database/sql с метриками
│   ├── logger/                  # Структурированное логирование
│   └── psqlbuilder/             # SQL query builder
├── migrations/                  # Миграции базы данных
├── schemas/                     # OpenAPI спецификации
│   └── schema.yaml              # OpenAPI 3.0 спецификация
└── .env / .env.local           # Конфигурация окружения
```

## Типы ценообразования

Сервис поддерживает три типа правил ценообразования:

### 1. Static (статичная цена)
Фиксированная цена для услуги, не зависящая от автомобиля.

```json
{
  "pricing_type": "static",
  "base_price": 1000.00
}
```

### 2. Vehicle Class Pricing Multiplier (множители по классам)
Базовая цена умножается на коэффициент в зависимости от класса автомобиля.

```json
{
  "pricing_type": "vehicle_class_pricing_multiplier",
  "base_price": 500.00,
  "vehicle_class_multipliers": {
    "A": 0.8,
    "B": 1.0,
    "C": 1.2,
    "D": 1.5,
    "E": 2.0
  }
}
```

**Расчёт**: `final_price = base_price × multiplier`

### 3. Vehicle Class Pricing Fixed (фиксированные цены по классам)
Фиксированные цены для каждого класса автомобиля.

```json
{
  "pricing_type": "vehicle_class_pricing_fixed",
  "base_price": 800.00,
  "vehicle_class_prices": {
    "A": 600.00,
    "B": 700.00,
    "C": 800.00,
    "D": 900.00,
    "E": 1100.00
  }
}
```

### Классификация автомобилей

Используется европейская классификация:
- **A** - Mini (малый класс)
- **B** - Small (компактный)
- **C** - Medium (средний)
- **D** - Large (большой)
- **E** - Executive (представительский)
- **F** - Luxury (люкс)
- **J** - SUV (внедорожник)
- **M** - MPV (минивэн)
- **S** - Sports (спортивный)

### Базовая цена (base_price)

**Важно**: `base_price` является **обязательным полем для всех типов ценообразования**.

Используется как:
- Основная цена для типа `static`
- Базовая цена для умножения на коэффициент в типе `vehicle_class_pricing_multiplier`
- **Fallback цена** для graceful degradation:
  - Если у пользователя нет выбранного автомобиля
  - Если класс автомобиля не указан в правиле
  - Если UserService недоступен

## Graceful Degradation

Система поддерживает graceful degradation на трёх уровнях:

### 1. UserService недоступен
Если UserService не отвечает или возвращает ошибку:
- Возвращается `base_price` для всех правил
- Логируется предупреждение `[WARN] UserService degraded`
- Пользователь получает цену, но без учёта класса автомобиля

### 2. Класс автомобиля отсутствует в правиле
Если класс автомобиля пользователя не указан в `vehicle_class_multipliers` или `vehicle_class_prices`:
- Возвращается `base_price`
- Логируется предупреждение с указанием service_id и vehicle_class
- В response включается информация о классе автомобиля

### 3. Пользователь не передан в запросе
Если `user_id` не указан в запросе `/prices/calculate`:
- Возвращаются базовые цены (`base_price`) для всех услуг
- Поле `vehicle_class` отсутствует в response

## Интеграция с UserService

PriceService интегрируется с UserService для получения информации о выбранном автомобиле пользователя:

**Endpoint**: `GET /internal/users/{tg_user_id}/cars/selected`

**Response**:
```json
{
  "id": 123,
  "tg_user_id": 888999111,
  "license_plate": "A123BC777",
  "size": "E"
}
```

**Graceful degradation**:
- При недоступности сервиса возвращается `ErrServiceDegraded`
- UseCase использует `base_price` вместо расчётной цены
- Логируется на уровне ERROR для мониторинга

**Конфигурация**:
- Для **локального запуска** (make run): `USERSERVICE_BASE_URL=http://localhost:8080`
- Для **Docker** (make docker-up): `USERSERVICE_BASE_URL=http://host.docker.internal:8080`

## API Endpoints

Полная спецификация: [schemas/schema.yaml](schemas/schema.yaml)

### Расчёт цен

#### POST /api/v1/prices/calculate
Batch endpoint для расчёта цен на одну или несколько услуг.

**Request**:
```json
{
  "company_id": 1,
  "user_id": 888999111,
  "service_ids": [101, 102, 103]
}
```

**Response**:
```json
{
  "prices": [
    {
      "company_id": 1,
      "service_id": 101,
      "price": 1000.00,
      "currency": "RUB",
      "pricing_type": "static"
    },
    {
      "company_id": 1,
      "service_id": 102,
      "price": 1000.00,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_multiplier",
      "vehicle_class": "E"
    }
  ]
}
```

### Управление правилами ценообразования

#### GET /api/v1/pricing-rules
Получить список правил с фильтрацией.

**Query параметры**:
- `company_id` (optional) - фильтр по компании
- `service_id` (optional) - фильтр по услуге

#### POST /api/v1/pricing-rules
Создать правило ценообразования.

#### GET /api/v1/pricing-rules/{id}
Получить правило по ID.

#### PUT /api/v1/pricing-rules/{id}
Обновить правило ценообразования.

#### DELETE /api/v1/pricing-rules/{id}
Удалить правило ценообразования.

**Примечание**: Все endpoints публичные, авторизация не требуется (убрана для ускорения разработки).

## Система метрик Prometheus

### HTTP метрики
- `http_requests_total` - количество HTTP запросов
- `http_request_duration_seconds` - длительность запросов (histogram)
- `http_errors_total` - количество ошибок с категоризацией

### Database метрики
- `db_queries_total` - количество запросов к БД
- `db_query_duration_seconds` - длительность запросов (histogram)
- `db_errors_total` - ошибки БД с категоризацией
- `db_connections_active` - активные соединения
- `db_connections_idle` - простаивающие соединения

**Endpoint метрик**: `GET /metrics`

## Быстрый старт

### Локальный запуск

```bash
# 1. Запустить PostgreSQL и применить миграции
make dev

# 2. Запустить приложение
make run

# Приложение доступно на http://localhost:8082
# Метрики: http://localhost:8082/metrics
```

**Важно**: При локальном запуске через `make run` используются настройки из `config.toml`. Переменные окружения переопределяют значения из конфига.

### Docker

```bash
# Запустить все сервисы (app + postgres + migrations)
make docker-up

# Посмотреть логи
make docker-logs

# Остановить сервисы
make docker-down
```

## Конфигурация

### Файлы конфигурации

- **config.toml** - основная конфигурация для локального запуска
- **.env** - переменные окружения для Docker
- **.env.local** - переменные для локального запуска (БД на порту 5437)

### Основные параметры

```toml
[server]
http_port = 8082

[database]
host = "localhost"
port = 5437
dbname = "smc_priceservice"

[userservice]
base_url = "http://localhost:8080"
```

### Переменные окружения

Автоматически переопределяют значения из `config.toml`:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `HTTP_PORT`
- `USERSERVICE_BASE_URL`
- `LOG_LEVEL`, `LOG_FILE`
- `METRICS_ENABLED`

## Database Schema

### Таблица: pricing_rules

```sql
CREATE TABLE pricing_rules (
    id                          BIGSERIAL PRIMARY KEY,
    company_id                  BIGINT NOT NULL,
    service_id                  BIGINT NOT NULL,
    pricing_type                VARCHAR(50) NOT NULL,
    base_price                  DECIMAL(10, 2) NOT NULL,
    currency                    VARCHAR(3) NOT NULL DEFAULT 'RUB',
    vehicle_class_multipliers   JSONB,
    vehicle_class_prices        JSONB,
    created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, service_id)
);
```

**Индексы**:
- Primary key на `id`
- Unique constraint на `(company_id, service_id)`
- Index на `company_id` для быстрой фильтрации

## Архитектурные решения

### 1. UseCase vs Service

- **Service** (`internal/service/pricingrules`) - CRUD операции с правилами ценообразования
- **UseCase** (`internal/usecase/calculateprice`) - сложная бизнес-логика расчёта цены с интеграциями

**UseCase включает**:
- Calculator - чистая логика расчёта цены
- Интеграцию с UserService
- Batch-обработку множества услуг
- Graceful degradation

### 2. Обработка ошибок

Typed errors с обёрткой через `fmt.Errorf` и `%w`:

```go
// Repository
ErrPricingRuleNotFound = errors.New("repository: pricing rule not found")

// Service
if errors.Is(err, repo.ErrPricingRuleNotFound) {
    return nil, ErrPricingRuleNotFound
}

// Handler
if errors.Is(err, service.ErrPricingRuleNotFound) {
    handlers.RespondNotFound(w, "pricing rule not found")
    return
}
```

### 3. Структура Handler'ов

Каждый handler - отдельный пакет:
```
internal/api/handlers/calculate_prices/
├── handler.go    # HTTP handler
└── contract.go   # Интерфейсы зависимостей
```

### 4. Batch операции

Repository метод `GetBatchByCompanyAndServices` возвращает `map[int64]*domain.PricingRule` для O(1) lookup в UseCase.

## Тестирование

### Примеры запросов

```bash
# Создать правило с множителями
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 102,
    "pricing_type": "vehicle_class_pricing_multiplier",
    "base_price": 500.00,
    "currency": "RUB",
    "vehicle_class_multipliers": {
      "A": 0.8,
      "E": 2.0
    }
  }'

# Рассчитать цены для пользователя
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "user_id": 888999111,
    "service_ids": [101, 102]
  }'

# Получить список правил по компании
curl "http://localhost:8082/api/v1/pricing-rules?company_id=1"
```

## Graceful Shutdown

Сервер корректно обрабатывает сигналы `SIGINT` и `SIGTERM`:
1. Прекращает принимать новые запросы
2. Завершает обработку текущих запросов (с таймаутом)
3. Останавливает сборщики метрик
4. Закрывает соединения с БД

## Makefile команды

```bash
make build          # Собрать бинарник
make run            # Запустить локально
make dev            # Запустить только БД для разработки
make docker-up      # Запустить всё в Docker
make docker-down    # Остановить Docker сервисы
make docker-logs    # Посмотреть логи
```

## Зависимости

- **Gorilla Mux** - HTTP роутинг
- **lib/pq** - PostgreSQL драйвер
- **Prometheus client** - метрики
- **Squirrel** - SQL query builder
- **TOML parser** - конфигурация

## Порты

- **8082** - HTTP сервер (API)
- **5437** - PostgreSQL (для избежания конфликтов, порты 5435/5436 заняты другими сервисами)

## Логирование

Структурированное логирование с уровнями INFO, WARN, ERROR:
- **INFO** - успешные операции, старт/стоп сервиса
- **WARN** - graceful degradation, валидационные ошибки
- **ERROR** - критические ошибки, недоступность сервисов

Логи пишутся в `./logs/app.log` (настраивается через `LOG_FILE`).
