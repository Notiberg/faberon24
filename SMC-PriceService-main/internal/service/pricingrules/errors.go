package pricingrules

import "errors"

var (
	// ErrPricingRuleNotFound возвращается, когда правило ценообразования не найдено
	ErrPricingRuleNotFound = errors.New("pricing rule not found")

	// ErrDuplicateRule возвращается при попытке создать дубликат правила
	ErrDuplicateRule = errors.New("pricing rule already exists for this company and service")

	// ErrInvalidInput возвращается при некорректных входных данных
	ErrInvalidInput = errors.New("invalid input data")

	// ErrInternal возвращается при внутренних ошибках сервиса
	ErrInternal = errors.New("service: internal error")
)
