package create_pricing_rule

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

// PricingRuleService интерфейс для работы с правилами ценообразования
type PricingRuleService interface {
	Create(ctx context.Context, req *models.CreatePricingRuleRequest) (*models.PricingRuleResponse, error)
}

// Logger интерфейс для логирования
type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
