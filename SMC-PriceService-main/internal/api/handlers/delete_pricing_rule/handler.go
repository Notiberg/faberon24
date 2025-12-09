package delete_pricing_rule

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules"
)

const (
	msgInvalidID     = "invalid pricing rule ID"
	msgNotFound      = "pricing rule not found"
	msgInternalError = "internal server error"
)

// Handler обработчик для удаления правила ценообразования
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

// Handle обрабатывает запрос на удаление правила ценообразования
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

	// 2. Вызываем сервис
	err = h.service.Delete(r.Context(), id)
	if err != nil {
		// Обрабатываем ошибку "не найдено"
		if errors.Is(err, pricingrules.ErrPricingRuleNotFound) {
			h.logger.Info("Pricing rule not found: id=%d", id)
			handlers.RespondNotFound(w, msgNotFound)
			return
		}

		h.logger.Error("Failed to delete pricing rule: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 3. Возвращаем 204 No Content
	w.WriteHeader(http.StatusNoContent)
}
