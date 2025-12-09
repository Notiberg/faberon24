package update_pricing_rule

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

const (
	msgInvalidRequestBody = "invalid request body"
	msgInvalidID          = "invalid pricing rule ID"
	msgNotFound           = "pricing rule not found"
	msgInternalError      = "internal server error"
)

// Handler обработчик для обновления правила ценообразования
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

// Handle обрабатывает запрос на обновление правила ценообразования
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

	// 2. Парсим request body
	var req models.UpdatePricingRuleRequest
	if err := handlers.DecodeJSON(r, &req); err != nil {
		h.logger.Warn("Failed to decode request: %v", err)
		handlers.RespondBadRequest(w, msgInvalidRequestBody)
		return
	}

	// 3. Вызываем сервис
	pricingRule, err := h.service.Update(r.Context(), id, &req)
	if err != nil {
		// Обрабатываем ошибку "не найдено"
		if errors.Is(err, pricingrules.ErrPricingRuleNotFound) {
			h.logger.Info("Pricing rule not found: id=%d", id)
			handlers.RespondNotFound(w, msgNotFound)
			return
		}

		// Обрабатываем ошибки валидации
		if errors.Is(err, pricingrules.ErrInvalidInput) {
			h.logger.Warn("Invalid request: %v", err)
			handlers.RespondBadRequest(w, err.Error())
			return
		}

		h.logger.Error("Failed to update pricing rule: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 4. Возвращаем успешный результат
	handlers.RespondJSON(w, http.StatusOK, pricingRule)
}
