package pricingrules

import (
	"context"
	"errors"
	"fmt"

	pricingRuleRepo "github.com/m04kA/SMC-PriceService/internal/infra/storage/pricingrule"
	"github.com/m04kA/SMC-PriceService/internal/domain"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

type Service struct {
	pricingRuleRepo PricingRuleRepository
}

func NewService(pricingRuleRepo PricingRuleRepository) *Service {
	return &Service{
		pricingRuleRepo: pricingRuleRepo,
	}
}

// Create создает новое правило ценообразования
func (s *Service) Create(ctx context.Context, req *models.CreatePricingRuleRequest) (*models.PricingRuleResponse, error) {
	// Валидация входных данных
	if err := s.validateCreateRequest(req); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidInput, err)
	}

	input := req.ToDomainCreateInput()
	rule, err := s.pricingRuleRepo.Create(ctx, input)
	if err != nil {
		// Проверяем на дубликат
		if errors.Is(err, pricingRuleRepo.ErrDuplicateRule) {
			return nil, ErrDuplicateRule
		}
		return nil, fmt.Errorf("%w: Create - repository error: %v", ErrInternal, err)
	}

	return models.FromDomainPricingRule(rule), nil
}

// GetByID получает правило ценообразования по ID
func (s *Service) GetByID(ctx context.Context, id int64) (*models.PricingRuleResponse, error) {
	rule, err := s.pricingRuleRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, pricingRuleRepo.ErrPricingRuleNotFound) {
			return nil, ErrPricingRuleNotFound
		}
		return nil, fmt.Errorf("%w: GetByID - repository error: %v", ErrInternal, err)
	}

	return models.FromDomainPricingRule(rule), nil
}

// List получает список правил ценообразования с фильтрацией
func (s *Service) List(ctx context.Context, req *models.PricingRuleFilterRequest) (*models.PricingRuleListResponse, error) {
	filter := req.ToDomainFilter()
	rules, err := s.pricingRuleRepo.List(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("%w: List - repository error: %v", ErrInternal, err)
	}

	return models.FromDomainPricingRuleList(rules), nil
}

// Update обновляет правило ценообразования
func (s *Service) Update(ctx context.Context, id int64, req *models.UpdatePricingRuleRequest) (*models.PricingRuleResponse, error) {
	// Получаем текущее правило для валидации
	currentRule, err := s.pricingRuleRepo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, pricingRuleRepo.ErrPricingRuleNotFound) {
			return nil, ErrPricingRuleNotFound
		}
		return nil, fmt.Errorf("%w: Update - get current rule: %v", ErrInternal, err)
	}

	// Валидация обновлений
	if err := s.validateUpdateRequest(currentRule, req); err != nil {
		return nil, fmt.Errorf("%w: %v", ErrInvalidInput, err)
	}

	input := req.ToDomainUpdateInput()
	rule, err := s.pricingRuleRepo.Update(ctx, id, input)
	if err != nil {
		if errors.Is(err, pricingRuleRepo.ErrPricingRuleNotFound) {
			return nil, ErrPricingRuleNotFound
		}
		return nil, fmt.Errorf("%w: Update - repository error: %v", ErrInternal, err)
	}

	return models.FromDomainPricingRule(rule), nil
}

// Delete удаляет правило ценообразования
func (s *Service) Delete(ctx context.Context, id int64) error {
	if err := s.pricingRuleRepo.Delete(ctx, id); err != nil {
		if errors.Is(err, pricingRuleRepo.ErrPricingRuleNotFound) {
			return ErrPricingRuleNotFound
		}
		return fmt.Errorf("%w: Delete - repository error: %v", ErrInternal, err)
	}

	return nil
}

