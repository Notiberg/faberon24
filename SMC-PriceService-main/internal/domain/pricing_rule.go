package domain

import "time"

// PricingType типы ценообразования
type PricingType string

const (
	PricingTypeStatic                    PricingType = "static"
	PricingTypeVehicleClassMultiplier    PricingType = "vehicle_class_pricing_multiplier"
	PricingTypeVehicleClassFixed         PricingType = "vehicle_class_pricing_fixed"
)

// VehicleClass классы автомобилей по европейской системе
type VehicleClass string

const (
	VehicleClassA VehicleClass = "A" // мини-автомобили
	VehicleClassB VehicleClass = "B" // малые
	VehicleClassC VehicleClass = "C" // средние (гольф-класс)
	VehicleClassD VehicleClass = "D" // большие средние
	VehicleClassE VehicleClass = "E" // бизнес-класс
	VehicleClassF VehicleClass = "F" // люксовые
	VehicleClassJ VehicleClass = "J" // внедорожники
	VehicleClassM VehicleClass = "M" // минивэны
	VehicleClassS VehicleClass = "S" // спорткары
)

// PricingRule доменная модель правила ценообразования
type PricingRule struct {
	ID                      int64                     `json:"id"`
	CompanyID               int64                     `json:"company_id"`
	ServiceID               int64                     `json:"service_id"`
	PricingType             PricingType               `json:"pricing_type"`
	BasePrice               *float64                  `json:"base_price,omitempty"`
	Currency                string                    `json:"currency"`
	VehicleClassMultipliers map[VehicleClass]float64  `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[VehicleClass]float64  `json:"vehicle_class_prices,omitempty"`
	CreatedAt               time.Time                 `json:"created_at"`
	UpdatedAt               time.Time                 `json:"updated_at"`
}

// CreatePricingRuleInput входные данные для создания правила
type CreatePricingRuleInput struct {
	CompanyID               int64                     `json:"company_id"`
	ServiceID               int64                     `json:"service_id"`
	PricingType             PricingType               `json:"pricing_type"`
	BasePrice               *float64                  `json:"base_price,omitempty"`
	Currency                string                    `json:"currency"`
	VehicleClassMultipliers map[VehicleClass]float64  `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[VehicleClass]float64  `json:"vehicle_class_prices,omitempty"`
}

// UpdatePricingRuleInput входные данные для обновления правила
type UpdatePricingRuleInput struct {
	PricingType             *PricingType              `json:"pricing_type,omitempty"`
	BasePrice               *float64                  `json:"base_price,omitempty"`
	Currency                *string                   `json:"currency,omitempty"`
	VehicleClassMultipliers map[VehicleClass]float64  `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[VehicleClass]float64  `json:"vehicle_class_prices,omitempty"`
}

// PricingRuleFilter фильтры для получения правил
type PricingRuleFilter struct {
	CompanyID *int64 `json:"company_id,omitempty"`
	ServiceID *int64 `json:"service_id,omitempty"`
}
