# Step 9: Utilities Implementation

## Overview
This step covers creating utility functions and helper methods for logging, formatting, and common operations.

## Date
October 24, 2025

## Objectives
1. Create custom logger utility
2. Create helper functions
3. Implement formatting utilities
4. Add reusable code patterns

---

## 1. Logger Utility

### File Created: `src/utils/logger.js`

**Purpose**: Custom logging utility for consistent log formatting

**Full Code**:
```javascript
// Simple logger utility
const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  error: (message, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    },
  },
};

module.exports = logger;
```

### Logger Methods

#### info() Method
```javascript
logger.info('Server started successfully');
```

**Output**:
```
[INFO] 2025-10-24T10:30:45.123Z - Server started successfully
```

**Use Cases**:
- Server startup
- Successful operations
- Important events
- Configuration logs

**Example Usage in Server**:
```javascript
logger.info(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`);
logger.info(`📍 Local: http://localhost:${PORT}`);
```

#### error() Method
```javascript
logger.error('Database connection failed', error);
```

**Output**:
```
[ERROR] 2025-10-24T10:30:45.123Z - Database connection failed Error: ...
```

**Use Cases**:
- Error conditions
- Failed operations
- Exceptions
- Critical issues

**Example Usage**:
```javascript
logger.error(`Unhandled Rejection: ${err.message}`);
logger.error(`Database error: ${error.message}`);
```

#### warn() Method
```javascript
logger.warn('API rate limit approaching');
```

**Output**:
```
[WARN] 2025-10-24T10:30:45.123Z - API rate limit approaching
```

**Use Cases**:
- Warning conditions
- Deprecation notices
- Non-critical issues
- Performance warnings

**Example Usage**:
```javascript
logger.warn('User account will expire soon');
logger.warn('Database response time exceeded threshold');
```

#### debug() Method
```javascript
logger.debug('Query execution details', queryDetails);
```

**Output** (only in development):
```
[DEBUG] 2025-10-24T10:30:45.123Z - Query execution details {...}
```

**Features**:
- Only logs in development mode
- Disabled in production for performance
- Useful for debugging
- Can include detailed information

**Use Cases**:
- Debugging during development
- Request/response logging
- Variable inspection
- Flow tracing

### Logger Features

#### Timestamp
```javascript
new Date().toISOString()
```
- ISO 8601 format
- UTC timezone
- Sortable
- Parseable

**Example**: `2025-10-24T10:30:45.123Z`

#### Log Levels
- **INFO**: Informational messages
- **ERROR**: Error conditions
- **WARN**: Warning conditions
- **DEBUG**: Debugging information

#### Additional Arguments
```javascript
logger.info('User logged in', { userId: '123', ip: '192.168.1.1' });
```

**Output**:
```
[INFO] 2025-10-24T10:30:45.123Z - User logged in { userId: '123', ip: '192.168.1.1' }
```

- Supports multiple arguments
- Objects are printed
- Useful for context

---

## 2. Helper Functions

### File Created: `src/utils/helpers.js`

**Purpose**: Reusable helper functions for common operations

**Full Code**:
```javascript
// Helper functions

/**
 * Format success response
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
 * Format error response
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
 * Sanitize user input
 */
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};

/**
 * Generate random string
 */
exports.generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * Check if string is valid email
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Calculate pagination metadata
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
```

### Helper Functions Explained

#### successResponse()

```javascript
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
```

**Purpose**: Standard success response format

**Usage**:
```javascript
const { successResponse } = require('../utils/helpers');

successResponse(res, 200, 'User retrieved successfully', user);
```

**Output**:
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": { ... }
}
```

**Benefits**:
- Consistent response format
- DRY principle
- Easy to modify globally

#### errorResponse()

```javascript
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
```

**Purpose**: Standard error response format

**Usage**:
```javascript
errorResponse(res, 404, 'Not Found', 'User not found');
```

**Output**:
```json
{
  "success": false,
  "error": "Not Found",
  "message": "User not found"
}
```

#### sanitizeInput()

```javascript
exports.sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim();
  }
  return input;
};
```

**Purpose**: Clean user input

**Usage**:
```javascript
const cleanName = sanitizeInput(req.body.name);
// "  John Doe  " → "John Doe"
```

**Use Cases**:
- Remove leading/trailing spaces
- Prevent whitespace-only inputs
- Pre-validation cleaning

#### generateRandomString()

```javascript
exports.generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};
```

**Purpose**: Generate random alphanumeric strings

**Usage**:
```javascript
const resetToken = generateRandomString(20);
// "g3k9m4p2x7..."
```

**How It Works**:
- `Math.random()` - Random number 0-1
- `.toString(36)` - Convert to base-36 (0-9, a-z)
- `.substring(2, length + 2)` - Take desired length

**Use Cases**:
- Reset tokens
- Temporary IDs
- Unique identifiers
- Testing

#### isValidEmail()

```javascript
exports.isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};
```

**Purpose**: Validate email format

