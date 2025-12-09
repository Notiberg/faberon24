-- Таблица правил ценообразования
CREATE TABLE IF NOT EXISTS pricing_rules (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    pricing_type VARCHAR(50) NOT NULL,
    base_price DECIMAL(10, 2),
    currency VARCHAR(3) NOT NULL DEFAULT 'RUB',
    vehicle_class_multipliers JSONB,
    vehicle_class_prices JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Уникальность: одно правило на пару компания-услуга
    CONSTRAINT unique_company_service UNIQUE (company_id, service_id)
);

-- Индекс для быстрого поиска по company_id
CREATE INDEX idx_pricing_rules_company_id ON pricing_rules(company_id);

-- Индекс для быстрого поиска по service_id
CREATE INDEX idx_pricing_rules_service_id ON pricing_rules(service_id);

-- Индекс для поиска по комбинации company_id и service_id (покрывающий индекс для основного запроса)
CREATE INDEX idx_pricing_rules_company_service ON pricing_rules(company_id, service_id);

-- Индекс для фильтрации по типу ценообразования
CREATE INDEX idx_pricing_rules_pricing_type ON pricing_rules(pricing_type);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_pricing_rules_updated_at
    BEFORE UPDATE ON pricing_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Комментарии к таблице и колонкам
COMMENT ON TABLE pricing_rules IS 'Правила ценообразования для услуг компаний';
COMMENT ON COLUMN pricing_rules.id IS 'Уникальный идентификатор правила';
COMMENT ON COLUMN pricing_rules.company_id IS 'ID компании';
COMMENT ON COLUMN pricing_rules.service_id IS 'ID услуги';
COMMENT ON COLUMN pricing_rules.pricing_type IS 'Тип ценообразования: static, vehicle_class_pricing_multiplier, vehicle_class_pricing_fixed';
COMMENT ON COLUMN pricing_rules.base_price IS 'Базовая цена (для static и vehicle_class_pricing_multiplier)';
COMMENT ON COLUMN pricing_rules.currency IS 'Валюта (ISO 4217)';
COMMENT ON COLUMN pricing_rules.vehicle_class_multipliers IS 'JSON с множителями для классов автомобилей (A, B, C, D, E, F, J, M, S)';
COMMENT ON COLUMN pricing_rules.vehicle_class_prices IS 'JSON с фиксированными ценами для классов автомобилей';
COMMENT ON COLUMN pricing_rules.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN pricing_rules.updated_at IS 'Дата и время последнего обновления записи';
