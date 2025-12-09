-- ==========================================
-- Complete Pricing Rules with Fixed Prices
-- ==========================================
-- Обновляет правила ценообразования с фиксированными ценами для каждого класса

-- Экспресс мойка - 250₽ (статичная цена для всех классов)
UPDATE pricing_rules SET
    pricing_type = 'static',
    base_price = 250.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = NULL,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 100;

-- Бесконтактная мойка кузова - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 500.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 400.00,
        "B": 500.00,
        "C": 600.00,
        "D": 750.00,
        "E": 1000.00,
        "F": 1250.00,
        "J": 900.00,
        "M": 800.00,
        "S": 1100.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 101;

-- Комплексная мойка - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 900.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 630.00,
        "B": 900.00,
        "C": 990.00,
        "D": 1170.00,
        "E": 1620.00,
        "F": 1980.00,
        "J": 1350.00,
        "M": 1260.00,
        "S": 1800.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 102;

-- Нано-мойка кузова - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 1200.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 960.00,
        "B": 1200.00,
        "C": 1320.00,
        "D": 1680.00,
        "E": 2280.00,
        "F": 2760.00,
        "J": 1920.00,
        "M": 1800.00,
        "S": 2520.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 103;

-- Нано-мойка комплексная - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 1600.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 1200.00,
        "B": 1600.00,
        "C": 1760.00,
        "D": 2080.00,
        "E": 2720.00,
        "F": 3360.00,
        "J": 2400.00,
        "M": 2240.00,
        "S": 3040.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 104;

-- Обработка кузова горячим воском - 450₽ (статичная цена для всех классов)
UPDATE pricing_rules SET
    pricing_type = 'static',
    base_price = 450.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = NULL,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 105;

-- Полировка карнауба премиум-воск - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 1700.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 1190.00,
        "B": 1700.00,
        "C": 1955.00,
        "D": 2380.00,
        "E": 3230.00,
        "F": 4080.00,
        "J": 2890.00,
        "M": 2720.00,
        "S": 3740.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 106;

-- Нано-полимер - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 500.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 400.00,
        "B": 500.00,
        "C": 600.00,
        "D": 750.00,
        "E": 1000.00,
        "F": 1250.00,
        "J": 900.00,
        "M": 800.00,
        "S": 1100.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 107;

-- Обработка кожаного сидения - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 200.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 200.00,
        "B": 200.00,
        "C": 220.00,
        "D": 260.00,
        "E": 320.00,
        "F": 400.00,
        "J": 240.00,
        "M": 220.00,
        "S": 300.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 108;

-- Чистка хромовой поверхности - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 700.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 630.00,
        "B": 700.00,
        "C": 770.00,
        "D": 840.00,
        "E": 1050.00,
        "F": 1260.00,
        "J": 910.00,
        "M": 840.00,
        "S": 1120.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 109;

-- Уборка салона пылесосом - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 250.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 200.00,
        "B": 250.00,
        "C": 275.00,
        "D": 325.00,
        "E": 375.00,
        "F": 450.00,
        "J": 300.00,
        "M": 275.00,
        "S": 350.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 111;

-- Уборка багажного отд. пылесосом - 200₽ (статичная цена для всех классов)
UPDATE pricing_rules SET
    pricing_type = 'static',
    base_price = 200.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = NULL,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 112;

-- Удаление битумных пятен - фиксированные цены по классам
UPDATE pricing_rules SET
    pricing_type = 'vehicle_class_pricing_fixed',
    base_price = 200.00,
    vehicle_class_multipliers = NULL,
    vehicle_class_prices = '{
        "A": 200.00,
        "B": 200.00,
        "C": 220.00,
        "D": 240.00,
        "E": 280.00,
        "F": 340.00,
        "J": 240.00,
        "M": 220.00,
        "S": 300.00
    }'::jsonb,
    updated_at = NOW()
WHERE company_id = 1 AND service_id = 115;
