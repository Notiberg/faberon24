package models

// CalculateRequest запрос на расчёт цены для одной услуги
type CalculateRequest struct {
	CompanyID int64 `json:"company_id"`
	ServiceID int64 `json:"service_id"`
}

// BatchCalculateRequest запрос на расчёт цен для нескольких услуг одной компании
type BatchCalculateRequest struct {
	CompanyID  int64   `json:"company_id"`
	ServiceIDs []int64 `json:"service_ids"`
}
