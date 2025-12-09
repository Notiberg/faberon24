package calculateprice

import "errors"

var (
	// ErrPricingRuleNotFound возвращается, когда не найдено правило ценообразования
	ErrPricingRuleNotFound = errors.New("pricing rule not found for company and service")

	// ErrMultiplierNotFound возвращается, когда множитель для класса автомобиля не найден
	ErrMultiplierNotFound = errors.New("multiplier not found for vehicle class")

	// ErrFixedPriceNotFound возвращается, когда фиксированная цена для класса автомобиля не найдена
	ErrFixedPriceNotFound = errors.New("fixed price not found for vehicle class")

	// ErrInvalidPricingRule возвращается, когда правило ценообразования некорректно
	ErrInvalidPricingRule = errors.New("invalid pricing rule configuration")

	// ErrInternal возвращается при внутренних ошибках usecase
	ErrInternal = errors.New("calculate price usecase: internal error")
)
