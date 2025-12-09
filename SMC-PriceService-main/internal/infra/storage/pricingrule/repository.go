package pricingrule

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"

	"github.com/m04kA/SMC-PriceService/internal/domain"
	"github.com/m04kA/SMC-PriceService/pkg/psqlbuilder"

	"github.com/Masterminds/squirrel"
	"github.com/lib/pq"
)

// Repository репозиторий для работы с правилами ценообразования
type Repository struct {
	db DBExecutor
}

// NewRepository создает новый экземпляр репозитория правил ценообразования
func NewRepository(db DBExecutor) *Repository {
	return &Repository{db: db}
}

// Create создает новое правило ценообразования
func (r *Repository) Create(ctx context.Context, input domain.CreatePricingRuleInput) (*domain.PricingRule, error) {
	// Сериализуем JSON поля (используем пустой JSON {} если nil)
	var multipliers, prices []byte
	var err error

	if input.VehicleClassMultipliers != nil {
		multipliers, err = json.Marshal(input.VehicleClassMultipliers)
		if err != nil {
			return nil, fmt.Errorf("%w: Create - marshal multipliers: %v", ErrExecQuery, err)
		}
	} else {
		multipliers = []byte("{}")
	}

	if input.VehicleClassPrices != nil {
		prices, err = json.Marshal(input.VehicleClassPrices)
		if err != nil {
			return nil, fmt.Errorf("%w: Create - marshal prices: %v", ErrExecQuery, err)
		}
	} else {
		prices = []byte("{}")
	}

	query, args, err := psqlbuilder.Insert("pricing_rules").
		Columns(
			"company_id",
			"service_id",
			"pricing_type",
			"base_price",
			"currency",
			"vehicle_class_multipliers",
			"vehicle_class_prices",
		).
		Values(
			input.CompanyID,
			input.ServiceID,
			input.PricingType,
			input.BasePrice,
			input.Currency,
			multipliers,
			prices,
		).
		Suffix("RETURNING id, created_at, updated_at").
		ToSql()

	if err != nil {
		return nil, fmt.Errorf("%w: Create - build insert query: %v", ErrBuildQuery, err)
	}

	var id int64
	var createdAt, updatedAt sql.NullTime
	err = r.db.QueryRowContext(ctx, query, args...).Scan(&id, &createdAt, &updatedAt)
	if err != nil {
		// Проверка на unique constraint violation
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code == "23505" {
			return nil, ErrDuplicateRule
		}
		return nil, fmt.Errorf("%w: Create - insert pricing rule: %v", ErrExecQuery, err)
	}

	return &domain.PricingRule{
		ID:                      id,
		CompanyID:               input.CompanyID,
		ServiceID:               input.ServiceID,
		PricingType:             input.PricingType,
		BasePrice:               input.BasePrice,
		Currency:                input.Currency,
		VehicleClassMultipliers: input.VehicleClassMultipliers,
		VehicleClassPrices:      input.VehicleClassPrices,
		CreatedAt:               createdAt.Time,
		UpdatedAt:               updatedAt.Time,
	}, nil
}

