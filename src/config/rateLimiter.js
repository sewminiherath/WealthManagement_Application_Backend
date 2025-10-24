const rateLimit = require('express-rate-limit');

/**
 * General API Rate Limiter
 * 
 * Implements rate limiting for all general API endpoints to prevent abuse and DDoS attacks.
 * Limits requests per IP address within a time window. Returns 429 status when limit exceeded.
 * Configurable via environment variables with sensible defaults.
 * 
 * @constant {Function} apiLimiter - Express middleware for general API rate limiting
 * @property {number} windowMs - Time window in milliseconds (default: 15 minutes)
 * @property {number} max - Maximum number of requests per window per IP (default: 100)
 * @property {Object} message - Error response when limit exceeded
 * @property {boolean} standardHeaders - Include RateLimit-* headers in response
 * @property {boolean} legacyHeaders - Exclude legacy X-RateLimit-* headers
 * 
 * @example
 * // In server.js
 * const { apiLimiter } = require('./config/rateLimiter');
 * app.use('/api/', apiLimiter);
 * 
 * @requires RATE_LIMIT_WINDOW_MS environment variable (optional)
 * @requires RATE_LIMIT_MAX_REQUESTS environment variable (optional)
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Authentication Rate Limiter
 * 
 * Implements strict rate limiting specifically for authentication endpoints (login, register)
 * to prevent brute force attacks. Much more restrictive than general API limiter.
 * Only counts failed attempts (skipSuccessfulRequests: true) to allow legitimate users.
 * Fixed configuration not dependent on environment variables for security.
 * 
 * @constant {Function} authLimiter - Express middleware for authentication endpoint rate limiting
 * @property {number} windowMs - Time window in milliseconds (15 minutes, fixed)
 * @property {number} max - Maximum number of failed attempts per window per IP (5, fixed)
 * @property {boolean} skipSuccessfulRequests - Don't count successful authentications toward limit
 * @property {Object} message - Error response when limit exceeded
 * 
 * @example
 * // In auth.routes.js
 * const { authLimiter } = require('../config/rateLimiter');
 * router.post('/login', authLimiter, loginValidation, validate, login);
 * router.post('/register', authLimiter, registerValidation, validate, register);
 * 
 * @security Prevents brute force attacks on authentication endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many authentication attempts, please try again later.',
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};


