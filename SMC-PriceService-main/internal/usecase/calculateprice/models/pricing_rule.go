package models

// PricingRule модель правила ценообразования для калькулятора
type PricingRule struct {
	CompanyID               int64
	ServiceID               int64
	PricingType             string
	BasePrice               float64
	Currency                string
	VehicleClassMultipliers map[string]float64 // ключ - класс авто (A, B, C, ...)
	VehicleClassPrices      map[string]float64 // ключ - класс авто (A, B, C, ...)
}
