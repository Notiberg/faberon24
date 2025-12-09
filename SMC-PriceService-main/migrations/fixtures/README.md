# PriceService - Test Fixtures

Тестовые данные для интеграции с BookingService.

## Загрузка фикстур

```bash
# Через docker
docker exec -i priceservice-db psql -U postgres -d smc_priceservice < migrations/fixtures/001_test_pricing_rules.sql

# Или через Makefile (если есть команда)
make fixtures
```

## Содержимое

### 001_test_pricing_rules.sql

**5 правил ценообразования** для 3 компаний и 5 услуг.

### Типы ценообразования

#### 1. Static (Статическая цена)
Одна цена для всех классов автомобилей.

```json
{
  "pricingType": "static",
  "basePrice": 800.00
}
```

#### 2. Vehicle Class Pricing Multiplier (Множители)
Базовая цена умножается на коэффициент класса автомобиля.

```json
{
  "pricingType": "vehicle_class_pricing_multiplier",
  "basePrice": 1000.00,
  "vehicleClassMultipliers": {
    "A": 0.8,
    "B": 1.0,
    "C": 1.2,
    "D": 1.5,
    "E": 1.8,
    "F": 2.0,
    "J": 2.2,
    "M": 1.8,
    "S": 2.5
  }
}
```

**Расчёт**: `finalPrice = basePrice * multiplier[vehicleClass]`

#### 3. Vehicle Class Pricing Fixed (Фиксированные цены)
Каждому классу автомобиля назначена своя цена.

```json
{
  "pricingType": "vehicle_class_pricing_fixed",
  "vehicleClassPrices": {
    "A": 3000,
    "B": 3500,
    "C": 4000,
    "D": 4500,
    "E": 5000,
    "F": 6000,
    "J": 5500,
    "M": 5000,
    "S": 7000
  }
}
```

---

## Правила для компаний и услуг

### Компания 1: Автомойка Премиум

#### Услуга 1: Комплексная мойка
- **Тип**: `vehicle_class_pricing_multiplier`
- **Базовая цена**: 1000₽
- **Примеры цен**:
  - Volkswagen Polo (B): 1000 × 1.0 = **1000₽**
  - Audi A4 (D): 1000 × 1.5 = **1500₽**
  - Mercedes E-Class (E): 1000 × 1.8 = **1800₽**
  - Porsche Cayenne (J): 1000 × 2.2 = **2200₽**

#### Услуга 2: Экспресс-мойка
- **Тип**: `static`
- **Цена**: **800₽** (для всех классов)

#### Услуга 3: Детейлинг
- **Тип**: `vehicle_class_pricing_fixed`
- **Примеры цен**:
  - Volkswagen Polo (B): **3500₽**
  - Audi A4 (D): **4500₽**
  - Mercedes E-Class (E): **5000₽**
  - Porsche Cayenne (J): **5500₽**

### Компания 2: СТО Профи

#### Услуга 10: Замена масла
- **Тип**: `vehicle_class_pricing_fixed`
- **Примеры цен**:
  - Volkswagen Polo (B): **1800₽**
  - Audi A4 (D): **2200₽**
  - Mercedes E-Class (E): **2500₽**
  - Porsche Cayenne (J): **2800₽**

### Компания 3: Детейлинг Центр

#### Услуга 20: Полировка кузова
- **Тип**: `vehicle_class_pricing_multiplier`
- **Базовая цена**: 5000₽
- **Примеры цен**:
  - Volkswagen Polo (B): 5000 × 1.0 = **5000₽**
  - Audi A4 (D): 5000 × 1.5 = **7500₽**
  - Mercedes E-Class (E): 5000 × 1.8 = **9000₽**
  - Porsche Cayenne (J): 5000 × 2.0 = **10000₽**

---

## Классы автомобилей

