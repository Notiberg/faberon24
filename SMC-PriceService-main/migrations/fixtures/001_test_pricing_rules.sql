-- ==========================================
-- PriceService - Тестовые фикстуры
-- ==========================================
-- Создаёт правила ценообразования для компаний и услуг
-- Соответствует данным из BookingService и SellerService фикстур
--
-- Типы ценообразования:
-- 1. static - фиксированная цена
-- 2. vehicle_class_pricing_multiplier - базовая цена * множитель класса
-- 3. vehicle_class_pricing_fixed - фиксированная цена для каждого класса

-- ==========================================
-- КОМПАНИЯ 1: Автомойка Премиум
-- ==========================================

-- Услуга 1: Комплексная мойка - множители по классам
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    base_price,
    currency,
    vehicle_class_multipliers
)
VALUES (
    1,
    1,
    'vehicle_class_pricing_multiplier',
    1000.00,
    'RUB',
    '{
        "A": 0.8,
        "B": 1.0,
        "C": 1.2,
        "D": 1.5,
        "E": 1.8,
        "F": 2.0,
        "J": 2.2,
        "M": 1.8,
        "S": 2.5
    }'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Услуга 2: Экспресс-мойка - статическая цена
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    base_price,
    currency
)
VALUES (
    1,
    2,
    'static',
    800.00,
    'RUB'
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    updated_at = NOW();

-- Услуга 3: Детейлинг - фиксированные цены по классам
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    currency,
    vehicle_class_prices
)
VALUES (
    1,
    3,
    'vehicle_class_pricing_fixed',
    'RUB',
    '{
        "A": 3000,
        "B": 3500,
        "C": 4000,
        "D": 4500,
        "E": 5000,
        "F": 6000,
        "J": 5500,
        "M": 5000,
        "S": 7000
    }'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    currency = EXCLUDED.currency,
    vehicle_class_prices = EXCLUDED.vehicle_class_prices,
    updated_at = NOW();

-- ==========================================
-- КОМПАНИЯ 2: СТО Профи
-- ==========================================

-- Услуга 10: Замена масла - фиксированные цены по классам
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    currency,
    vehicle_class_prices
)
VALUES (
    2,
    10,
    'vehicle_class_pricing_fixed',
    'RUB',
    '{
        "A": 1500,
        "B": 1800,
        "C": 2000,
        "D": 2200,
        "E": 2500,
        "F": 3000,
        "J": 2800,
        "M": 2500,
        "S": 3500
    }'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    currency = EXCLUDED.currency,
    vehicle_class_prices = EXCLUDED.vehicle_class_prices,
    updated_at = NOW();

-- ==========================================
-- КОМПАНИЯ 3: Детейлинг Центр
-- ==========================================

-- Услуга 20: Полировка кузова - множители по классам (премиум)
INSERT INTO pricing_rules (
    company_id,
    service_id,
    pricing_type,
    base_price,
    currency,
    vehicle_class_multipliers
)
VALUES (
    3,
    20,
    'vehicle_class_pricing_multiplier',
    5000.00,
    'RUB',
    '{
        "A": 0.8,
        "B": 1.0,
        "C": 1.2,
        "D": 1.5,
        "E": 1.8,
        "F": 2.2,
        "J": 2.0,
        "M": 1.8,
        "S": 3.0
    }'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- ==========================================
-- Расчёт примерных цен для справки
-- ==========================================

-- Компания 1, Услуга 1 (Комплексная мойка):
-- Класс B (Polo, Rio): 1000 * 1.0 = 1000₽
-- Класс D (Audi A4, Tesla Model 3): 1000 * 1.5 = 1500₽
-- Класс E (Mercedes E-Class, Lexus RX350): 1000 * 1.8 = 1800₽
-- Класс J (Porsche Cayenne): 1000 * 2.2 = 2200₽
-- Класс L (BMW X5): базовая 1000₽ (если L не определён, используется дефолт)

-- Компания 1, Услуга 2 (Экспресс-мойка):
-- Все классы: 800₽ (статическая цена)

-- Компания 1, Услуга 3 (Детейлинг):
-- Класс B (Polo): 3500₽
-- Класс D (Audi A4): 4500₽
-- Класс E (Mercedes E-Class): 5000₽
-- Класс J (Porsche Cayenne): 5500₽

-- Компания 2, Услуга 10 (Замена масла):
-- Класс B (Polo): 1800₽
-- Класс D (Audi A4, Tesla Model 3): 2200₽
-- Класс E (Mercedes E-Class, Lexus RX350): 2500₽
-- Класс J (Porsche Cayenne): 2800₽

-- Компания 3, Услуга 20 (Полировка кузова):
-- Класс B (Polo): 5000 * 1.0 = 5000₽
-- Класс D (Audi A4): 5000 * 1.5 = 7500₽
-- Класс E (Mercedes E-Class, Lexus RX350): 5000 * 1.8 = 9000₽
-- Класс J (Porsche Cayenne): 5000 * 2.0 = 10000₽

-- ==========================================
-- ИТОГО: 5 правил ценообразования
-- ==========================================
-- 2 с множителями (vehicle_class_pricing_multiplier)
-- 1 статическая (static)
-- 2 с фиксированными ценами (vehicle_class_pricing_fixed)
