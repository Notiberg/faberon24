# Error Handling & Logging Guide

## Overview

The Faberon frontend now includes a comprehensive error handling and logging system to ensure stability and help with debugging.

## Features

### 1. Centralized Error Handler
- Catches all errors and provides user-friendly messages
- Categorizes errors by type (Network, API, Validation, etc.)
- Logs errors with context information

### 2. Logger System
- Multiple log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Stores logs in localStorage for debugging
- Console output for development

### 3. Global Error Handlers
- Catches uncaught JavaScript errors
- Handles unhandled promise rejections
- Prevents page crashes

### 4. User Notifications
- Displays error messages to users
- Auto-dismisses after 5 seconds
- Smooth animations

## Usage

### Logging

```javascript
// Info level
logger.info('User logged in', { userId: 123 });

// Warning level
logger.warn('API response slow', { duration: 5000 });

// Error level
logger.error('Failed to load data', error);

// Debug level
logger.debug('Processing data', { items: 100 });

// Fatal level
logger.fatal('Critical error', error);
```

### Error Handling

```javascript
try {
  // Some operation
  const user = await getCurrentUser();
} catch (error) {
  // Handle error
  const errorInfo = errorHandler.handle(error, 'getUserData');
  errorHandler.showNotification(errorInfo.userMessage, 'error');
}
```

### Accessing Logs

```javascript
// Get all logs
const logs = logger.getLogs();
console.log(logs);

// Clear logs
logger.clearLogs();
```

## Error Types

### NETWORK_ERROR
- Network connection issues
- Server unreachable
- Timeout errors

**User Message**: "Ошибка подключения к серверу. Проверьте интернет соединение."

### API_ERROR
- Invalid API response
- Server error (5xx)
- Invalid JSON response

**User Message**: "Ошибка при обработке ответа сервера."

### VALIDATION_ERROR
- Invalid input data
- Type errors
- Missing required fields

**User Message**: "Ошибка валидации данных."

### STORAGE_ERROR
- localStorage access issues
- Quota exceeded
- Permission denied

**User Message**: "Ошибка при сохранении данных."

### UNKNOWN_ERROR
- Unexpected errors
- Unclassified errors

**User Message**: "Произошла ошибка. Пожалуйста, попробуйте позже."

## Log Levels

### DEBUG
- Detailed information for debugging
- Variable values
- Function calls

### INFO
- General information
- User actions
- Page initialization

### WARN
- Warning messages
- Deprecated features
- Unusual conditions

### ERROR
- Error conditions
- Failed operations
- Exceptions

### FATAL
- Critical errors
- Unrecoverable conditions
- System failures

## Configuration

### Change Log Level

```javascript
// Only show WARN and above
logger.level = LogLevels.WARN;

// Show all logs
logger.level = LogLevels.DEBUG;
```

### Disable Notifications

```javascript
// Override showNotification to disable
errorHandler.showNotification = () => {};
```

## Best Practices

### 1. Always Use Try-Catch
```javascript
try {
  const data = await fetchData();
} catch (error) {
  const errorInfo = errorHandler.handle(error, 'fetchData');
  errorHandler.showNotification(errorInfo.userMessage);
}
```

### 2. Log Important Operations
```javascript
logger.info('Starting data sync');
try {
  await syncData();
  logger.info('Data sync completed');
} catch (error) {
  logger.error('Data sync failed', error);
}
```

### 3. Provide Context
```javascript
logger.error('Failed to update user', {
  userId: user.id,
  operation: 'update',
  error: error.message
});
```

### 4. Use Appropriate Log Levels
```javascript
logger.debug('Processing item', { id: 1 });  // Detailed info
logger.info('User logged in');                // Important event
logger.warn('API response slow');             // Warning
logger.error('Failed to save', error);        // Error
logger.fatal('System crash', error);          // Critical
```

## Debugging

### View Logs in Browser

1. Open browser console (F12)
2. Run: `logger.getLogs()`
3. View all logged events

### Export Logs

```javascript
const logs = logger.getLogs();
const json = JSON.stringify(logs, null, 2);
console.log(json);
// Copy and save to file
```

### Monitor Errors

```javascript
// Check for errors
const logs = logger.getLogs();
const errors = logs.filter(l => l.level === 'ERROR' || l.level === 'FATAL');
console.log('Errors:', errors);
```

## Common Issues

### Issue: Page crashes without error message
**Solution**: Check browser console and logs
```javascript
logger.getLogs().forEach(log => console.log(log));
```

### Issue: API errors not showing
**Solution**: Ensure errorHandler.showNotification is called
```javascript
catch (error) {
  const errorInfo = errorHandler.handle(error, 'context');
  errorHandler.showNotification(errorInfo.userMessage);
}
```

### Issue: Too many logs
**Solution**: Clear old logs
```javascript
logger.clearLogs();
```

## Integration Points

### Profile Page (profile.js)
- Logs user data loading
- Logs car operations
- Logs profile updates

### Index Page (index.js)
- Logs page initialization
- Logs user credential loading

### API Service (api.js)
- Logs API requests
- Logs API errors
- Logs response data

## Performance

- Logs stored in localStorage (max 100 entries)
- Automatic cleanup of old logs
- Minimal performance impact
- Non-blocking error handling

## Security

- No sensitive data in logs
- Logs stored locally only
- User messages don't expose internals
- Error details logged server-side

## Future Enhancements

- [ ] Remote error logging
- [ ] Error analytics
- [ ] Performance monitoring
- [ ] User session tracking
- [ ] Crash reporting

## Support

For issues with error handling:
1. Check logs: `logger.getLogs()`
2. Review console errors
3. Check network tab
4. Review error-handler.js implementation

---

**Status**: ✅ Production Ready

**Last Updated**: December 6, 2025
