/**
 * Custom Logger Utility
 * 
 * Provides centralized logging functionality with timestamps and log levels.
 * All log messages are prefixed with log level and ISO timestamp for better tracking.
 * Debug logs are only output in development environment to reduce production noise.
 * 
 * @namespace logger
 * @property {Function} info - Log informational messages
 * @property {Function} error - Log error messages
 * @property {Function} warn - Log warning messages
 * @property {Function} debug - Log debug messages (development only)
 * 
 * @example
 * const logger = require('./utils/logger');
 * logger.info('Server started successfully');
 * logger.error('Database connection failed', error);
 * logger.warn('Low memory warning');
 * logger.debug('Request details', req.body);
 */
const logger = {
  /**
   * Log informational messages
   * 
   * Use for general information like server startup, successful operations,
   * configuration details, and non-error events worth logging.
   * 
   * @memberof logger
   * @function info
   * @param {string} message - Main log message
   * @param {...*} args - Additional arguments to log (objects, arrays, etc.)
   * 
   * @example
   * logger.info('Server is running on port 3000');
   * logger.info('User logged in', { userId: '123', ip: '192.168.1.1' });
   */
  info: (message, ...args) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  /**
   * Log error messages
   * 
   * Use for error conditions, exceptions, failed operations, and critical issues.
   * Errors are output to stderr for proper logging system capture.
   * 
   * @memberof logger
   * @function error
   * @param {string} message - Error message description
   * @param {...*} args - Additional arguments (Error objects, context data, etc.)
   * 
   * @example
   * logger.error('Database connection failed', error);
   * logger.error('Payment processing error', { orderId: '123', error: err.message });
   */
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  /**
   * Log warning messages
   * 
   * Use for warning conditions, deprecated features, recoverable errors,
   * and situations that might need attention but don't stop execution.
   * 
   * @memberof logger
   * @function warn
   * @param {string} message - Warning message description
   * @param {...*} args - Additional context data
   * 
   * @example
   * logger.warn('API rate limit approaching', { remaining: 10, limit: 100 });
   * logger.warn('Deprecated endpoint used', { endpoint: '/old-api' });
   */
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  /**
   * Log debug messages (development only)
   * 
   * Use for detailed debugging information during development.
   * Automatically disabled in production environment for performance.
   * Only outputs when NODE_ENV is 'development'.
   * 
   * @memberof logger
   * @function debug
   * @param {string} message - Debug message description
   * @param {...*} args - Debug data (request objects, variables, etc.)
   * 
   * @example
   * logger.debug('Request received', { method: 'POST', body: req.body });
   * logger.debug('Query execution', { query: sqlQuery, params: queryParams });
   * 
   * @requires NODE_ENV environment variable (only logs when set to 'development')
   */
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};

module.exports = logger;


