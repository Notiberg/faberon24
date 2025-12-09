package pricingrules

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/domain"
)

// PricingRuleRepository интерфейс репозитория правил ценообразования
type PricingRuleRepository interface {
	Create(ctx context.Context, input domain.CreatePricingRuleInput) (*domain.PricingRule, error)
	GetByID(ctx context.Context, id int64) (*domain.PricingRule, error)
	GetByCompanyAndService(ctx context.Context, companyID, serviceID int64) (*domain.PricingRule, error)
	List(ctx context.Context, filter domain.PricingRuleFilter) ([]domain.PricingRule, error)
	Update(ctx context.Context, id int64, input domain.UpdatePricingRuleInput) (*domain.PricingRule, error)
	Delete(ctx context.Context, id int64) error
	GetBatchByCompanyAndServices(ctx context.Context, companyID int64, serviceIDs []int64) (map[int64]*domain.PricingRule, error)
}
