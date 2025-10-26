# Step 5: Middleware Implementation

## Overview
This step covers creating custom middleware for authentication, authorization, input validation, and error handling.

## Date
October 24, 2025

## Objectives
1. Implement JWT authentication middleware
2. Create authorization (role-based) middleware
3. Set up input validation rules
4. Implement centralized error handling

---

## 1. Authentication Middleware

### File Created: `src/middleware/auth.js`

**Purpose**: Protect routes and verify JWT tokens

**Total Lines**: 98 lines with 3 middleware functions

### Main Protection Middleware

```javascript
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Not authorized to access this route. Please login.',
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired token. Please login again.',
      });
    }

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found.',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User account is inactive.',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Not authorized to access this route.',
    });
  }
};
```

**Step-by-Step Flow**:

1. **Extract Token from Header**
```javascript
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
  token = req.headers.authorization.split(' ')[1];
}
```
- Checks for Authorization header
- Format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- Splits by space and takes second part (the token)

2. **Check Token Exists**
```javascript
if (!token) {
  return res.status(401).json({ ... });
}
```
- Returns 401 Unauthorized if no token
- Clear error message to client

3. **Verify Token**
```javascript
const decoded = verifyToken(token);
```
- Uses JWT verifyToken from config
- Returns decoded payload or null
- Checks signature and expiration

4. **Validate User Exists**
```javascript
const user = await User.findById(decoded.id).select('-password');
if (!user) {
  return res.status(401).json({ ... });
}
```
- Fetches user from database
- Excludes password field
- Handles deleted users

5. **Check User is Active**
```javascript
if (!user.isActive) {
  return res.status(401).json({ ... });
}
```
- Prevents deactivated accounts from accessing
- Soft delete enforcement

6. **Attach User to Request**
```javascript
req.user = user;
next();
```
- Makes user available to route handlers
- Calls next() to continue to next middleware/controller

**Usage Example**:
```javascript
router.get('/profile', protect, getUserProfile);
// protect runs first, then getUserProfile
// getUserProfile can access req.user
```

### Authorization Middleware

```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `User role '${req.user.role}' is not authorized to access this route.`,
      });
    }
    next();
  };
};
```

**Purpose**: Restrict routes to specific roles

**How It Works**:
1. Takes role(s) as parameter
2. Returns middleware function (closure)
3. Checks if user's role is in allowed roles
4. Returns 403 Forbidden if not authorized

**Usage Examples**:
```javascript
// Admin only
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Admin or moderator
router.put('/posts/:id', protect, authorize('admin', 'moderator'), updatePost);

// Any authenticated user (no authorize needed)
router.get('/profile', protect, getProfile);
```

**Status Codes**:
- **401 Unauthorized**: Not logged in / invalid token
- **403 Forbidden**: Logged in but insufficient permissions

### Optional Authentication Middleware

```javascript
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
```

**Purpose**: Make user available if logged in, but don't require it

**Use Cases**:
- Public endpoints that show extra data for logged-in users
- Endpoints with different responses for authenticated users
- Optional personalization

**Example**:
```javascript
router.get('/items', optionalAuth, getAllItems);
// If logged in: req.user is available
// If not logged in: req.user is undefined
// Both cases continue to controller
```

---

## 2. Validation Middleware

### File Created: `src/middleware/validation.js`

**Purpose**: Validate and sanitize user input

**Total Lines**: 109 lines with multiple validation rule sets

### Validation Result Handler

```javascript
const { body, param, query, validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};
```

**Purpose**: Check validation results and format errors

**Usage Pattern**:
```javascript
router.post('/register', 
  registerValidation,  // Validation rules
  validate,            // Check results
  register            // Controller
);
```

**Error Response Example**:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### User Validation Rules

#### Register Validation
```javascript
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];
```

**Validation Chain Explanation**:

**Name Validation**:
1. `trim()` - Remove spaces from ends
2. `notEmpty()` - Cannot be empty
3. `isLength({ min: 2, max: 50 })` - Length check
4. `withMessage()` - Custom error message

**Email Validation**:
1. `trim()` - Remove spaces
2. `notEmpty()` - Required
3. `isEmail()` - Valid email format
4. `normalizeEmail()` - Lowercase and standardize

**Password Validation**:
1. `notEmpty()` - Required
2. `isLength({ min: 6 })` - Minimum length

#### Login Validation
```javascript
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty().withMessage('Password is required'),
];
```
- Similar to register but no password length check (already in database)

### Item Validation Rules

#### Create Item Validation
```javascript
exports.createItemValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Item name is required')
    .isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 characters'),
    
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
    
  body('category')
    .optional()
    .isIn(['electronics', 'clothing', 'food', 'books', 'other'])
    .withMessage('Invalid category'),
    
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
];
```

