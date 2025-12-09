package get_pricing_rule

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules"
)

const (
	msgInvalidID       = "invalid pricing rule ID"
	msgNotFound        = "pricing rule not found"
	msgInternalError   = "internal server error"
)

// Handler обработчик для получения правила ценообразования
type Handler struct {
	service PricingRuleService
	logger  Logger
}

// NewHandler создаёт новый handler
func NewHandler(service PricingRuleService, logger Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// Handle обрабатывает запрос на получение правила ценообразования
func (h *Handler) Handle(w http.ResponseWriter, r *http.Request) {
	// 1. Извлекаем ID из path параметров
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		h.logger.Warn("Invalid pricing rule ID: %s", idStr)
		handlers.RespondBadRequest(w, msgInvalidID)
		return
	}

	// 2. Получаем правило через сервис
	pricingRule, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, pricingrules.ErrPricingRuleNotFound) {
			h.logger.Info("Pricing rule not found: id=%d", id)
			handlers.RespondNotFound(w, msgNotFound)
			return
		}

		h.logger.Error("Failed to get pricing rule: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 3. Возвращаем результат
	handlers.RespondJSON(w, http.StatusOK, pricingRule)
}
