package main

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"github.com/prometheus/client_golang/prometheus/promhttp"

	"github.com/m04kA/SMC-PriceService/internal/api/handlers/calculate_prices"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers/create_pricing_rule"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers/delete_pricing_rule"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers/get_pricing_rule"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers/list_pricing_rules"
	"github.com/m04kA/SMC-PriceService/internal/api/handlers/update_pricing_rule"
	"github.com/m04kA/SMC-PriceService/internal/api/middleware"
	"github.com/m04kA/SMC-PriceService/internal/config"
	pricingRuleRepo "github.com/m04kA/SMC-PriceService/internal/infra/storage/pricingrule"
	"github.com/m04kA/SMC-PriceService/internal/integrations/userservice"
	pricingRulesService "github.com/m04kA/SMC-PriceService/internal/service/pricingrules"
	"github.com/m04kA/SMC-PriceService/internal/usecase/calculateprice"
	"github.com/m04kA/SMC-PriceService/pkg/dbmetrics"
	"github.com/m04kA/SMC-PriceService/pkg/logger"
	"github.com/m04kA/SMC-PriceService/pkg/metrics"
)

func main() {
	// Загружаем конфигурацию
	cfg, err := config.Load("config.toml")
	if err != nil {
		fmt.Printf("Failed to load config: %v\n", err)
		os.Exit(1)
	}

	// Инициализируем логгер
	log, err := logger.New(cfg.Logs.File, cfg.Logs.Level)
	if err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer log.Close()

	log.Info("Starting SMK-SellerService...")
	log.Info("Configuration loaded from config.toml")

	// Инициализируем метрики (если включены)
	var metricsCollector *metrics.Metrics
	var wrappedDB *dbmetrics.DB
	stopMetricsCh := make(chan struct{})

	if cfg.Metrics.Enabled {
		metricsCollector = metrics.New(cfg.Metrics.ServiceName)
		log.Info("Metrics enabled at %s", cfg.Metrics.Path)
	}

	// Подключаемся к базе данных
	db, err := sql.Open("postgres", cfg.Database.DSN())
	if err != nil {
		log.Fatal("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Настраиваем connection pool
	db.SetMaxOpenConns(cfg.Database.MaxOpenConns)
	db.SetMaxIdleConns(cfg.Database.MaxIdleConns)
	db.SetConnMaxLifetime(time.Duration(cfg.Database.ConnMaxLifetime) * time.Second)

	// Проверяем соединение
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database: %v", err)
	}
	log.Info("Successfully connected to database (host=%s, port=%d, db=%s)",
		cfg.Database.Host, cfg.Database.Port, cfg.Database.DBName)

	// Инициализируем репозитории и сервисы (с метриками или без)
	var pricingRuleSvc *pricingRulesService.Service
	var calculatePriceUC *calculateprice.UseCase
	var pricingRuleRepository *pricingRuleRepo.Repository

	if cfg.Metrics.Enabled {
		wrappedDB = dbmetrics.WrapWithDefault(db, metricsCollector, cfg.Metrics.ServiceName, stopMetricsCh)
		log.Info("Database metrics collection started")

		// Инициализируем репозитории с обёрткой метрик
		pricingRuleRepository = pricingRuleRepo.NewRepository(wrappedDB)

	} else {
		// Инициализируем репозитории без метрик
		pricingRuleRepository = pricingRuleRepo.NewRepository(db)
	}

	// Инициализируем сервисы
	pricingRuleSvc = pricingRulesService.NewService(pricingRuleRepository)

	// Инициализируем UserService client
	userServiceClient := userservice.NewClient(cfg.UserService.BaseURL, log)

	// Инициализируем usecase для расчёта цен
	calculatePriceUC = calculateprice.NewUseCase(pricingRuleRepository, userServiceClient, log)

	// Инициализируем handlers
	calculatePricesHandler := calculate_prices.NewHandler(calculatePriceUC, log)
	createPricingRuleHandler := create_pricing_rule.NewHandler(pricingRuleSvc, log)
	listPricingRulesHandler := list_pricing_rules.NewHandler(pricingRuleSvc, log)
	getPricingRuleHandler := get_pricing_rule.NewHandler(pricingRuleSvc, log)
	updatePricingRuleHandler := update_pricing_rule.NewHandler(pricingRuleSvc, log)
	deletePricingRuleHandler := delete_pricing_rule.NewHandler(pricingRuleSvc, log)

	// Настраиваем роутер
	r := mux.NewRouter()

	// Добавляем metrics middleware (если метрики включены)
	if cfg.Metrics.Enabled {
		r.Use(middleware.MetricsMiddleware(metricsCollector, cfg.Metrics.ServiceName))
		log.Info("HTTP metrics middleware enabled")
	}

	// Metrics endpoint (публичный, без аутентификации)
	if cfg.Metrics.Enabled {
		r.Handle(cfg.Metrics.Path, promhttp.Handler()).Methods(http.MethodGet)
		log.Info("Prometheus metrics endpoint exposed at %s", cfg.Metrics.Path)
	}

	// API prefix
	api := r.PathPrefix("/api/v1").Subrouter()

	// Public routes для расчёта цен
	api.HandleFunc("/prices/calculate", calculatePricesHandler.Handle).Methods(http.MethodPost)

	// Public routes для управления правилами ценообразования
	api.HandleFunc("/pricing-rules", listPricingRulesHandler.Handle).Methods(http.MethodGet)
	api.HandleFunc("/pricing-rules", createPricingRuleHandler.Handle).Methods(http.MethodPost)
	api.HandleFunc("/pricing-rules/{id}", getPricingRuleHandler.Handle).Methods(http.MethodGet)
	api.HandleFunc("/pricing-rules/{id}", updatePricingRuleHandler.Handle).Methods(http.MethodPut)
	api.HandleFunc("/pricing-rules/{id}", deletePricingRuleHandler.Handle).Methods(http.MethodDelete)

	// Создаем HTTP сервер с CORS middleware обёрнутым вокруг роутера
	addr := fmt.Sprintf(":%d", cfg.Server.HTTPPort)
	srv := &http.Server{
		Addr:         addr,
		Handler:      corsMiddleware(r),
		ReadTimeout:  time.Duration(cfg.Server.ReadTimeout) * time.Second,
		WriteTimeout: time.Duration(cfg.Server.WriteTimeout) * time.Second,
		IdleTimeout:  time.Duration(cfg.Server.IdleTimeout) * time.Second,
	}
	log.Info("CORS middleware enabled")

	// Graceful shutdown
	go func() {
		log.Info("Starting server on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server failed to start: %v", err)
		}
	}()

	// Ожидаем сигнал завершения
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...")

	// Останавливаем сбор метрик connection pool
	if cfg.Metrics.Enabled {
		close(stopMetricsCh)
		log.Info("Metrics collection stopped")
	}

	shutdownCtx, cancel := context.WithTimeout(
		context.Background(),
		time.Duration(cfg.Server.ShutdownTimeout)*time.Second,
	)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Error("Server forced to shutdown: %v", err)
	}

	log.Info("Server stopped gracefully")
}
