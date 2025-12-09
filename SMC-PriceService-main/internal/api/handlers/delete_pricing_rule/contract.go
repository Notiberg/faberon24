package delete_pricing_rule

import "context"

// PricingRuleService интерфейс для работы с правилами ценообразования
type PricingRuleService interface {
	Delete(ctx context.Context, id int64) error
}

// Logger интерфейс для логирования
type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
