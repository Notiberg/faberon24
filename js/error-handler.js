/**
 * Error Handler and Logging Utility
 * Provides centralized error handling and logging for the frontend
 */

// Error types
const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  API: 'API_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  STORAGE: 'STORAGE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Log levels
const LogLevels = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  FATAL: 'FATAL'
};

// Logger configuration
const logger = {
  level: LogLevels.INFO,
  
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      console.log(logEntry, data);
    } else {
      console.log(logEntry);
    }
    
    // Store in localStorage for debugging
    this.storeLog(level, message, data);
  },
  
  debug(message, data) {
    if (this.shouldLog(LogLevels.DEBUG)) {
      this.log(LogLevels.DEBUG, message, data);
    }
  },
  
  info(message, data) {
    if (this.shouldLog(LogLevels.INFO)) {
      this.log(LogLevels.INFO, message, data);
    }
  },
  
  warn(message, data) {
    if (this.shouldLog(LogLevels.WARN)) {
      this.log(LogLevels.WARN, message, data);
    }
  },
  
  error(message, data) {
    if (this.shouldLog(LogLevels.ERROR)) {
      this.log(LogLevels.ERROR, message, data);
    }
  },
  
  fatal(message, data) {
    this.log(LogLevels.FATAL, message, data);
  },
  
  shouldLog(level) {
    const levels = [LogLevels.DEBUG, LogLevels.INFO, LogLevels.WARN, LogLevels.ERROR, LogLevels.FATAL];
    const currentIndex = levels.indexOf(this.level);
    const messageIndex = levels.indexOf(level);
    return messageIndex >= currentIndex;
  },
  
  storeLog(level, message, data) {
    try {
      const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
      logs.push({
        timestamp: new Date().toISOString(),
        level,
        message,
        data
      });
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.shift();
      }
      
      localStorage.setItem('appLogs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to store log:', e);
    }
  },
  
  getLogs() {
    try {
      return JSON.parse(localStorage.getItem('appLogs') || '[]');
    } catch (e) {
      return [];
    }
  },
  
  clearLogs() {
    try {
      localStorage.removeItem('appLogs');
    } catch (e) {
      console.error('Failed to clear logs:', e);
    }
  }
};

// Error handler
const errorHandler = {
  handle(error, context = '') {
    logger.error(`Error in ${context}:`, error);
    
    // Determine error type
    let errorType = ErrorTypes.UNKNOWN;
    let userMessage = 'Произошла ошибка. Пожалуйста, попробуйте позже.';
    
    if (error instanceof TypeError) {
      if (error.message.includes('fetch')) {
        errorType = ErrorTypes.NETWORK;
        userMessage = 'Ошибка подключения к серверу. Проверьте интернет соединение.';
      } else {
        errorType = ErrorTypes.VALIDATION;
        userMessage = 'Ошибка валидации данных.';
      }
    } else if (error instanceof SyntaxError) {
      errorType = ErrorTypes.API;
      userMessage = 'Ошибка при обработке ответа сервера.';
    } else if (error.message && error.message.includes('API Error')) {
      errorType = ErrorTypes.API;
      userMessage = error.message;
    }
    
    return {
      type: errorType,
      message: error.message,
      userMessage,
      context,
      timestamp: new Date().toISOString()
    };
  },
  
  showNotification(message, type = 'error') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      background-color: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#ffaa00'};
      color: white;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
};

// Global error handler
window.addEventListener('error', (event) => {
  logger.fatal('Uncaught error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
  errorHandler.showNotification('Произошла критическая ошибка. Пожалуйста, перезагрузите страницу.');
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  logger.fatal('Unhandled promise rejection:', event.reason);
  errorHandler.showNotification('Произошла ошибка. Пожалуйста, перезагрузите страницу.');
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { logger, errorHandler, ErrorTypes, LogLevels };
}
