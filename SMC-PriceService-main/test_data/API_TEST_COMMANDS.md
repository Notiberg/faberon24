# API Test Commands для SMC-PriceService

Примеры curl команд для тестирования API PriceService.

## Базовый URL
```
http://localhost:8082/api/v1
```

---

## 1. Управление правилами ценообразования

### 1.1. Создать правило со статичной ценой

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 101,
    "pricing_type": "static",
    "base_price": 1000.00,
    "currency": "RUB"
  }'
```

**Ожидаемый результат**: `201 Created`
```json
{
  "id": 1,
  "company_id": 1,
  "service_id": 101,
  "pricing_type": "static",
  "base_price": 1000,
  "currency": "RUB",
  "created_at": "2025-10-12T10:00:00Z",
  "updated_at": "2025-10-12T10:00:00Z"
}
```

---

### 1.2. Создать правило с множителями по классам автомобилей

```bash
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
      "B": 1.0,
      "C": 1.2,
      "D": 1.5,
      "E": 2.0,
      "F": 2.5
    }
  }'
```

**Ожидаемый результат**: `201 Created`
```json
{
  "id": 2,
  "company_id": 1,
  "service_id": 102,
  "pricing_type": "vehicle_class_pricing_multiplier",
  "base_price": 500,
  "currency": "RUB",
  "vehicle_class_multipliers": {
    "A": 0.8,
    "B": 1,
    "C": 1.2,
    "D": 1.5,
    "E": 2,
    "F": 2.5
  },
  "created_at": "2025-10-12T10:00:00Z",
  "updated_at": "2025-10-12T10:00:00Z"
}
```

---

### 1.3. Создать правило с фиксированными ценами по классам

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 103,
    "pricing_type": "vehicle_class_pricing_fixed",
    "base_price": 800.00,
    "currency": "RUB",
    "vehicle_class_prices": {
      "A": 600.00,
      "B": 700.00,
      "C": 800.00,
      "D": 900.00,
      "E": 1100.00,
      "F": 1300.00,
      "J": 1500.00,
      "M": 400.00,
      "S": 2000.00
    }
  }'
```

**Ожидаемый результат**: `201 Created` с полными данными правила

---

### 1.4. Создать правило с частичными классами (для graceful degradation)

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 104,
    "pricing_type": "vehicle_class_pricing_multiplier",
    "base_price": 750.00,
    "currency": "RUB",
    "vehicle_class_multipliers": {
      "A": 0.6,
      "B": 0.8,
      "D": 1.3,
      "F": 1.8,
      "S": 2.5
    }
  }'
```

**Примечание**: Класс E не указан - при расчёте для класса E вернётся `base_price` (graceful degradation).

---

### 1.5. Получить список всех правил

```bash
curl -s "http://localhost:8082/api/v1/pricing-rules" | jq
```

**Ожидаемый результат**: `200 OK`
```json
{
  "rules": [
    {
      "id": 1,
      "company_id": 1,
      "service_id": 101,
      "pricing_type": "static",
      "base_price": 1000,
      "currency": "RUB",
      "created_at": "2025-10-12T10:00:00Z",
      "updated_at": "2025-10-12T10:00:00Z"
    }
  ]
}
```

---

### 1.6. Получить список правил по компании

```bash
curl -s "http://localhost:8082/api/v1/pricing-rules?company_id=1" | jq
```

---

### 1.7. Получить список правил по компании и услуге

```bash
curl -s "http://localhost:8082/api/v1/pricing-rules?company_id=1&service_id=102" | jq
```

---

### 1.8. Получить правило по ID

```bash
curl -s "http://localhost:8082/api/v1/pricing-rules/1" | jq
```

**Ожидаемый результат**: `200 OK` с данными правила

---

### 1.9. Обновить правило

```bash
curl -X PUT http://localhost:8082/api/v1/pricing-rules/1 \
  -H "Content-Type: application/json" \
  -d '{
    "base_price": 1200.00
  }'
```

**Ожидаемый результат**: `200 OK` с обновлённым правилом

---

### 1.10. Удалить правило

```bash
curl -X DELETE http://localhost:8082/api/v1/pricing-rules/1
```

**Ожидаемый результат**: `204 No Content`

---

## 2. Расчёт цен

### 2.1. Рассчитать цены без пользователя (базовые цены)

```bash
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_ids": [101, 102, 103]
  }' | jq
```

**Ожидаемый результат**: `200 OK`
```json
{
  "prices": [
    {
      "company_id": 1,
      "service_id": 101,
      "price": 1000,
      "currency": "RUB",
      "pricing_type": "static"
    },
    {
      "company_id": 1,
      "service_id": 102,
      "price": 500,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_multiplier"
    },
    {
      "company_id": 1,
      "service_id": 103,
      "price": 800,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_fixed"
    }
  ]
}
```

**Примечание**: Без `user_id` возвращаются `base_price` для всех правил.

---

### 2.2. Рассчитать цены для пользователя с автомобилем класса E

```bash
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "user_id": 888999111,
    "service_ids": [101, 102, 103]
  }' | jq
