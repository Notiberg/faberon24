package create_pricing_rule

import (
	"errors"
	"net/http"

	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

const (
	msgInvalidRequestBody = "invalid request body"
)

// Handler обработчик для создания правила ценообразования
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

// Handle обрабатывает запрос на создание правила ценообразования
func (h *Handler) Handle(w http.ResponseWriter, r *http.Request) {
	// 1. Парсим request body
	var req models.CreatePricingRuleRequest
	if err := handlers.DecodeJSON(r, &req); err != nil {
		h.logger.Warn("Failed to decode request: %v", err)
		handlers.RespondBadRequest(w, msgInvalidRequestBody)
		return
	}

	// 2. Вызываем сервис
	pricingRule, err := h.service.Create(r.Context(), &req)
	if err != nil {
		// Обрабатываем ошибку дубликата
		if errors.Is(err, pricingrules.ErrDuplicateRule) {
			h.logger.Warn("Duplicate pricing rule: company_id=%d, service_id=%d", req.CompanyID, req.ServiceID)
			handlers.RespondBadRequest(w, "pricing rule already exists for this company and service")
			return
		}

		// Обрабатываем ошибки валидации
		if errors.Is(err, pricingrules.ErrInvalidInput) {
			h.logger.Warn("Invalid request: %v", err)
			handlers.RespondBadRequest(w, err.Error())
			return
		}

		h.logger.Error("Failed to create pricing rule: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 3. Возвращаем успешный результат
	handlers.RespondJSON(w, http.StatusCreated, pricingRule)
}
