package calculate_prices

import (
	"net/http"

	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/usecase/calculateprice/models"
)

const (
	msgInvalidRequestBody = "invalid request body"
	msgInternalError      = "internal server error"
)

// CalculatePricesRequest модель запроса для batch расчёта цен
type CalculatePricesRequest struct {
	CompanyID  int64   `json:"company_id"`
	UserID     *int64  `json:"user_id,omitempty"` // опционально
	ServiceIDs []int64 `json:"service_ids"`
}

// Handler обработчик для расчёта цен
type Handler struct {
	useCase CalculatePriceUseCase
	logger  Logger
}

// NewHandler создаёт новый handler
func NewHandler(useCase CalculatePriceUseCase, logger Logger) *Handler {
	return &Handler{
		useCase: useCase,
		logger:  logger,
	}
}

// Handle обрабатывает запрос на batch расчёт цен
func (h *Handler) Handle(w http.ResponseWriter, r *http.Request) {
	// 1. Парсим request body
	var req CalculatePricesRequest
	if err := handlers.DecodeJSON(r, &req); err != nil {
		h.logger.Warn("Failed to decode request: %v", err)
		handlers.RespondBadRequest(w, msgInvalidRequestBody)
		return
	}

	// 2. Определяем tg_user_id (0 если не передан - будут базовые цены)
	var tgUserID int64
	if req.UserID != nil {
		tgUserID = *req.UserID
	}

	// 3. Формируем запрос для usecase
	useCaseReq := &models.BatchCalculateRequest{
		CompanyID:  req.CompanyID,
		ServiceIDs: req.ServiceIDs,
	}

	// 4. Вызываем usecase
	resp, err := h.useCase.BatchCalculate(r.Context(), tgUserID, useCaseReq)
	if err != nil {
		h.logger.Error("Failed to calculate prices: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 5. Возвращаем результат
	handlers.RespondJSON(w, http.StatusOK, resp)
}
