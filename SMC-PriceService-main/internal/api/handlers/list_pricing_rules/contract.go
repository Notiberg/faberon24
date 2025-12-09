package list_pricing_rules

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

type PricingRuleService interface {
	List(ctx context.Context, req *models.PricingRuleFilterRequest) (*models.PricingRuleListResponse, error)
}

type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
