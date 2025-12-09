package models

import (
	"time"

	"github.com/m04kA/SMC-PriceService/internal/domain"
)

// CreatePricingRuleRequest запрос на создание правила ценообразования
type CreatePricingRuleRequest struct {
	CompanyID               int64                            `json:"company_id"`
	ServiceID               int64                            `json:"service_id"`
	PricingType             string                           `json:"pricing_type"`
	BasePrice               *float64                         `json:"base_price,omitempty"`
	Currency                string                           `json:"currency"`
	VehicleClassMultipliers map[string]float64               `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[string]float64               `json:"vehicle_class_prices,omitempty"`
}

// UpdatePricingRuleRequest запрос на обновление правила ценообразования
type UpdatePricingRuleRequest struct {
	PricingType             *string                          `json:"pricing_type,omitempty"`
	BasePrice               *float64                         `json:"base_price,omitempty"`
	Currency                *string                          `json:"currency,omitempty"`
	VehicleClassMultipliers map[string]float64               `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[string]float64               `json:"vehicle_class_prices,omitempty"`
}

// PricingRuleResponse ответ с правилом ценообразования
type PricingRuleResponse struct {
	ID                      int64              `json:"id"`
	CompanyID               int64              `json:"company_id"`
	ServiceID               int64              `json:"service_id"`
	PricingType             string             `json:"pricing_type"`
	BasePrice               *float64           `json:"base_price,omitempty"`
	Currency                string             `json:"currency"`
	VehicleClassMultipliers map[string]float64 `json:"vehicle_class_multipliers,omitempty"`
	VehicleClassPrices      map[string]float64 `json:"vehicle_class_prices,omitempty"`
	CreatedAt               time.Time          `json:"created_at"`
	UpdatedAt               time.Time          `json:"updated_at"`
}

// PricingRuleFilterRequest запрос на фильтрацию правил
type PricingRuleFilterRequest struct {
	CompanyID *int64 `json:"company_id,omitempty"`
	ServiceID *int64 `json:"service_id,omitempty"`
}

// PricingRuleListResponse ответ со списком правил
type PricingRuleListResponse struct {
	Rules []PricingRuleResponse `json:"rules"`
}

// ToDomainCreateInput преобразует request в domain input
func (r *CreatePricingRuleRequest) ToDomainCreateInput() domain.CreatePricingRuleInput {
	input := domain.CreatePricingRuleInput{
		CompanyID:   r.CompanyID,
		ServiceID:   r.ServiceID,
		PricingType: domain.PricingType(r.PricingType),
		BasePrice:   r.BasePrice,
		Currency:    r.Currency,
	}

	if r.VehicleClassMultipliers != nil {
		input.VehicleClassMultipliers = make(map[domain.VehicleClass]float64)
		for k, v := range r.VehicleClassMultipliers {
			input.VehicleClassMultipliers[domain.VehicleClass(k)] = v
		}
	}

	if r.VehicleClassPrices != nil {
		input.VehicleClassPrices = make(map[domain.VehicleClass]float64)
		for k, v := range r.VehicleClassPrices {
			input.VehicleClassPrices[domain.VehicleClass(k)] = v
		}
	}

	return input
}

// ToDomainUpdateInput преобразует request в domain input
func (r *UpdatePricingRuleRequest) ToDomainUpdateInput() domain.UpdatePricingRuleInput {
	input := domain.UpdatePricingRuleInput{
		BasePrice: r.BasePrice,
		Currency:  r.Currency,
	}

	if r.PricingType != nil {
		pt := domain.PricingType(*r.PricingType)
		input.PricingType = &pt
	}

	if r.VehicleClassMultipliers != nil {
		input.VehicleClassMultipliers = make(map[domain.VehicleClass]float64)
		for k, v := range r.VehicleClassMultipliers {
			input.VehicleClassMultipliers[domain.VehicleClass(k)] = v
		}
	}

	if r.VehicleClassPrices != nil {
		input.VehicleClassPrices = make(map[domain.VehicleClass]float64)
		for k, v := range r.VehicleClassPrices {
			input.VehicleClassPrices[domain.VehicleClass(k)] = v
		}
	}

	return input
}

// ToDomainFilter преобразует request в domain filter
func (r *PricingRuleFilterRequest) ToDomainFilter() domain.PricingRuleFilter {
	return domain.PricingRuleFilter{
		CompanyID: r.CompanyID,
		ServiceID: r.ServiceID,
	}
}

// FromDomainPricingRule преобразует domain model в response
func FromDomainPricingRule(rule *domain.PricingRule) *PricingRuleResponse {
	resp := &PricingRuleResponse{
		ID:          rule.ID,
		CompanyID:   rule.CompanyID,
		ServiceID:   rule.ServiceID,
		PricingType: string(rule.PricingType),
		BasePrice:   rule.BasePrice,
		Currency:    rule.Currency,
		CreatedAt:   rule.CreatedAt,
		UpdatedAt:   rule.UpdatedAt,
	}

	if rule.VehicleClassMultipliers != nil {
		resp.VehicleClassMultipliers = make(map[string]float64)
		for k, v := range rule.VehicleClassMultipliers {
			resp.VehicleClassMultipliers[string(k)] = v
		}
	}

	if rule.VehicleClassPrices != nil {
		resp.VehicleClassPrices = make(map[string]float64)
		for k, v := range rule.VehicleClassPrices {
			resp.VehicleClassPrices[string(k)] = v
		}
	}

	return resp
}

// FromDomainPricingRuleList преобразует список domain models в response
func FromDomainPricingRuleList(rules []domain.PricingRule) *PricingRuleListResponse {
	resp := &PricingRuleListResponse{
		Rules: make([]PricingRuleResponse, 0, len(rules)),
	}

	for i := range rules {
		resp.Rules = append(resp.Rules, *FromDomainPricingRule(&rules[i]))
	}

	return resp
}
