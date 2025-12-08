-- ==========================================
-- Update Carwash Services with actual prices
-- ==========================================
-- Обновляет услуги автомойки с реальными ценами

-- Удаляем старые услуги
DELETE FROM services WHERE company_id = 1 AND id >= 100;

-- Экспресс мойка - 250₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    100,
    1,
    'Экспресс мойка',
    'Быстрая мойка кузова без салона. Идеально для регулярного поддержания чистоты.',
    15
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Бесконтактная мойка кузова - от 500₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    101,
    1,
    'Бесконтактная мойка кузова',
    'Мойка кузова и порогов без контакта с поверхностью. Безопасна для лакокрасочного покрытия.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Комплексная мойка - от 900₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    102,
    1,
    'Комплексная мойка',
    'Полная мойка кузова, дисков, ковриков и салона без багажного отделения.',
    60
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Нано-мойка кузова - от 1200₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    103,
    1,
    'Нано-мойка кузова',
    'Специальная мойка с использованием нано-технологий Koch. Защищает и придает блеск.',
    45
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Нано-мойка комплексная - от 1600₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    104,
    1,
    'Нано-мойка комплексная',
    'Полная комплексная мойка с нано-защитой Koch. Включает кузов, салон и все поверхности.',
    75
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Обработка кузова горячим воском - 450₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    105,
    1,
    'Обработка кузова горячим воском',
    'Нанесение горячего воска для защиты и блеска кузова. Долговечная защита от внешних факторов.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Полировка карнауба премиум-воск - от 1700₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    106,
    1,
    'Полировка карнауба премиум-воск',
    'Профессиональная полировка с применением премиум-воска карнауба. Восстанавливает блеск и защищает.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Нано-полимер - от 500₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    107,
    1,
    'Нано-полимер',
    'Нанесение нано-полимерного покрытия для долгосрочной защиты кузова.',
    45
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Обработка кожаного сидения - от 200₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    108,
    1,
    'Обработка кожаного сидения',
    'Профессиональная чистка и обработка кожаных сидений специальными средствами.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Чистка хромовой поверхности - от 700₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    109,
    1,
    'Чистка хромовой поверхности',
    'Профессиональная чистка и полировка хромовых деталей автомобиля.',
    45
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Обработка внешней поверхности стекол - от 500₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    110,
    1,
    'Обработка внешней поверхности стекол',
    'Нанесение защитного покрытия на стекла для улучшения видимости и защиты.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Уборка салона пылесосом - от 250₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    111,
    1,
    'Уборка салона пылесосом',
    'Тщательная уборка салона автомобиля профессиональным пылесосом.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Уборка багажного отд. пылесосом - от 200₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    112,
    1,
    'Уборка багажного отд. пылесосом',
    'Профессиональная уборка багажного отделения с использованием мощного пылесоса.',
    20
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Очистка пластиковых и кожаных поверхностей - от 200₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    113,
    1,
    'Очистка пластиковых и кожаных поверхностей',
    'Профессиональная чистка всех пластиковых и кожаных поверхностей салона.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Мойка двигателя - от 600₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    114,
    1,
    'Мойка двигателя',
    'Профессиональная мойка двигателя с использованием специальных средств и оборудования.',
    60
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Удаление битумных пятен - от 200₽
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    115,
    1,
    'Удаление битумных пятен',
    'Удаление битумных и смолистых пятен с кузова автомобиля специальными средствами.',
    20
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Обновляем последовательность ID
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
