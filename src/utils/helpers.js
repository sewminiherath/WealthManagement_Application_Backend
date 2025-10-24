/**
 * Helper Functions Module
 * 
 * Collection of reusable utility functions for common operations throughout the application.
 * Includes response formatting, input validation, string manipulation, and pagination utilities.
 * 
 * @module utils/helpers
 */

/**
 * Format standardized success response
 * 
 * Creates a consistent success response object with optional data payload.
 * Used throughout controllers to maintain uniform API response structure.
 * Always includes success:true and a message field. Data field is optional.
 * 
 * @function successResponse
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (200, 201, etc.)
 * @param {string} message - Success message to send to client
 * @param {*} [data=null] - Optional data payload to include in response
 * @returns {Object} Express response with JSON body
 * 
 * @example
 * // Without data
 * successResponse(res, 200, 'Operation successful');
 * // Response: { success: true, message: 'Operation successful' }
 * 
 * @example
 * // With data
 * successResponse(res, 200, 'User fetched successfully', user);
 * // Response: { success: true, message: 'User fetched successfully', data: {...} }
 */
exports.successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format standardized error response
 * 
 * Creates a consistent error response object with error type and optional message.
 * Used throughout controllers and error handlers to maintain uniform error structure.
 * Always includes success:false and error type. Message field is optional.
 * 
 * @function errorResponse
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP error status code (400, 401, 404, 500, etc.)
 * @param {string} error - Error type or category (e.g., 'Not Found', 'Unauthorized')
 * @param {string} [message=null] - Optional detailed error message
 * @returns {Object} Express response with JSON error body
 * 
 * @example
 * // Without detailed message
 * errorResponse(res, 404, 'Not Found');
 * // Response: { success: false, error: 'Not Found' }
 * 
 * @example
 * // With detailed message
 * errorResponse(res, 404, 'Not Found', 'User with id 123 not found');
 * // Response: { success: false, error: 'Not Found', message: 'User with id 123 not found' }
 */
exports.errorResponse = (res, statusCode, error, message = null) => {
  const response = {
    success: false,
    error,
  };

  if (message) {
    response.message = message;
  }

  return res.status(statusCode).json(response);
};

/**
 * Sanitize user input by trimming whitespace
 * 
 * Removes leading and trailing whitespace from string inputs for cleaner data storage.
 * Returns non-string inputs unchanged. Useful for preprocessing user data before validation.
 * 
 * @function sanitizeInput
 * @param {*} input - Input value to sanitize (any type)
 * @returns {*} Trimmed string if input is string, original input otherwise
 * 
 * @example
 * sanitizeInput('  hello world  '); // Returns: 'hello world'
 * sanitizeInput('test'); // Returns: 'test'
 * sanitizeInput(123); // Returns: 123
 * sanitizeInput({ key: 'value' }); // Returns: { key: 'value' }
 */
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};

/**
 * Generate random alphanumeric string
 * 
 * Creates a random string of specified length using base-36 encoding (0-9, a-z).
 * Useful for generating temporary tokens, unique identifiers, or test data.
 * Uses Math.random() so NOT cryptographically secure - don't use for passwords or secrets.
 * 
 * @function generateRandomString
 * @param {number} [length=10] - Desired length of random string (default: 10)
 * @returns {string} Random alphanumeric string of specified length
 * 
 * @example
 * generateRandomString(); // Returns: 'x3k9m2p7z4' (10 chars)
 * generateRandomString(5); // Returns: 'a9f2k' (5 chars)
 * generateRandomString(20); // Returns: 'g3k9m4p2x7f1n8q5t2h6' (20 chars)
 * 
 * @note NOT cryptographically secure - use crypto.randomBytes() for security-sensitive operations
 */
exports.generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Validate email address format using regex
 * 
 * Tests if a string matches standard email format pattern.
 * Checks for valid structure: localpart@domain.tld
 * Note: This is a basic format check, not a guarantee the email exists or is deliverable.
 * 
 * @function isValidEmail
 * @param {string} email - Email address string to validate
 * @returns {boolean} True if email format is valid, false otherwise
 * 
 * @example
 * isValidEmail('user@example.com'); // Returns: true
 * isValidEmail('user.name@example.co.uk'); // Returns: true
 * isValidEmail('invalid-email'); // Returns: false
 * isValidEmail('missing@domain'); // Returns: false
 * isValidEmail('@nodomain.com'); // Returns: false
 * 
 * @note For production use, consider using express-validator or validator.js for more robust validation
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Calculate pagination metadata for API responses
 * 
 * Computes comprehensive pagination information including total pages,
 * current page, navigation flags, and limits. Used to provide clients
 * with all information needed to implement pagination UI/logic.
 * 
 * @function getPaginationMeta
 * @param {number|string} page - Current page number (will be converted to integer)
 * @param {number|string} limit - Items per page (will be converted to integer)
 * @param {number} total - Total number of items in dataset
 * @returns {Object} Pagination metadata object
 * @returns {number} returns.page - Current page number (as integer)
 * @returns {number} returns.limit - Items per page (as integer)
 * @returns {number} returns.total - Total number of items
 * @returns {number} returns.pages - Total number of pages (calculated)
 * @returns {boolean} returns.hasNextPage - True if there are more pages after current
 * @returns {boolean} returns.hasPrevPage - True if there are pages before current
 * 
 * @example
 * getPaginationMeta(1, 10, 45);
 * // Returns: {
 * //   page: 1,
 * //   limit: 10,
 * //   total: 45,
 * //   pages: 5,
 * //   hasNextPage: true,
 * //   hasPrevPage: false
 * // }
 * 
 * @example
 * getPaginationMeta(3, 10, 45);
 * // Returns: {
 * //   page: 3,
 * //   limit: 10,
 * //   total: 45,
 * //   pages: 5,
 * //   hasNextPage: true,
 * //   hasPrevPage: true
 * // }
 */
exports.getPaginationMeta = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    pages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
};
