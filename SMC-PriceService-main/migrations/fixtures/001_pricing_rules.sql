-- ==========================================
-- PriceService - Pricing Rules Fixtures
-- ==========================================
-- Создает правила ценообразования для услуг автомойки

-- Экспресс мойка - 250₽ (статичная цена)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency)
VALUES (1, 100, 'static', 250.00, 'RUB')
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- Бесконтактная мойка кузова - от 500₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 101, 'vehicle_class_pricing_multiplier', 500.00, 'RUB',
    '{"A": 0.8, "B": 1.0, "C": 1.2, "D": 1.5, "E": 2.0, "F": 2.5, "J": 1.8, "M": 1.6, "S": 2.2}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Комплексная мойка - от 900₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 102, 'vehicle_class_pricing_multiplier', 900.00, 'RUB',
    '{"A": 0.7, "B": 1.0, "C": 1.1, "D": 1.3, "E": 1.8, "F": 2.2, "J": 1.5, "M": 1.4, "S": 2.0}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Нано-мойка кузова - от 1200₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 103, 'vehicle_class_pricing_multiplier', 1200.00, 'RUB',
    '{"A": 0.8, "B": 1.0, "C": 1.1, "D": 1.4, "E": 1.9, "F": 2.3, "J": 1.6, "M": 1.5, "S": 2.1}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Нано-мойка комплексная - от 1600₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 104, 'vehicle_class_pricing_multiplier', 1600.00, 'RUB',
    '{"A": 0.75, "B": 1.0, "C": 1.1, "D": 1.3, "E": 1.7, "F": 2.1, "J": 1.5, "M": 1.4, "S": 1.9}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Обработка кузова горячим воском - 450₽ (статичная цена)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency)
VALUES (1, 105, 'static', 450.00, 'RUB')
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- Полировка карнауба премиум-воск - от 1700₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 106, 'vehicle_class_pricing_multiplier', 1700.00, 'RUB',
    '{"A": 0.7, "B": 1.0, "C": 1.15, "D": 1.4, "E": 1.9, "F": 2.4, "J": 1.7, "M": 1.6, "S": 2.2}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Нано-полимер - от 500₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 107, 'vehicle_class_pricing_multiplier', 500.00, 'RUB',
    '{"A": 0.8, "B": 1.0, "C": 1.2, "D": 1.5, "E": 2.0, "F": 2.5, "J": 1.8, "M": 1.6, "S": 2.2}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Обработка кожаного сидения - от 200₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 108, 'vehicle_class_pricing_multiplier', 200.00, 'RUB',
    '{"A": 1.0, "B": 1.0, "C": 1.1, "D": 1.3, "E": 1.6, "F": 2.0, "J": 1.2, "M": 1.1, "S": 1.5}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Чистка хромовой поверхности - от 700₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 109, 'vehicle_class_pricing_multiplier', 700.00, 'RUB',
    '{"A": 0.9, "B": 1.0, "C": 1.1, "D": 1.2, "E": 1.5, "F": 1.8, "J": 1.3, "M": 1.2, "S": 1.6}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Уборка салона пылесосом - от 250₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 111, 'vehicle_class_pricing_multiplier', 250.00, 'RUB',
    '{"A": 0.8, "B": 1.0, "C": 1.1, "D": 1.3, "E": 1.5, "F": 1.8, "J": 1.2, "M": 1.1, "S": 1.4}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();

-- Уборка багажного отд. пылесосом - от 200₽ (статичная цена)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency)
VALUES (1, 112, 'static', 200.00, 'RUB')
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    updated_at = NOW();

-- Удаление битумных пятен - от 200₽ (множители по классам)
INSERT INTO pricing_rules (company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers)
VALUES (
    1, 115, 'vehicle_class_pricing_multiplier', 200.00, 'RUB',
    '{"A": 1.0, "B": 1.0, "C": 1.1, "D": 1.2, "E": 1.4, "F": 1.7, "J": 1.2, "M": 1.1, "S": 1.5}'::jsonb
)
ON CONFLICT (company_id, service_id) DO UPDATE SET
    pricing_type = EXCLUDED.pricing_type,
    base_price = EXCLUDED.base_price,
    vehicle_class_multipliers = EXCLUDED.vehicle_class_multipliers,
    updated_at = NOW();