// GetByID получает правило ценообразования по ID
func (r *Repository) GetByID(ctx context.Context, id int64) (*domain.PricingRule, error) {
	query, args, err := psqlbuilder.Select(
		"id",
		"company_id",
		"service_id",
		"pricing_type",
		"base_price",
		"currency",
		"vehicle_class_multipliers",
		"vehicle_class_prices",
		"created_at",
		"updated_at",
	).
		From("pricing_rules").
		Where(squirrel.Eq{"id": id}).
		ToSql()

	if err != nil {
		return nil, fmt.Errorf("%w: GetByID - build select query: %v", ErrBuildQuery, err)
	}

	var rule domain.PricingRule
	var basePrice sql.NullFloat64
	var multipliers, prices []byte
	var createdAt, updatedAt sql.NullTime

	err = r.db.QueryRowContext(ctx, query, args...).Scan(
		&rule.ID,
		&rule.CompanyID,
		&rule.ServiceID,
		&rule.PricingType,
		&basePrice,
		&rule.Currency,
		&multipliers,
		&prices,
		&createdAt,
		&updatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrPricingRuleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("%w: GetByID - scan pricing rule: %v", ErrScanRow, err)
	}

	// Десериализуем nullable поля
	if basePrice.Valid {
		rule.BasePrice = &basePrice.Float64
	}

	if len(multipliers) > 0 {
		var m map[domain.VehicleClass]float64
		if err := json.Unmarshal(multipliers, &m); err != nil {
			return nil, fmt.Errorf("%w: GetByID - unmarshal multipliers: %v", ErrScanRow, err)
		}
		rule.VehicleClassMultipliers = m
	}

	if len(prices) > 0 {
		var p map[domain.VehicleClass]float64
		if err := json.Unmarshal(prices, &p); err != nil {
			return nil, fmt.Errorf("%w: GetByID - unmarshal prices: %v", ErrScanRow, err)
		}
		rule.VehicleClassPrices = p
	}

	rule.CreatedAt = createdAt.Time
	rule.UpdatedAt = updatedAt.Time

	return &rule, nil
}

// GetByCompanyAndService получает правило по company_id и service_id
func (r *Repository) GetByCompanyAndService(ctx context.Context, companyID, serviceID int64) (*domain.PricingRule, error) {
	query, args, err := psqlbuilder.Select(
		"id",
		"company_id",
		"service_id",
		"pricing_type",
		"base_price",
		"currency",
		"vehicle_class_multipliers",
		"vehicle_class_prices",
		"created_at",
		"updated_at",
	).
		From("pricing_rules").
		Where(squirrel.Eq{
			"company_id": companyID,
			"service_id": serviceID,
		}).
		ToSql()

	if err != nil {
		return nil, fmt.Errorf("%w: GetByCompanyAndService - build select query: %v", ErrBuildQuery, err)
	}

	var rule domain.PricingRule
	var basePrice sql.NullFloat64
	var multipliers, prices []byte
	var createdAt, updatedAt sql.NullTime

	err = r.db.QueryRowContext(ctx, query, args...).Scan(
		&rule.ID,
		&rule.CompanyID,
		&rule.ServiceID,
		&rule.PricingType,
		&basePrice,
		&rule.Currency,
		&multipliers,
		&prices,
		&createdAt,
		&updatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrPricingRuleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("%w: GetByCompanyAndService - scan pricing rule: %v", ErrScanRow, err)
	}

	// Десериализуем nullable поля
	if basePrice.Valid {
		rule.BasePrice = &basePrice.Float64
	}

	if len(multipliers) > 0 {
		var m map[domain.VehicleClass]float64
		if err := json.Unmarshal(multipliers, &m); err != nil {
			return nil, fmt.Errorf("%w: GetByCompanyAndService - unmarshal multipliers: %v", ErrScanRow, err)
		}
		rule.VehicleClassMultipliers = m
	}

	if len(prices) > 0 {
		var p map[domain.VehicleClass]float64
		if err := json.Unmarshal(prices, &p); err != nil {
			return nil, fmt.Errorf("%w: GetByCompanyAndService - unmarshal prices: %v", ErrScanRow, err)
		}
		rule.VehicleClassPrices = p
	}

	rule.CreatedAt = createdAt.Time
	rule.UpdatedAt = updatedAt.Time

	return &rule, nil
}

