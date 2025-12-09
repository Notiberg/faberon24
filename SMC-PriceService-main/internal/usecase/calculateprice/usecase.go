package calculateprice

import (
	"context"
	"errors"
	"fmt"

	"github.com/m04kA/SMC-PriceService/internal/domain"
	"github.com/m04kA/SMC-PriceService/internal/infra/storage/pricingrule"
	"github.com/m04kA/SMC-PriceService/internal/integrations/userservice"
	"github.com/m04kA/SMC-PriceService/internal/usecase/calculateprice/models"
)

// UseCase usecase для расчёта цен
type UseCase struct {
	pricingRuleRepo   PricingRuleRepository
	userServiceClient UserServiceClient
	calculator        *Calculator
	logger            Logger
}

// NewUseCase создаёт новый экземпляр usecase
func NewUseCase(
	pricingRuleRepo PricingRuleRepository,
	userServiceClient UserServiceClient,
	logger Logger,
) *UseCase {
	return &UseCase{
		pricingRuleRepo:   pricingRuleRepo,
		userServiceClient: userServiceClient,
		calculator:        NewCalculator(),
		logger:            logger,
	}
}

// Calculate рассчитывает цену для одной услуги компании для пользователя
func (uc *UseCase) Calculate(
	ctx context.Context,
	tgUserID int64,
	req *models.CalculateRequest,
) (*models.CalculateResponse, error) {
	uc.logger.Info("Calculating price: company_id=%d, service_id=%d, tg_user_id=%d",
		req.CompanyID, req.ServiceID, tgUserID)

	// 1. Получаем правило ценообразования
	domainRule, err := uc.pricingRuleRepo.GetByCompanyAndService(ctx, req.CompanyID, req.ServiceID)
	if err != nil {
		if errors.Is(err, pricingrule.ErrPricingRuleNotFound) {
			uc.logger.Warn("Pricing rule not found: company_id=%d, service_id=%d", req.CompanyID, req.ServiceID)
			return nil, ErrPricingRuleNotFound
		}
		uc.logger.Error("Failed to get pricing rule: %v", err)
		return nil, fmt.Errorf("%w: failed to get pricing rule: %v", ErrInternal, err)
	}

	// 2. Конвертируем domain model в модель калькулятора
	rule := uc.toPricingRuleModel(domainRule)

	// 3. Получаем информацию об автомобиле (если требуется)
	var car *models.Car
	if uc.requiresCarInfo(domainRule.PricingType) {
		car, err = uc.getUserCar(ctx, tgUserID)
		if err != nil {
			// Критичные ошибки пробрасываем выше
			if !errors.Is(err, userservice.ErrCarNotFound) || !errors.Is(err, userservice.ErrServiceDegraded) {
				uc.logger.Error("%v - UserService error; user_id=%d; error=%v", ErrInternal, tgUserID, err)
				return nil, err
			}

			if errors.Is(err, userservice.ErrServiceDegraded) {
				// Деградация - продолжаем с car = nil
				uc.logger.Error("UserService degraded, using base price for tg_user_id=%d: %v", tgUserID, err)
			}
		}
	}

	// 4. Рассчитываем цену
	price, calcErr := uc.calculator.CalculatePrice(rule, car)
	if calcErr != nil {
		// Калькулятор вернул базовую цену + ошибку - логируем ошибку
		uc.logger.Warn("Price calculation degraded: %v", calcErr)
	}

	uc.logger.Info("Price calculated: company_id=%d, service_id=%d, price=%.2f %s",
		req.CompanyID, req.ServiceID, price.Price, price.Currency)

	return price, nil
}

// requiresCarInfo проверяет, требуется ли информация об автомобиле для данного типа правила
func (uc *UseCase) requiresCarInfo(pricingType domain.PricingType) bool {
	return pricingType == domain.PricingTypeVehicleClassMultiplier ||
		pricingType == domain.PricingTypeVehicleClassFixed
}