// validateCreateRequest валидирует запрос на создание правила
func (s *Service) validateCreateRequest(req *models.CreatePricingRuleRequest) error {
	pricingType := domain.PricingType(req.PricingType)

	// base_price обязателен для всех типов ценообразования
	if req.BasePrice == nil {
		return fmt.Errorf("base_price is required for all pricing types")
	}

	switch pricingType {
	case domain.PricingTypeStatic:
		// Для static только base_price
		// vehicle_class_multipliers и vehicle_class_prices не должны быть заполнены
		if req.VehicleClassMultipliers != nil {
			return fmt.Errorf("vehicle_class_multipliers should not be set for pricing_type 'static'")
		}
		if req.VehicleClassPrices != nil {
			return fmt.Errorf("vehicle_class_prices should not be set for pricing_type 'static'")
		}

	case domain.PricingTypeVehicleClassMultiplier:
		// Для vehicle_class_pricing_multiplier требуется vehicle_class_multipliers
		if req.VehicleClassMultipliers == nil || len(req.VehicleClassMultipliers) == 0 {
			return fmt.Errorf("vehicle_class_multipliers is required for pricing_type 'vehicle_class_pricing_multiplier'")
		}
		// vehicle_class_prices не должен быть заполнен
		if req.VehicleClassPrices != nil {
			return fmt.Errorf("vehicle_class_prices should not be set for pricing_type 'vehicle_class_pricing_multiplier'")
		}

	case domain.PricingTypeVehicleClassFixed:
		// Для vehicle_class_pricing_fixed требуется vehicle_class_prices
		if req.VehicleClassPrices == nil || len(req.VehicleClassPrices) == 0 {
			return fmt.Errorf("vehicle_class_prices is required for pricing_type 'vehicle_class_pricing_fixed'")
		}
		// vehicle_class_multipliers не должен быть заполнен
		if req.VehicleClassMultipliers != nil {
			return fmt.Errorf("vehicle_class_multipliers should not be set for pricing_type 'vehicle_class_pricing_fixed'")
		}

	default:
		return fmt.Errorf("invalid pricing_type: %s (allowed: static, vehicle_class_pricing_multiplier, vehicle_class_pricing_fixed)", req.PricingType)
	}

	return nil
}

// validateUpdateRequest валидирует запрос на обновление правила
func (s *Service) validateUpdateRequest(currentRule *domain.PricingRule, req *models.UpdatePricingRuleRequest) error {
	// Определяем итоговый pricing_type после обновления
	pricingType := currentRule.PricingType
	if req.PricingType != nil {
		pricingType = domain.PricingType(*req.PricingType)
	}

	// Собираем итоговое состояние после применения обновлений
	basePrice := currentRule.BasePrice
	if req.BasePrice != nil {
		basePrice = req.BasePrice
	}

	var multipliers map[domain.VehicleClass]float64
	if req.VehicleClassMultipliers != nil {
		multipliers = make(map[domain.VehicleClass]float64)
		for k, v := range req.VehicleClassMultipliers {
			multipliers[domain.VehicleClass(k)] = v
		}
	} else {
		multipliers = currentRule.VehicleClassMultipliers
	}

	var prices map[domain.VehicleClass]float64
	if req.VehicleClassPrices != nil {
		prices = make(map[domain.VehicleClass]float64)
		for k, v := range req.VehicleClassPrices {
			prices[domain.VehicleClass(k)] = v
		}
	} else {
		prices = currentRule.VehicleClassPrices
	}

	// Валидируем итоговое состояние
	// base_price обязателен для всех типов
	if basePrice == nil {
		return fmt.Errorf("base_price is required for all pricing types")
	}

	switch pricingType {
	case domain.PricingTypeStatic:
		if multipliers != nil && len(multipliers) > 0 {
			return fmt.Errorf("vehicle_class_multipliers should not be set for pricing_type 'static'")
		}
		if prices != nil && len(prices) > 0 {
			return fmt.Errorf("vehicle_class_prices should not be set for pricing_type 'static'")
		}

	case domain.PricingTypeVehicleClassMultiplier:
		if multipliers == nil || len(multipliers) == 0 {
			return fmt.Errorf("vehicle_class_multipliers is required for pricing_type 'vehicle_class_pricing_multiplier'")
		}
		if prices != nil && len(prices) > 0 {
			return fmt.Errorf("vehicle_class_prices should not be set for pricing_type 'vehicle_class_pricing_multiplier'")
		}

	case domain.PricingTypeVehicleClassFixed:
		if prices == nil || len(prices) == 0 {
			return fmt.Errorf("vehicle_class_prices is required for pricing_type 'vehicle_class_pricing_fixed'")
		}
		if multipliers != nil && len(multipliers) > 0 {
			return fmt.Errorf("vehicle_class_multipliers should not be set for pricing_type 'vehicle_class_pricing_fixed'")
		}

	default:
		return fmt.Errorf("invalid pricing_type: %s", pricingType)
	}

	return nil
}
