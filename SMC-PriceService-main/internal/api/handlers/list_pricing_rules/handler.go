package list_pricing_rules

import (
	"net/http"
	"strconv"

	"github.com/m04kA/SMC-PriceService/internal/api/handlers"
	"github.com/m04kA/SMC-PriceService/internal/service/pricingrules/models"
)

const (
	msgInternalError = "internal server error"
)

type Handler struct {
	service PricingRuleService
	logger  Logger
}

func NewHandler(service PricingRuleService, logger Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

func (h *Handler) Handle(w http.ResponseWriter, r *http.Request) {
	// 1. Парсим query параметры
	req := &models.PricingRuleFilterRequest{}

	if companyIDStr := r.URL.Query().Get("company_id"); companyIDStr != "" {
		companyID, err := strconv.ParseInt(companyIDStr, 10, 64)
		if err != nil {
			h.logger.Warn("Invalid company_id parameter: %v", err)
			handlers.RespondBadRequest(w, "invalid company_id parameter")
			return
		}
		req.CompanyID = &companyID
	}

	if serviceIDStr := r.URL.Query().Get("service_id"); serviceIDStr != "" {
		serviceID, err := strconv.ParseInt(serviceIDStr, 10, 64)
		if err != nil {
			h.logger.Warn("Invalid service_id parameter: %v", err)
			handlers.RespondBadRequest(w, "invalid service_id parameter")
			return
		}
		req.ServiceID = &serviceID
	}

	// 2. Вызываем сервис
	response, err := h.service.List(r.Context(), req)
	if err != nil {
		h.logger.Error("Failed to list pricing rules: %v", err)
		handlers.RespondInternalError(w)
		return
	}

	// 3. Возвращаем успешный результат
	handlers.RespondJSON(w, http.StatusOK, response)
}