**Usage**:
```javascript
if (!isValidEmail('user@example.com')) {
  return res.status(400).json({ error: 'Invalid email' });
}
```

**Returns**:
- `true` - Valid email format
- `false` - Invalid email format

**Note**: We use express-validator in routes, but this is useful in utilities

#### getPaginationMeta()

```javascript
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
```

**Purpose**: Calculate pagination metadata

**Usage**:
```javascript
const meta = getPaginationMeta(2, 10, 45);
```

**Returns**:
```javascript
{
  page: 2,
  limit: 10,
  total: 45,
  pages: 5,          // Math.ceil(45 / 10)
  hasNextPage: true, // 2 * 10 < 45
  hasPrevPage: true  // 2 > 1
}
```

**Use Cases**:
- Pagination responses
- UI page navigation
- API metadata
- Frontend pagination controls

---

## 3. Usage Examples

### Logger in Controllers

```javascript
const logger = require('../utils/logger');

exports.createItem = async (req, res) => {
  logger.info('Creating new item', { userId: req.user.id });
  
  try {
    const item = await Item.create(req.body);
    logger.info('Item created successfully', { itemId: item._id });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    logger.error('Item creation failed', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Helpers in Controllers

```javascript
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return errorResponse(res, 404, 'Not Found', 'User not found');
  }
  
  return successResponse(res, 200, 'User retrieved', user);
};
```

### Pagination in Controllers

```javascript
const { getPaginationMeta } = require('../utils/helpers');

exports.getAllItems = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const items = await Item.find()
    .skip((page - 1) * limit)
    .limit(limit);
    
  const total = await Item.countDocuments();
  const pagination = getPaginationMeta(page, limit, total);
  
  res.json({
    success: true,
    data: items,
    pagination
  });
};
```

---

## 4. Benefits of Utilities

### Code Reusability
- Write once, use everywhere
- DRY principle
- Easier maintenance

### Consistency
- Standard log format
- Standard response format
- Uniform behavior

### Testability
- Isolated functions
- Easy to unit test
- Mock-friendly

### Maintainability
- Single source of truth
- Easy to update globally
- Clear documentation

### Performance
- Debug logs only in development
- Optimized common operations
- No repeated code

---

## 5. Future Utility Ideas

### Not Implemented (Can Add Later)

#### Date/Time Utilities
```javascript
exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

exports.getDateRange = (days) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};
```

#### String Utilities
```javascript
exports.capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

exports.slugify = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
};
```

#### Validation Utilities
```javascript
exports.isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

exports.isStrongPassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};
```

#### Array Utilities
```javascript
exports.chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

exports.removeDuplicates = (array) => {
  return [...new Set(array)];
};
```

---

## 6. Best Practices

### Logger Best Practices
1. ✅ Use appropriate log levels
2. ✅ Include timestamps
3. ✅ Disable debug in production
4. ✅ Include context (userId, etc.)
5. ✅ Log errors with stack traces

### Helper Best Practices
1. ✅ Single responsibility
2. ✅ Pure functions (no side effects)
3. ✅ Clear documentation
4. ✅ Type checking
5. ✅ Default parameters

### Code Organization
1. ✅ Group related functions
2. ✅ Clear naming
3. ✅ JSDoc comments (for larger projects)
4. ✅ Export as module
5. ✅ Test utilities separately

---

## 7. Testing Utilities

### Logger Tests
```javascript
const logger = require('./logger');

// Test info logging
logger.info('Test info message');

// Test error logging
logger.error('Test error message', new Error('Test error'));

// Test debug (only shows in dev)
logger.debug('Test debug message');
```

### Helper Tests
```javascript
const { isValidEmail, generateRandomString, getPaginationMeta } = require('./helpers');

// Test email validation
console.log(isValidEmail('test@example.com')); // true
console.log(isValidEmail('invalid')); // false

// Test random string
const random = generateRandomString(10);
console.log(random.length); // 10

// Test pagination
const meta = getPaginationMeta(2, 10, 45);
console.log(meta); // { page: 2, limit: 10, ... }
```

---

## Files Created in This Step

1. ✅ `src/utils/logger.js` - Logging utility (4 methods, ~25 lines)
2. ✅ `src/utils/helpers.js` - Helper functions (6 functions, ~60 lines)

**Total**: 2 utility files, 10 functions, ~85 lines

---

## Utility Functions Summary

| Function | Purpose | Returns |
|----------|---------|---------|
| logger.info() | Info logging | void |
| logger.error() | Error logging | void |
| logger.warn() | Warning logging | void |
| logger.debug() | Debug logging (dev only) | void |
| successResponse() | Format success response | Express response |
| errorResponse() | Format error response | Express response |
| sanitizeInput() | Clean user input | Sanitized string |
| generateRandomString() | Generate random ID | Random string |
| isValidEmail() | Validate email | Boolean |
| getPaginationMeta() | Calculate pagination | Object |

---

**Step 9 Complete! ✅**

*Next: Step 10 - Testing & Deployment Guide*


