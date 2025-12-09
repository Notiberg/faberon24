package models

// CalculateResponse ответ с рассчитанной ценой
type CalculateResponse struct {
	CompanyID    int64   `json:"company_id"`
	ServiceID    int64   `json:"service_id"`
	Price        float64 `json:"price"`
	Currency     string  `json:"currency"`
	PricingType  string  `json:"pricing_type"`
	VehicleClass *string `json:"vehicle_class,omitempty"` // nil если не применялся класс авто
}

// BatchCalculateResponse ответ с рассчитанными ценами
type BatchCalculateResponse struct {
	Prices []CalculateResponse `json:"prices"`
}
