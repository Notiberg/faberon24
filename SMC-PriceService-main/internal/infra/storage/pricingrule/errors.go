package pricingrule

import "errors"

var (
	// ErrPricingRuleNotFound возвращается, когда правило ценообразования не найдено в БД
	ErrPricingRuleNotFound = errors.New("repository: pricing rule not found")

	// ErrBuildQuery возвращается при ошибке построения SQL запроса
	ErrBuildQuery = errors.New("repository: failed to build SQL query")

	// ErrExecQuery возвращается при ошибке выполнения SQL запроса
	ErrExecQuery = errors.New("repository: failed to execute SQL query")

	// ErrScanRow возвращается при ошибке сканирования строки из БД
	ErrScanRow = errors.New("repository: failed to scan row")

	// ErrTransaction возвращается при ошибке работы с транзакцией
	ErrTransaction = errors.New("repository: transaction error")

	// ErrDuplicateRule возвращается при попытке создать дубликат правила для компании+услуги
	ErrDuplicateRule = errors.New("repository: pricing rule already exists for this company and service")
)