**Key Validators**:
- `optional()` - Field is not required
- `isFloat({ min: 0 })` - Decimal number, minimum 0
- `isInt({ min: 0 })` - Integer, minimum 0
- `isIn([...])` - Must be one of the values
- `isArray()` - Must be an array

#### Update Item Validation
```javascript
exports.updateItemValidation = [
  // Same as create but all fields optional
  body('name').optional().trim()...
  body('description').optional().trim()...
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'discontinued'])
    .withMessage('Invalid status'),
];
```
- All fields optional (partial updates)
- Includes status field validation

### Other Validation Rules

#### ID Validation
```javascript
exports.idValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
];
```
- Validates MongoDB ObjectId format
- Used for `:id` route parameters
- Prevents invalid ID errors

#### Pagination Validation
```javascript
exports.paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
  query('sort')
    .optional()
    .isString().withMessage('Sort must be a string'),
];
```
- Validates query parameters
- `query()` instead of `body()`
- Limits pagination to reasonable values

---

## 3. Error Handler Middleware

### File Created: `src/middleware/errorHandler.js`

**Purpose**: Centralized error handling for all routes

### Main Error Handler

```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error.statusCode = 404;
    error.message = message;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.statusCode = 400;
    error.message = message;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.statusCode = 400;
    error.message = message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.message = 'Invalid token. Please login again.';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Token expired. Please login again.';
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

**Error Types Handled**:

1. **CastError** - Invalid MongoDB ObjectId
```javascript
// Example: GET /api/items/invalid-id
// Response: 404 "Resource not found"
```

2. **Duplicate Key (11000)** - Unique constraint violation
```javascript
// Example: Register with existing email
// Response: 400 "Email already exists"
```

3. **ValidationError** - Mongoose schema validation
```javascript
// Example: Create item without required name
// Response: 400 "Please provide an item name"
```

4. **JsonWebTokenError** - Invalid JWT
```javascript
// Example: Malformed token
// Response: 401 "Invalid token. Please login again."
```

5. **TokenExpiredError** - Expired JWT
```javascript
// Example: Token older than 7 days
// Response: 401 "Token expired. Please login again."
```

**Stack Trace in Development**:
```javascript
...(process.env.NODE_ENV === 'development' && { stack: err.stack })
```
- Shows stack trace only in development
- Helps debugging
- Security: Don't expose in production

### 404 Handler

```javascript
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
};
```

**Purpose**: Handle undefined routes

**Example**:
```
GET /api/nonexistent
Response: 404 "Cannot GET /api/nonexistent"
```

### Async Handler

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

**Purpose**: Wrap async route handlers to catch errors

**Without asyncHandler**:
```javascript
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ data: items });
  } catch (error) {
    // Manual error handling
  }
};
```

**With asyncHandler**:
```javascript
exports.getItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.json({ data: items });
  // Errors automatically caught and passed to error handler
});
```

---

## 4. Middleware Chain Flow

### Protected Route Example
```javascript
router.post('/items',
  protect,              // 1. Verify JWT
  createItemValidation, // 2. Validate input
  validate,             // 3. Check validation results
  createItem           // 4. Controller logic
);
```

**Flow**:
1. **protect** - Checks token, attaches req.user
2. **createItemValidation** - Sets up validation rules
3. **validate** - Checks if validation passed
4. **createItem** - Executes business logic

**Error Scenarios**:
- No token → protect returns 401
- Invalid input → validate returns 400
- Database error → errorHandler returns 500

### Admin Route Example
```javascript
router.delete('/users/:id',
  protect,      // 1. Must be logged in
  authorize('admin'), // 2. Must be admin
  idValidation, // 3. Valid MongoDB ID
  validate,     // 4. Check validation
  deleteUser   // 5. Controller
);
```

---

## 5. Security Features

### Authentication Security
- ✅ JWT verification on every protected request
- ✅ Token expiration enforcement
- ✅ User existence check
- ✅ Active status check
- ✅ Clear error messages (but not too revealing)

### Authorization Security
- ✅ Role-based access control
- ✅ Proper 403 vs 401 usage
- ✅ Customizable role requirements

### Validation Security
- ✅ Input sanitization (trim, normalizeEmail)
- ✅ Type validation (isEmail, isInt, etc.)
- ✅ Length restrictions
- ✅ Range restrictions (min/max)
- ✅ Whitelist values (enum validation)
- ✅ Array validation

### Error Handling Security
- ✅ No stack traces in production
- ✅ Generic error messages for security
- ✅ Proper status codes
- ✅ Logging for monitoring

---

## Files Created in This Step

1. ✅ `src/middleware/auth.js` - Authentication & authorization (98 lines)
2. ✅ `src/middleware/validation.js` - Input validation (109 lines)
3. ✅ `src/middleware/errorHandler.js` - Error handling (75 lines)

**Total**: 3 middleware files, ~282 lines

---

**Step 5 Complete! ✅**

*Next: Step 6 - Controllers Implementation (business logic)*


