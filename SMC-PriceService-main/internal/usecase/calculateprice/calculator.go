package calculateprice

import (
	"fmt"

	"github.com/m04kA/SMC-PriceService/internal/domain"
	"github.com/m04kA/SMC-PriceService/internal/usecase/calculateprice/models"
)

// Calculator калькулятор цен
type Calculator struct{}

// NewCalculator создаёт новый калькулятор цен
func NewCalculator() *Calculator {
	return &Calculator{}
}

// CalculatePrice рассчитывает цену на основе правила и информации об автомобиле
// car может быть nil - в этом случае используется базовая цена
// При ошибке возвращается базовая цена вместе с ошибкой (graceful degradation)
func (c *Calculator) CalculatePrice(rule *models.PricingRule, car *models.Car) (*models.CalculateResponse, error) {
	switch rule.PricingType {
	case string(domain.PricingTypeStatic):
		return c.calculateStaticPrice(rule), nil

	case string(domain.PricingTypeVehicleClassMultiplier):
		return c.calculateWithMultiplier(rule, car)

	case string(domain.PricingTypeVehicleClassFixed):
		return c.calculateWithFixedPrice(rule, car)

	default:
		// Возвращаем базовую цену + ошибку
		return c.calculateStaticPrice(rule), fmt.Errorf("%w: %s", ErrInvalidPricingRule, rule.PricingType)
	}
}

// calculateStaticPrice рассчитывает статичную цену (не зависит от класса авто)
func (c *Calculator) calculateStaticPrice(rule *models.PricingRule) *models.CalculateResponse {
	return &models.CalculateResponse{
		CompanyID:    rule.CompanyID,
		ServiceID:    rule.ServiceID,
		Price:        rule.BasePrice,
		Currency:     rule.Currency,
		PricingType:  rule.PricingType,
		VehicleClass: nil, // Класс авто не используется
	}
}

// calculateWithMultiplier рассчитывает цену с множителем для класса авто
func (c *Calculator) calculateWithMultiplier(rule *models.PricingRule, car *models.Car) (*models.CalculateResponse, error) {
	// Если информация об автомобиле недоступна - используем базовую цену
	if car == nil {
		return &models.CalculateResponse{
			CompanyID:    rule.CompanyID,
			ServiceID:    rule.ServiceID,
			Price:        rule.BasePrice,
			Currency:     rule.Currency,
			PricingType:  rule.PricingType,
			VehicleClass: nil,
		}, nil
	}

	vehicleClass := car.VehicleClass
	multiplier, found := rule.VehicleClassMultipliers[vehicleClass]
	if !found {
		// Если множитель не найден - возвращаем базовую цену + ошибку
		return &models.CalculateResponse{
			CompanyID:    rule.CompanyID,
			ServiceID:    rule.ServiceID,
			Price:        rule.BasePrice,
			Currency:     rule.Currency,
			PricingType:  rule.PricingType,
			VehicleClass: &vehicleClass,
		}, fmt.Errorf("%w: %s", ErrMultiplierNotFound, vehicleClass)
	}

	finalPrice := rule.BasePrice * multiplier

	return &models.CalculateResponse{
		CompanyID:    rule.CompanyID,
		ServiceID:    rule.ServiceID,
		Price:        finalPrice,
		Currency:     rule.Currency,
		PricingType:  rule.PricingType,
		VehicleClass: &vehicleClass,
	}, nil
}

// calculateWithFixedPrice рассчитывает фиксированную цену для класса авто
func (c *Calculator) calculateWithFixedPrice(rule *models.PricingRule, car *models.Car) (*models.CalculateResponse, error) {
	// Если информация об автомобиле недоступна - используем базовую цену
	if car == nil {
		return &models.CalculateResponse{
			CompanyID:    rule.CompanyID,
			ServiceID:    rule.ServiceID,
			Price:        rule.BasePrice,
			Currency:     rule.Currency,
			PricingType:  rule.PricingType,
			VehicleClass: nil,
		}, nil
	}

	vehicleClass := car.VehicleClass
	fixedPrice, found := rule.VehicleClassPrices[vehicleClass]
	if !found {
		// Если фиксированная цена не найдена - возвращаем базовую цену + ошибку
		return &models.CalculateResponse{
			CompanyID:    rule.CompanyID,
			ServiceID:    rule.ServiceID,
			Price:        rule.BasePrice,
			Currency:     rule.Currency,
			PricingType:  rule.PricingType,
			VehicleClass: &vehicleClass,
		}, fmt.Errorf("%w: %s", ErrFixedPriceNotFound, vehicleClass)
	}

	return &models.CalculateResponse{
		CompanyID:    rule.CompanyID,
		ServiceID:    rule.ServiceID,
		Price:        fixedPrice,
		Currency:     rule.Currency,
		PricingType:  rule.PricingType,
		VehicleClass: &vehicleClass,
	}, nil
}
