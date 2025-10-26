# Step 7: Routes Implementation

## Overview
This step covers creating all API route definitions with proper middleware chains for authentication, validation, and rate limiting.

## Date
October 24, 2025

## Objectives
1. Create authentication routes
2. Create user management routes
3. Create item management routes
4. Create API info routes
5. Attach proper middleware to each route

---

## 1. Authentication Routes

### File Created: `src/routes/auth.routes.js`

**Purpose**: Define all authentication endpoints

**Full Code**:
```javascript
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate,
} = require('../middleware/validation');
const { authLimiter } = require('../config/rateLimiter');

// Public routes
router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
```

### Route Breakdown

#### POST /api/auth/register
```javascript
router.post('/register', authLimiter, registerValidation, validate, register);
```

**Middleware Chain**:
1. `authLimiter` - 5 requests per 15 min (prevent spam)
2. `registerValidation` - Validate name, email, password
3. `validate` - Check validation results
4. `register` - Controller creates user

**Access**: Public
**Body**: `{ name, email, password }`
**Response**: User object + JWT token

#### POST /api/auth/login
```javascript
router.post('/login', authLimiter, loginValidation, validate, login);
```

**Middleware Chain**:
1. `authLimiter` - 5 requests per 15 min (prevent brute force)
2. `loginValidation` - Validate email, password
3. `validate` - Check validation results
4. `login` - Controller verifies credentials

**Access**: Public
**Body**: `{ email, password }`
**Response**: User object + JWT token

#### GET /api/auth/me
```javascript
router.get('/me', protect, getMe);
```

**Middleware Chain**:
1. `protect` - Verify JWT token
2. `getMe` - Controller returns user profile

**Access**: Private (requires token)
**Headers**: `Authorization: Bearer <token>`
**Response**: Current user object

#### PUT /api/auth/updatepassword
```javascript
router.put('/updatepassword', protect, updatePassword);
```

**Middleware Chain**:
1. `protect` - Verify JWT token
2. `updatePassword` - Controller updates password

**Access**: Private
**Body**: `{ currentPassword, newPassword }`
**Response**: New JWT token

---

## 2. User Routes

### File Created: `src/routes/user.routes.js`

**Purpose**: Define user management endpoints

**Full Code**:
```javascript
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');

// User profile route
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), idValidation, validate, getUser);
router.put('/:id', protect, authorize('admin'), idValidation, validate, updateUser);
router.delete('/:id', protect, authorize('admin'), idValidation, validate, deleteUser);

module.exports = router;
```

### Route Breakdown

#### PUT /api/users/profile
```javascript
router.put('/profile', protect, updateProfile);
```

**Middleware Chain**:
1. `protect` - Verify JWT
2. `updateProfile` - Update own profile

**Access**: Private (any authenticated user)
**Body**: `{ name, email }`
**Response**: Updated user object

#### GET /api/users
```javascript
router.get('/', protect, authorize('admin'), getAllUsers);
```

**Middleware Chain**:
1. `protect` - Verify JWT
2. `authorize('admin')` - Must be admin role
3. `getAllUsers` - Return all users

**Access**: Admin only
**Response**: Array of all users

#### GET /api/users/:id
```javascript
router.get('/:id', protect, authorize('admin'), idValidation, validate, getUser);
```

**Middleware Chain**:
1. `protect` - Verify JWT
2. `authorize('admin')` - Must be admin
3. `idValidation` - Validate MongoDB ID format
4. `validate` - Check validation
5. `getUser` - Return specific user

**Access**: Admin only
**Response**: Single user object

#### PUT /api/users/:id
```javascript
router.put('/:id', protect, authorize('admin'), idValidation, validate, updateUser);
```

**Access**: Admin only
**Body**: `{ name, email, role, isActive }`
**Response**: Updated user

#### DELETE /api/users/:id
```javascript
router.delete('/:id', protect, authorize('admin'), idValidation, validate, deleteUser);
```

**Access**: Admin only
**Response**: Success message

---

## 3. Item Routes

