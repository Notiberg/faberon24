-- Удаление триггера
DROP TRIGGER IF EXISTS update_pricing_rules_updated_at ON pricing_rules;

-- Удаление функции обновления updated_at
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Удаление индексов
DROP INDEX IF EXISTS idx_pricing_rules_pricing_type;
DROP INDEX IF EXISTS idx_pricing_rules_company_service;
DROP INDEX IF EXISTS idx_pricing_rules_service_id;
DROP INDEX IF EXISTS idx_pricing_rules_company_id;

-- Удаление таблицы
DROP TABLE IF EXISTS pricing_rules;