// getUserCar получает информацию об автомобиле пользователя
func (uc *UseCase) getUserCar(ctx context.Context, tgUserID int64) (*models.Car, error) {
	userCar, err := uc.userServiceClient.GetSelectedCarWithGracefulDegradation(ctx, tgUserID)
	if err != nil {
		if errors.Is(err, userservice.ErrCarNotFound) {
			uc.logger.Info("No selected car found for tg_user_id=%d", tgUserID)
			return nil, fmt.Errorf("%w: user has no selected car; tg_user_id=%d", err, tgUserID)
		}
		// Все остальные ошибки (включая ErrServiceDegraded) - логируем как ERROR
		uc.logger.Error("UserService error for tg_user_id=%d: %v", tgUserID, err)
		return nil, err
	}

	if userCar == nil {
		return nil, nil
	}

	return &models.Car{
		VehicleClass: userCar.Size,
	}, nil
}

// BatchCalculate рассчитывает цены для нескольких услуг одной компании
func (uc *UseCase) BatchCalculate(
	ctx context.Context,
	tgUserID int64,
	req *models.BatchCalculateRequest,
) (*models.BatchCalculateResponse, error) {
	uc.logger.Info("Batch calculating prices: company_id=%d, services_count=%d, tg_user_id=%d",
		req.CompanyID, len(req.ServiceIDs), tgUserID)

	// 1. Получаем все правила ценообразования за один запрос (уже в виде map)
	rulesMap, err := uc.pricingRuleRepo.GetBatchByCompanyAndServices(ctx, req.CompanyID, req.ServiceIDs)
	if err != nil {
		uc.logger.Error("Failed to get batch pricing rules: %v", err)
		return nil, fmt.Errorf("%w: failed to get pricing rules: %v", ErrInternal, err)
	}

	// 2. Проверяем, нужна ли информация об автомобиле
	needsCarInfo := false
	for _, rule := range rulesMap {
		if uc.requiresCarInfo(rule.PricingType) {
			needsCarInfo = true
			break
		}
	}

	// 3. Получаем информацию об автомобиле пользователя один раз (если нужна)
	var car *models.Car
	if needsCarInfo {
		car, err = uc.getUserCar(ctx, tgUserID)
		if err != nil {
			// Критичные ошибки пробрасываем выше
			if !errors.Is(err, userservice.ErrCarNotFound) && !errors.Is(err, userservice.ErrServiceDegraded) {
				uc.logger.Error("%v - UserService error; user_id=%d; error=%v", ErrInternal, tgUserID, err)
				return nil, err
			}

			if errors.Is(err, userservice.ErrServiceDegraded) {
				// Деградация - продолжаем с car = nil
				uc.logger.Error("UserService degraded, using base prices for tg_user_id=%d: %v", tgUserID, err)
			}
		}
	}

	// 4. Рассчитываем цену для каждой услуги
	prices := make([]models.CalculateResponse, 0, len(req.ServiceIDs))

	for _, serviceID := range req.ServiceIDs {
		domainRule, found := rulesMap[serviceID]
		if !found {
			uc.logger.Warn("Pricing rule not found for service_id=%d, skipping", serviceID)
			continue
		}

		// Конвертируем domain model в модель калькулятора
		rule := uc.toPricingRuleModel(domainRule)

		// Рассчитываем цену
		price, calcErr := uc.calculator.CalculatePrice(rule, car)
		if calcErr != nil {
			// Калькулятор вернул базовую цену + ошибку - логируем ошибку
			uc.logger.Warn("Price calculation degraded for service_id=%d: %v", serviceID, calcErr)
		}

		prices = append(prices, *price)
	}

	uc.logger.Info("Batch calculation completed: %d prices calculated", len(prices))

	return &models.BatchCalculateResponse{
		Prices: prices,
	}, nil
}

// toPricingRuleModel конвертирует domain.PricingRule в models.PricingRule
func (uc *UseCase) toPricingRuleModel(domainRule *domain.PricingRule) *models.PricingRule {
	// Конвертируем map[domain.VehicleClass]float64 в map[string]float64
	multipliers := make(map[string]float64, len(domainRule.VehicleClassMultipliers))
	for class, value := range domainRule.VehicleClassMultipliers {
		multipliers[string(class)] = value
	}

	prices := make(map[string]float64, len(domainRule.VehicleClassPrices))
	for class, value := range domainRule.VehicleClassPrices {
		prices[string(class)] = value
	}

	return &models.PricingRule{
		CompanyID:               domainRule.CompanyID,
		ServiceID:               domainRule.ServiceID,
		PricingType:             string(domainRule.PricingType),
		BasePrice:               *domainRule.BasePrice,
		Currency:                domainRule.Currency,
		VehicleClassMultipliers: multipliers,
		VehicleClassPrices:      prices,
	}
}