### File Created: `src/routes/item.routes.js`

**Purpose**: Define item CRUD endpoints with advanced features

**Full Code**:
```javascript
const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} = require('../controllers/item.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  createItemValidation,
  updateItemValidation,
  idValidation,
  paginationValidation,
  validate,
} = require('../middleware/validation');

// Public routes (with optional authentication)
router.get('/', optionalAuth, paginationValidation, validate, getAllItems);
router.get('/:id', optionalAuth, idValidation, validate, getItem);

// Protected routes
router.post('/', protect, createItemValidation, validate, createItem);
router.put('/:id', protect, idValidation, updateItemValidation, validate, updateItem);
router.delete('/:id', protect, idValidation, validate, deleteItem);

// Admin only routes
router.delete('/', protect, authorize('admin'), deleteAllItems);

module.exports = router;
```

### Route Breakdown

#### GET /api/items
```javascript
router.get('/', optionalAuth, paginationValidation, validate, getAllItems);
```

**Middleware Chain**:
1. `optionalAuth` - Attach user if logged in (optional)
2. `paginationValidation` - Validate query params
3. `validate` - Check validation
4. `getAllItems` - Return paginated items

**Access**: Public (optional authentication for extra features)

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `category` - Filter by category
- `status` - Filter by status
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name/description
- `sort` - Sort fields (e.g., "-price", "name")

**Example URLs**:
```
GET /api/items
GET /api/items?page=2&limit=20
GET /api/items?category=electronics&status=active
GET /api/items?minPrice=100&maxPrice=1000
GET /api/items?search=laptop&sort=-price
GET /api/items?category=books&page=1&limit=50&sort=name
```

#### GET /api/items/:id
```javascript
router.get('/:id', optionalAuth, idValidation, validate, getItem);
```

**Middleware Chain**:
1. `optionalAuth` - Optional authentication
2. `idValidation` - Validate MongoDB ID
3. `validate` - Check validation
4. `getItem` - Return single item

**Access**: Public
**Example**: `GET /api/items/64abc123def456`

#### POST /api/items
```javascript
router.post('/', protect, createItemValidation, validate, createItem);
```

**Middleware Chain**:
1. `protect` - Must be logged in
2. `createItemValidation` - Validate all fields
3. `validate` - Check validation
4. `createItem` - Create new item

**Access**: Private (any authenticated user)
**Body**:
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "quantity": 10,
  "category": "electronics",
  "tags": ["computer", "tech"]
}
```

#### PUT /api/items/:id
```javascript
router.put('/:id', protect, idValidation, updateItemValidation, validate, updateItem);
```

**Middleware Chain**:
1. `protect` - Must be logged in
2. `idValidation` - Validate ID
3. `updateItemValidation` - Validate update fields
4. `validate` - Check validation
5. `updateItem` - Update item (with ownership check)

**Access**: Private (owner or admin)
**Body**: Any field(s) to update

#### DELETE /api/items/:id
```javascript
router.delete('/:id', protect, idValidation, validate, deleteItem);
```

**Access**: Private (owner or admin)

#### DELETE /api/items
```javascript
router.delete('/', protect, authorize('admin'), deleteAllItems);
```

**Access**: Admin only
**Purpose**: Delete all items (utility/reset)

---

## 4. API Info Routes

### File Created: `src/routes/api.routes.js`

**Purpose**: Provide API documentation and health check

**Full Code**:
```javascript
const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Express REST API',
    version: '2.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        updatePassword: 'PUT /api/auth/updatepassword',
      },
      items: {
        getAll: 'GET /api/items',
        getOne: 'GET /api/items/:id',
        create: 'POST /api/items',
        update: 'PUT /api/items/:id',
        delete: 'DELETE /api/items/:id',
      },
      users: {
        getAll: 'GET /api/users (Admin only)',
        getOne: 'GET /api/users/:id (Admin only)',
        update: 'PUT /api/users/:id (Admin only)',
        delete: 'DELETE /api/users/:id (Admin only)',
        updateProfile: 'PUT /api/users/profile',
      },
    },
  });
});