```

**Ожидаемый результат**: `200 OK`
```json
{
  "prices": [
    {
      "company_id": 1,
      "service_id": 101,
      "price": 1000,
      "currency": "RUB",
      "pricing_type": "static"
    },
    {
      "company_id": 1,
      "service_id": 102,
      "price": 1000,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_multiplier",
      "vehicle_class": "E"
    },
    {
      "company_id": 1,
      "service_id": 103,
      "price": 1100,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_fixed",
      "vehicle_class": "E"
    }
  ]
}
```

**Расчёты**:
- Сервис 101 (static): 1000 (base_price)
- Сервис 102 (multiplier): 500 × 2.0 = 1000
- Сервис 103 (fixed): 1100 (фиксированная цена для класса E)

---

### 2.3. Рассчитать цены с graceful degradation (класс автомобиля отсутствует в правиле)

```bash
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "user_id": 888999111,
    "service_ids": [104]
  }' | jq
```

**Ожидаемый результат**: `200 OK`
```json
{
  "prices": [
    {
      "company_id": 1,
      "service_id": 104,
      "price": 750,
      "currency": "RUB",
      "pricing_type": "vehicle_class_pricing_multiplier",
      "vehicle_class": "E"
    }
  ]
}
```

**Примечание**: Правило для сервиса 104 не содержит множитель для класса E, поэтому возвращается `base_price` (750). В логах будет предупреждение `[WARN] Price calculation degraded for service_id=104: multiplier not found for vehicle class: E`.

---

### 2.4. Batch расчёт для множества услуг

```bash
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "user_id": 888999111,
    "service_ids": [101, 102, 103, 104, 105, 106, 107, 108]
  }' | jq
```

**Примечание**: Эффективный batch расчёт за один запрос к БД.

---

## 3. Проверка здоровья сервиса

### 3.1. Health check

```bash
curl -s http://localhost:8082/health | jq
```

**Ожидаемый результат**: `200 OK`
```json
{
  "status": "ok"
}
```

---

### 3.2. Метрики Prometheus

```bash
curl -s http://localhost:8082/metrics | head -n 20
```

**Ожидаемый результат**: Prometheus метрики в текстовом формате

---

## 4. Тестирование ошибок

### 4.1. Создать дубликат правила (ошибка уникальности)

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 101,
    "pricing_type": "static",
    "base_price": 2000.00,
    "currency": "RUB"
  }'
```

**Ожидаемый результат**: `400 Bad Request`
```json
{
  "error": "pricing rule already exists for this company and service"
}
```

---

### 4.2. Создать правило без обязательного поля base_price

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 999,
    "pricing_type": "static",
    "currency": "RUB"
  }'
```

**Ожидаемый результат**: `400 Bad Request`
```json
{
  "error": "invalid input data: base_price is required for all pricing types"
}
```

---

### 4.3. Создать правило с неверным типом ценообразования

```bash
curl -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_id": 999,
    "pricing_type": "invalid_type",
    "base_price": 1000.00,
    "currency": "RUB"
  }'
```

**Ожидаемый результат**: `400 Bad Request` с описанием ошибки валидации

---

### 4.4. Получить несуществующее правило

```bash
curl -s http://localhost:8082/api/v1/pricing-rules/99999 | jq
```

**Ожидаемый результат**: `404 Not Found`
```json
{
  "error": "pricing rule not found"
}
```

---

### 4.5. Рассчитать цены для несуществующей услуги

```bash
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "service_ids": [99999]
  }' | jq
```

**Ожидаемый результат**: `404 Not Found`
```json
{
  "error": "pricing rule not found for company_id=1, service_id=99999"
}
```

---

## 5. Сценарии тестирования

### 5.1. Полный цикл CRUD

```bash
# 1. Создать правило
ID=$(curl -s -X POST http://localhost:8082/api/v1/pricing-rules \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 2,
    "service_id": 201,
    "pricing_type": "static",
    "base_price": 500.00,
    "currency": "RUB"
  }' | jq -r '.id')

echo "Created rule with ID: $ID"

# 2. Прочитать правило
curl -s "http://localhost:8082/api/v1/pricing-rules/$ID" | jq

# 3. Обновить правило
curl -s -X PUT "http://localhost:8082/api/v1/pricing-rules/$ID" \
  -H "Content-Type: application/json" \
  -d '{
    "base_price": 600.00
  }' | jq

# 4. Удалить правило
curl -X DELETE "http://localhost:8082/api/v1/pricing-rules/$ID"

echo "Rule deleted"
```

---

### 5.2. Тест graceful degradation при недоступности UserService

```bash
# Остановить UserService, затем выполнить запрос
curl -X POST http://localhost:8082/api/v1/prices/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": 1,
    "user_id": 888999111,
    "service_ids": [101, 102]
  }' | jq
```

**Ожидаемый результат**: Сервис вернёт базовые цены, в логах будет `[ERROR] UserService unavailable`.

---

## 6. Производительность

### 6.1. Benchmark batch расчёта

```bash
time for i in {1..100}; do
  curl -s -X POST http://localhost:8082/api/v1/prices/calculate \
    -H "Content-Type: application/json" \
    -d '{
      "company_id": 1,
      "user_id": 888999111,
      "service_ids": [101, 102, 103, 104, 105, 106, 107, 108]
    }' > /dev/null
done
```

---

## Примечания

1. **Формат даты**: Все timestamps в формате RFC3339 (ISO 8601)
2. **Валюта**: По умолчанию `RUB`, но можно указать любой ISO 4217 код
3. **Десятичные числа**: Цены передаются как float, хранятся как DECIMAL(10,2)
4. **jq**: Используется для форматирования JSON ответов. Установите: `brew install jq`
5. **Graceful degradation**: Всегда возвращает `base_price` при ошибках, никогда не возвращает 500
