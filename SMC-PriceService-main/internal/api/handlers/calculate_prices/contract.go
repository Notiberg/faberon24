package calculate_prices

import (
	"context"

	"github.com/m04kA/SMC-PriceService/internal/usecase/calculateprice/models"
)

// CalculatePriceUseCase интерфейс для usecase расчёта цен
type CalculatePriceUseCase interface {
	BatchCalculate(ctx context.Context, tgUserID int64, req *models.BatchCalculateRequest) (*models.BatchCalculateResponse, error)
}

// Logger интерфейс для логирования
type Logger interface {
	Info(format string, v ...interface{})
	Warn(format string, v ...interface{})
	Error(format string, v ...interface{})
}