module.exports = router;
```

### Routes

#### GET /api/health
**Purpose**: Health check endpoint
**Response**: Status and uptime

#### GET /api
**Purpose**: API documentation overview
**Response**: List of all endpoints

---

## 5. Route Mounting (in server.js)

```javascript
// Import routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const itemRoutes = require('./src/routes/item.routes');
const apiRoutes = require('./src/routes/api.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api', apiRoutes);
```

**Base URLs**:
- Authentication: `/api/auth/*`
- Users: `/api/users/*`
- Items: `/api/items/*`
- API Info: `/api/*`

---

## 6. Complete Endpoint List

### Authentication Endpoints (4)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/me | Private | Get current user |
| PUT | /api/auth/updatepassword | Private | Update password |

### User Endpoints (5)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | /api/users | Admin | Get all users |
| GET | /api/users/:id | Admin | Get user by ID |
| PUT | /api/users/:id | Admin | Update user |
| DELETE | /api/users/:id | Admin | Delete user |
| PUT | /api/users/profile | Private | Update own profile |

### Item Endpoints (6)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | /api/items | Public | Get all items (pagination) |
| GET | /api/items/:id | Public | Get single item |
| POST | /api/items | Private | Create item |
| PUT | /api/items/:id | Private | Update item (owner/admin) |
| DELETE | /api/items/:id | Private | Delete item (owner/admin) |
| DELETE | /api/items | Admin | Delete all items |

### System Endpoints (4)
| Method | Endpoint | Access | Purpose |
|--------|----------|--------|---------|
| GET | / | Public | Welcome message |
| GET | /api | Public | API documentation |
| GET | /health | Public | Server health check |
| GET | /api/health | Public | API health check |

**Total**: 19 endpoints

---

## 7. Middleware Order Importance

### Correct Order
```javascript
router.post('/', 
  protect,          // 1. Authentication
  authorize('admin'), // 2. Authorization
  validation,       // 3. Validation
  controller       // 4. Business logic
);
```

### Why Order Matters
1. **Authentication first** - No point validating if not logged in
2. **Authorization second** - Check permissions before processing
3. **Validation third** - Validate input before DB operations
4. **Controller last** - Execute business logic

---

## 8. Rate Limiting Strategy

### Auth Endpoints
- **Limiter**: `authLimiter`
- **Limit**: 5 requests per 15 minutes
- **Purpose**: Prevent brute force attacks
- **Applied to**: login, register

### General API
- **Limiter**: `apiLimiter`
- **Limit**: 100 requests per 15 minutes
- **Purpose**: Prevent abuse
- **Applied to**: All /api/* routes (in server.js)

---

## 9. Validation Strategy

### Field-Level Validation
- Applied before controller
- Catches invalid data early
- Clear error messages
- Client-friendly

### Database-Level Validation
- Mongoose schema validation
- Final safety net
- Enforces data integrity

### Both Layers
Why both?
- **Field validation**: User-friendly errors
- **Schema validation**: Data integrity guarantee

---

## 10. Route Protection Levels

### Public Routes
- No authentication required
- Anyone can access
- Examples: login, register, get items

### Private Routes
- Authentication required
- Any logged-in user
- Examples: create item, update profile

### Admin Routes
- Authentication + admin role required
- Restricted access
- Examples: get all users, delete user

### Owner/Admin Routes
- Authentication + (owner OR admin)
- Ownership check in controller
- Examples: update/delete own items

---

## Files Created in This Step

1. ✅ `src/routes/auth.routes.js` - Authentication routes (4 endpoints)
2. ✅ `src/routes/user.routes.js` - User routes (5 endpoints)
3. ✅ `src/routes/item.routes.js` - Item routes (6 endpoints)
4. ✅ `src/routes/api.routes.js` - API info routes (2 endpoints)

**Total**: 4 route files, 17 API endpoints

---

**Step 7 Complete! ✅**

*Next: Step 8 - Server Configuration (integrating everything)*