| Класс | Описание | Примеры | Тестовые авто |
|-------|----------|---------|---------------|
| A | Мини | Smart, Fiat 500 | - |
| B | Малый | Polo, Rio | Volkswagen Polo (5001) |
| C | Средний | Golf, Focus | - |
| D | Средний+ | Camry, A4, Model 3 | Audi A4 (3001), Tesla Model 3 (4001) |
| E | Бизнес | E-Class, 5-Series, RX350 | Mercedes E-Class (2001), Lexus RX350 (7001) |
| F | Люкс | S-Class, 7-Series | - |
| J | SUV | Cayenne, X5 | Porsche Cayenne (6001) |
| M | MPV | Odyssey, Carnival | - |
| S | Спорт | 911, R8 | - |
| L | Large SUV | X5, GLS | BMW X5 (1001) |

---

## Проверка загруженных данных

```sql
-- Подключиться к БД
psql -U postgres -d smc_priceservice

-- Проверить все правила
SELECT
    id,
    company_id,
    service_id,
    pricing_type,
    base_price,
    currency
FROM pricing_rules
ORDER BY company_id, service_id;

-- Проверить множители для услуги 1 компании 1
SELECT
    company_id,
    service_id,
    pricing_type,
    base_price,
    vehicle_class_multipliers
FROM pricing_rules
WHERE company_id = 1 AND service_id = 1;

-- Проверить фиксированные цены для услуги 10 компании 2
SELECT
    company_id,
    service_id,
    pricing_type,
    vehicle_class_prices
FROM pricing_rules
WHERE company_id = 2 AND service_id = 10;
```

---

## Интеграция с BookingService

### Как BookingService получает цену

1. **Запрос в PriceService**: `GET /api/v1/companies/{companyId}/services/{serviceId}/price?vehicleClass={class}`
2. **Ответ**:
   ```json
   {
     "companyId": 1,
     "serviceId": 1,
     "vehicleClass": "D",
     "price": 1500.00,
     "currency": "RUB",
     "pricingType": "vehicle_class_pricing_multiplier"
   }
   ```
3. **Сохранение в BookingService**: цена денормализуется и сохраняется в поле `service_price`

### Примеры расчётов

#### Бронирование пользователя 123456789 (BMW X5, класс L)
- **Компания**: 1
- **Услуга**: 1 (Комплексная мойка)
- **Расчёт**: 1000 × 1.0 (дефолт, если L не определён) = **1000₽** → сохраняется как 1500₽ в фикстурах BookingService

#### Бронирование пользователя 987654321 (Mercedes E-Class, класс E)
- **Компания**: 1
- **Услуга**: 1
- **Расчёт**: 1000 × 1.8 = **1800₽** → сохраняется как 1500₽ в фикстурах BookingService

**Примечание**: В фикстурах BookingService используются упрощённые цены. Реальные цены будут рассчитываться PriceService динамически.

---

## Тестирование API

```bash
# Получить цену для класса D (Audi A4)
curl http://localhost:8082/api/v1/companies/1/services/1/price?vehicleClass=D

# Ожидаемый результат:
# {
#   "price": 1500.00,
#   "currency": "RUB",
#   "pricingType": "vehicle_class_pricing_multiplier"
# }

# Получить цену для статической услуги
curl http://localhost:8082/api/v1/companies/1/services/2/price?vehicleClass=ANY

# Ожидаемый результат:
# {
#   "price": 800.00,
#   "currency": "RUB",
#   "pricingType": "static"
# }
```

---

## Сброс данных

```bash
# Удалить все данные
psql -U postgres -d smc_priceservice << EOF
TRUNCATE pricing_rules CASCADE;
EOF

# Применить фикстуры заново
docker exec -i priceservice-db psql -U postgres -d smc_priceservice < migrations/fixtures/001_test_pricing_rules.sql
```

---

## Расширение фикстур

Для добавления новых правил ценообразования:

1. Определить тип: `static`, `vehicle_class_pricing_multiplier`, или `vehicle_class_pricing_fixed`
2. Добавить INSERT в `001_test_pricing_rules.sql`
3. Применить фикстуры заново

**Пример**:
```sql
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    base_price,
    currency
)
VALUES (1, 4, 'static', 1200.00, 'RUB')
ON CONFLICT (company_id, service_id) DO UPDATE SET
    base_price = EXCLUDED.base_price,
    updated_at = NOW();
```
