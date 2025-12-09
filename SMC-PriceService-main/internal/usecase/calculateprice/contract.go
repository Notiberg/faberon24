package calculateprice

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/domain"
	"github.com/m04kA/SMC-PriceService/internal/integrations/userservice"
)

// PricingRuleRepository интерфейс для работы с правилами ценообразования
type PricingRuleRepository interface {
	GetByCompanyAndService(ctx context.Context, companyID, serviceID int64) (*domain.PricingRule, error)
	GetBatchByCompanyAndServices(ctx context.Context, companyID int64, serviceIDs []int64) (map[int64]*domain.PricingRule, error)
}

// UserServiceClient интерфейс для работы с UserService
type UserServiceClient interface {
	GetSelectedCarWithGracefulDegradation(ctx context.Context, tgUserID int64) (*userservice.Car, error)
}

// Logger интерфейс для логирования
type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
