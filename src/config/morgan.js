/**
 * Morgan HTTP Request Logger Configuration
 * 
 * Configures Morgan middleware with:
 * - File-based logging with automatic rotation
 * - Environment-specific log formats
 * - Custom tokens for enhanced logging
 * - Skip conditions for health checks and static files
 * - Integration with custom logger utility
 * 
 * @module config/morgan
 */

const morgan = require('morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const logger = require('../utils/logger');

/**
 * Create a rotating write stream for access logs
 * 
 * Rotates logs daily and keeps them organized by date.
 * Old logs are automatically compressed and cleaned up.
 * 
 * @returns {WritableStream} Rotating file stream for access logs
 */
const createAccessLogStream = () => {
  return rfs.createStream('access.log', {
    interval: '1d', // Rotate daily
    path: path.join(__dirname, '../../logs'),
    compress: 'gzip', // Compress rotated files
    maxFiles: 14, // Keep 14 days of logs
  });
};

/**
 * Create a rotating write stream for error logs
 * 
 * Separates error logs (4xx, 5xx) into their own file for easier debugging.
 * 
 * @returns {WritableStream} Rotating file stream for error logs
 */
const createErrorLogStream = () => {
  return rfs.createStream('error.log', {
    interval: '1d', // Rotate daily
    path: path.join(__dirname, '../../logs'),
    compress: 'gzip', // Compress rotated files
    maxFiles: 30, // Keep 30 days of error logs
  });
};

/**
 * Custom Morgan token: Response time in milliseconds with color coding
 * 
 * Color codes based on response time:
 * - Green: < 100ms (fast)
 * - Yellow: 100-500ms (acceptable)
 * - Red: > 500ms (slow)
 */
morgan.token('colored-response-time', (req, res) => {
  const responseTime = morgan['response-time'](req, res);
  const time = parseFloat(responseTime);
  
  if (time < 100) {
    return `\x1b[32m${responseTime}ms\x1b[0m`; // Green
  } else if (time < 500) {
    return `\x1b[33m${responseTime}ms\x1b[0m`; // Yellow
  } else {
    return `\x1b[31m${responseTime}ms\x1b[0m`; // Red
  }
});

/**
 * Custom Morgan token: Colored HTTP status code
 * 
 * Color codes based on status:
 * - Green: 2xx (success)
 * - Cyan: 3xx (redirect)
 * - Yellow: 4xx (client error)
 * - Red: 5xx (server error)
 */
morgan.token('colored-status', (req, res) => {
  const status = res.statusCode;
  let color = '\x1b[0m'; // Default
  
  if (status >= 500) {
    color = '\x1b[31m'; // Red
  } else if (status >= 400) {
    color = '\x1b[33m'; // Yellow
  } else if (status >= 300) {
    color = '\x1b[36m'; // Cyan
  } else if (status >= 200) {
    color = '\x1b[32m'; // Green
  }
  
  return `${color}${status}\x1b[0m`;
});

/**
 * Custom Morgan token: User ID from authenticated requests
 * 
 * Extracts user ID from req.user if available (set by auth middleware).
 * Returns 'anonymous' for unauthenticated requests.
 */
morgan.token('user-id', (req, res) => {
  return req.user ? req.user._id : 'anonymous';
});

/**
 * Skip function: Don't log certain routes
 * 
 * Skips logging for:
 * - Health check endpoints (/health, /api/health)
 * - Favicon requests
 * 
 * Reduces log noise from automated health checks.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} True to skip logging, false to log
 */
const skipHealthChecks = (req, res) => {
  return req.url === '/health' || 
         req.url === '/api/health' || 
         req.url === '/favicon.ico';
};

/**
 * Skip function: Only log errors (4xx, 5xx status codes)
 * 
 * Used for error-specific logging to separate file.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} True to skip (not an error), false to log
 */
const skipSuccessful = (req, res) => {
  return res.statusCode < 400;
};

/**
 * Custom stream that integrates Morgan with custom logger
 * 
 * Writes Morgan logs through our custom logger utility for consistency.
 * Strips trailing newline that Morgan adds.
 */
const customLoggerStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

/**
 * Development format: Detailed and colored for easy debugging
 * 
 * Format: METHOD URL STATUS RESPONSE_TIME - SIZE
 * Example: GET /api/items 200 45.234ms - 1024
 */
const devFormat = ':method :url :colored-status :colored-response-time - :res[content-length]';

/**
 * Production format: Standard combined format with user ID
 * 
 * Apache combined log format plus user ID for tracking.
 * Example: 192.168.1.1 - user123 [24/Oct/2025:10:30:45 +0000] "GET /api/items HTTP/1.1" 200 1024
 */
const prodFormat = ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

/**
 * Get Morgan middleware configuration based on environment
 * 
 * Development mode:
 * - Colored console output
 * - Detailed format
 * - Skips health checks
 * 
 * Production mode:
 * - Logs to rotating files (access.log and error.log)
 * - Standard format for log analysis
 * - Separates errors into error.log
 * 
 * @returns {Array} Array of Morgan middleware instances
 */
const getMorganMiddleware = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development') {
    // Development: Console logging with colors
    return [
      morgan(devFormat, {
        skip: skipHealthChecks,
        stream: process.stdout,
      }),
    ];
  } else {
    // Production: File logging with rotation
    return [
      // Log all requests to access.log
      morgan(prodFormat, {
        skip: skipHealthChecks,
        stream: createAccessLogStream(),
      }),
      
      // Log only errors to error.log
      morgan(prodFormat, {
        skip: skipSuccessful,
        stream: createErrorLogStream(),
      }),
      
      // Also log errors to console via custom logger
      morgan(prodFormat, {
        skip: skipSuccessful,
        stream: customLoggerStream,
      }),
    ];
  }
};

module.exports = getMorganMiddleware;


