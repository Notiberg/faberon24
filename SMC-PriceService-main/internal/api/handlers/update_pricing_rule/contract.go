package update_pricing_rule

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

// PricingRuleService интерфейс для работы с правилами ценообразования
type PricingRuleService interface {
	Update(ctx context.Context, id int64, req *models.UpdatePricingRuleRequest) (*models.PricingRuleResponse, error)
}

// Logger интерфейс для логирования
type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
