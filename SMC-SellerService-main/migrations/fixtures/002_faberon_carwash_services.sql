-- ==========================================
-- Faberon Carwash Services
-- ==========================================
-- Добавляет услуги автомойки Faberon в компанию 1

-- Стандартная мойка
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    100,
    1,
    'Стандартная мойка',
    'Мойка кузова и колес с использованием профессиональных моющих средств ведущих мировых брендов. Высокотехнологичное оборудование обеспечивает качественный результат.',
    45
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Комплексная мойка
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    101,
    1,
    'Комплексная мойка',
    'Полная мойка кузова, дисков, ковриков и салона пылесосом. Включает сушку и протирку насухо.',
    60
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Экспресс-мойка
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    102,
    1,
    'Экспресс-мойка',
    'Быстрая мойка кузова без салона. Идеально для регулярного поддержания чистоты.',
    30
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Полировка кузова
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    103,
    1,
    'Полировка кузова',
    'Профессиональная многоэтапная полировка кузова с защитным покрытием. Удаление царапин, восстановление блеска.',
    180
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Химчистка салона
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    104,
    1,
    'Химчистка салона',
    'Профессиональная химчистка салона автомобиля включает глубокую очистку сидений, обивки, ковровых покрытий и пластиковых поверхностей.',
    90
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Защитные покрытия
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    105,
    1,
    'Защитные покрытия',
    'Нанесение защитных покрытий на кузов автомобиля обеспечивает долгосрочную защиту от внешних воздействий, грязи, солнца и осадков.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Удаление вмятин без покраски
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    106,
    1,
    'Удаление вмятин без покраски',
    'Профессиональное удаление вмятин без покраски с использованием специального оборудования и инструментов. Восстанавливает первоначальный вид кузова.',
    150
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Оклейка/Тонировка
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    107,
    1,
    'Оклейка/Тонировка',
    'Профессиональная оклейка защитной пленкой и тонировка стекол автомобиля. Защищает от ультрафиолета, повышает приватность и улучшает внешний вид.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Дооснащение
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    108,
    1,
    'Дооснащение',
    'Профессиональная установка дополнительного оборудования и аксессуаров на автомобиль. Включает монтаж парктроников, видеорегистраторов, сигнализации.',
    180
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Техническое обслуживание
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    109,
    1,
    'Техническое обслуживание',
    'Полное техническое обслуживание автомобиля включает диагностику, замену расходников и проверку всех систем.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Диагностика и ремонт ходовой части
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    110,
    1,
    'Диагностика и ремонт ходовой части',
    'Профессиональная диагностика и ремонт ходовой части автомобиля. Включает проверку подвески, тормозов и рулевого управления.',
    150
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Диагностика и ремонт двигателя
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    111,
    1,
    'Диагностика и ремонт двигателя',
    'Комплексная диагностика и ремонт двигателя автомобиля. Выполняется квалифицированными специалистами с использованием современного оборудования.',
    180
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт системы охлаждения
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    112,
    1,
    'Ремонт системы охлаждения',
    'Ремонт и обслуживание системы охлаждения двигателя. Включает замену охлаждающей жидкости и проверку радиатора.',
    90
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт тормозной системы
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    113,
    1,
    'Ремонт тормозной системы',
    'Профессиональный ремонт и обслуживание тормозной системы автомобиля. Замена тормозных колодок, дисков и жидкости.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт и обслуживание кондиционеров
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    114,
    1,
    'Ремонт и обслуживание кондиционеров',
    'Полное обслуживание и ремонт кондиционера автомобиля. Включает заправку хладагентом и чистку системы.',
    90
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт электрики
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    115,
    1,
    'Ремонт электрики',
    'Диагностика и ремонт электрических систем автомобиля. Включает проверку аккумулятора, генератора и электропроводки.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт рулевого управления
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    116,
    1,
    'Ремонт рулевого управления',
    'Профессиональный ремонт и регулировка рулевого управления. Включает проверку и замену рулевых наконечников.',
    120
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт топливной системы
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    117,
    1,
    'Ремонт топливной системы',
    'Диагностика и ремонт топливной системы автомобиля. Включает чистку форсунок и замену топливного фильтра.',
    90
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Малярные работы
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    118,
    1,
    'Малярные работы',
    'Профессиональные малярные работы включают подготовку поверхности, грунтовку и окраску автомобиля.',
    240
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Шиномонтаж
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    119,
    1,
    'Шиномонтаж',
    'Профессиональный шиномонтаж с использованием современного оборудования Hofmann и Sivik. Включает балансировку колес.',
    60
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Ремонт шины с установкой грибка
INSERT INTO services (id, company_id, name, description, average_duration)
VALUES (
    120,
    1,
    'Ремонт шины с установкой грибка',
    'Профессиональный ремонт шины с установкой грибка. Восстанавливает герметичность шины при боковых проколах.',
    45
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    average_duration = EXCLUDED.average_duration,
    updated_at = NOW();

-- Обновляем последовательность ID
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