// List получает список правил ценообразования с фильтрацией
func (r *Repository) List(ctx context.Context, filter domain.PricingRuleFilter) ([]domain.PricingRule, error) {
	// Базовый запрос
	selectBuilder := psqlbuilder.Select(
		"id",
		"company_id",
		"service_id",
		"pricing_type",
		"base_price",
		"currency",
		"vehicle_class_multipliers",
		"vehicle_class_prices",
		"created_at",
		"updated_at",
	).
		From("pricing_rules").
		OrderBy("created_at DESC")

	// Применяем фильтры
	if filter.CompanyID != nil {
		selectBuilder = selectBuilder.Where(squirrel.Eq{"company_id": *filter.CompanyID})
	}

	if filter.ServiceID != nil {
		selectBuilder = selectBuilder.Where(squirrel.Eq{"service_id": *filter.ServiceID})
	}

	query, args, err := selectBuilder.ToSql()
	if err != nil {
		return nil, fmt.Errorf("%w: List - build select query: %v", ErrBuildQuery, err)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("%w: List - execute query: %v", ErrExecQuery, err)
	}
	defer rows.Close()

	rules := make([]domain.PricingRule, 0)
	for rows.Next() {
		var rule domain.PricingRule
		var basePrice sql.NullFloat64
		var multipliers, prices []byte
		var createdAt, updatedAt sql.NullTime

		err := rows.Scan(
			&rule.ID,
			&rule.CompanyID,
			&rule.ServiceID,
			&rule.PricingType,
			&basePrice,
			&rule.Currency,
			&multipliers,
			&prices,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("%w: List - scan pricing rule: %v", ErrScanRow, err)
		}

		// Десериализуем nullable поля
		if basePrice.Valid {
			rule.BasePrice = &basePrice.Float64
		}

		if len(multipliers) > 0 {
			var m map[domain.VehicleClass]float64
			if err := json.Unmarshal(multipliers, &m); err != nil {
				return nil, fmt.Errorf("%w: List - unmarshal multipliers: %v", ErrScanRow, err)
			}
			rule.VehicleClassMultipliers = m
		}

		if len(prices) > 0 {
			var p map[domain.VehicleClass]float64
			if err := json.Unmarshal(prices, &p); err != nil {
				return nil, fmt.Errorf("%w: List - unmarshal prices: %v", ErrScanRow, err)
			}
			rule.VehicleClassPrices = p
		}

		rule.CreatedAt = createdAt.Time
		rule.UpdatedAt = updatedAt.Time

		rules = append(rules, rule)
	}

	return rules, nil
}

// Update обновляет правило ценообразования
func (r *Repository) Update(ctx context.Context, id int64, input domain.UpdatePricingRuleInput) (*domain.PricingRule, error) {
	updateBuilder := psqlbuilder.Update("pricing_rules").Where(squirrel.Eq{"id": id})

	if input.PricingType != nil {
		updateBuilder = updateBuilder.Set("pricing_type", *input.PricingType)
	}

	if input.BasePrice != nil {
		updateBuilder = updateBuilder.Set("base_price", *input.BasePrice)
	}

	if input.Currency != nil {
		updateBuilder = updateBuilder.Set("currency", *input.Currency)
	}

	if input.VehicleClassMultipliers != nil {
		multipliers, err := json.Marshal(input.VehicleClassMultipliers)
		if err != nil {
			return nil, fmt.Errorf("%w: Update - marshal multipliers: %v", ErrExecQuery, err)
		}
		updateBuilder = updateBuilder.Set("vehicle_class_multipliers", multipliers)
	}

	if input.VehicleClassPrices != nil {
		prices, err := json.Marshal(input.VehicleClassPrices)
		if err != nil {
			return nil, fmt.Errorf("%w: Update - marshal prices: %v", ErrExecQuery, err)
		}
		updateBuilder = updateBuilder.Set("vehicle_class_prices", prices)
	}

	query, args, err := updateBuilder.
		Suffix("RETURNING id, company_id, service_id, pricing_type, base_price, currency, vehicle_class_multipliers, vehicle_class_prices, created_at, updated_at").
		ToSql()

	if err != nil {
		return nil, fmt.Errorf("%w: Update - build update query: %v", ErrBuildQuery, err)
	}

	var rule domain.PricingRule
	var basePrice sql.NullFloat64
	var multipliers, prices []byte
	var createdAt, updatedAt sql.NullTime

	err = r.db.QueryRowContext(ctx, query, args...).Scan(
		&rule.ID,
		&rule.CompanyID,
		&rule.ServiceID,
		&rule.PricingType,
		&basePrice,
		&rule.Currency,
		&multipliers,
		&prices,
		&createdAt,
		&updatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, ErrPricingRuleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("%w: Update - scan pricing rule: %v", ErrScanRow, err)
	}

	// Десериализуем nullable поля
	if basePrice.Valid {
		rule.BasePrice = &basePrice.Float64
	}

	if len(multipliers) > 0 {
		var m map[domain.VehicleClass]float64
		if err := json.Unmarshal(multipliers, &m); err != nil {
			return nil, fmt.Errorf("%w: Update - unmarshal multipliers: %v", ErrScanRow, err)
		}
		rule.VehicleClassMultipliers = m
	}

	if len(prices) > 0 {
		var p map[domain.VehicleClass]float64
		if err := json.Unmarshal(prices, &p); err != nil {
			return nil, fmt.Errorf("%w: Update - unmarshal prices: %v", ErrScanRow, err)
		}
		rule.VehicleClassPrices = p
	}

	rule.CreatedAt = createdAt.Time
	rule.UpdatedAt = updatedAt.Time

	return &rule, nil
}

// Delete удаляет правило ценообразования
func (r *Repository) Delete(ctx context.Context, id int64) error {
	query, args, err := psqlbuilder.Delete("pricing_rules").
		Where(squirrel.Eq{"id": id}).
		ToSql()

	if err != nil {
		return fmt.Errorf("%w: Delete - build delete query: %v", ErrBuildQuery, err)
	}

	result, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("%w: Delete - execute delete: %v", ErrExecQuery, err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("%w: Delete - get rows affected: %v", ErrExecQuery, err)
	}

	if rowsAffected == 0 {
		return ErrPricingRuleNotFound
	}

	return nil
}

// GetBatchByCompanyAndServices получает правила для компании и списка услуг (batch запрос)
func (r *Repository) GetBatchByCompanyAndServices(ctx context.Context, companyID int64, serviceIDs []int64) (map[int64]*domain.PricingRule, error) {
	if len(serviceIDs) == 0 {
		return make(map[int64]*domain.PricingRule), nil
	}

	query, args, err := psqlbuilder.Select(
		"id",
		"company_id",
		"service_id",
		"pricing_type",
		"base_price",
		"currency",
		"vehicle_class_multipliers",
		"vehicle_class_prices",
		"created_at",
		"updated_at",
	).
		From("pricing_rules").
		Where(squirrel.Eq{
			"company_id": companyID,
			"service_id": serviceIDs,
		}).
		ToSql()

	if err != nil {
		return nil, fmt.Errorf("%w: GetBatchByCompanyAndServices - build select query: %v", ErrBuildQuery, err)
	}

	rows, err := r.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("%w: GetBatchByCompanyAndServices - execute query: %v", ErrExecQuery, err)
	}
	defer rows.Close()

	result := make(map[int64]*domain.PricingRule)
	for rows.Next() {
		var rule domain.PricingRule
		var basePrice sql.NullFloat64
		var multipliers, prices []byte
		var createdAt, updatedAt sql.NullTime

		err := rows.Scan(
			&rule.ID,
			&rule.CompanyID,
			&rule.ServiceID,
			&rule.PricingType,
			&basePrice,
			&rule.Currency,
			&multipliers,
			&prices,
			&createdAt,
			&updatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("%w: GetBatchByCompanyAndServices - scan pricing rule: %v", ErrScanRow, err)
		}

		// Десериализуем nullable поля
		if basePrice.Valid {
			rule.BasePrice = &basePrice.Float64
		}

		if len(multipliers) > 0 {
			var m map[domain.VehicleClass]float64
			if err := json.Unmarshal(multipliers, &m); err != nil {
				return nil, fmt.Errorf("%w: GetBatchByCompanyAndServices - unmarshal multipliers: %v", ErrScanRow, err)
			}
			rule.VehicleClassMultipliers = m
		}

		if len(prices) > 0 {
			var p map[domain.VehicleClass]float64
			if err := json.Unmarshal(prices, &p); err != nil {
				return nil, fmt.Errorf("%w: GetBatchByCompanyAndServices - unmarshal prices: %v", ErrScanRow, err)
			}
			rule.VehicleClassPrices = p
		}

		rule.CreatedAt = createdAt.Time
		rule.UpdatedAt = updatedAt.Time

		result[rule.ServiceID] = &rule
	}

	return result, nil
}
