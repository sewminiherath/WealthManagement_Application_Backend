# Step 2: Project Structure Creation

## Overview
This step covers the creation of the professional folder structure following the MVC pattern with a src/ based architecture.

## Date
October 24, 2025

## Objectives
1. Create src/ directory structure
2. Organize code into logical modules
3. Implement MVC pattern for API development
4. Remove old structure
5. Set up proper code organization

---

## 1. Desired Structure

### Target Folder Layout
```
express-rest-api/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
├── server.js            # Entry point
├── package.json
└── .env
```

### Why This Structure?

#### src/ Directory
- **Purpose**: Contains all source code
- **Benefits**:
  - Clear separation from config files
  - Professional standard
  - Easy to build/compile if needed
  - Better organization

#### config/
- **Purpose**: Application configuration
- **Contains**:
  - Database connection
  - JWT configuration
  - CORS settings
  - Rate limiter settings
- **Why**: Centralized configuration management

#### controllers/
- **Purpose**: Business logic layer
- **Contains**:
  - Request handlers
  - Data processing
  - Response formatting
- **Why**: Separation of concerns, MVC pattern

#### middleware/
- **Purpose**: Request/response processing
- **Contains**:
  - Authentication
  - Validation
  - Error handling
- **Why**: Reusable, cross-cutting concerns

#### models/
- **Purpose**: Data structure definition
- **Contains**:
  - Mongoose schemas
  - Model methods
  - Validation rules
- **Why**: Database abstraction, ORM pattern

#### routes/
- **Purpose**: API endpoint definitions
- **Contains**:
  - Route definitions
  - Method handlers
  - Middleware attachment
- **Why**: Clear API structure, Express pattern

#### utils/
- **Purpose**: Helper functions
- **Contains**:
  - Logger
  - Helpers
  - Utilities
- **Why**: Reusable code, DRY principle

---

## 2. PowerShell Commands Executed

### Command 1: Create src Directory
```powershell
New-Item -ItemType Directory -Path "src" -Force
```

**Result**: Created main src/ folder

### Command 2: Create Subdirectories
```powershell
New-Item -ItemType Directory -Path "src\config" -Force
New-Item -ItemType Directory -Path "src\controllers" -Force
New-Item -ItemType Directory -Path "src\middleware" -Force
New-Item -ItemType Directory -Path "src\models" -Force
New-Item -ItemType Directory -Path "src\routes" -Force
New-Item -ItemType Directory -Path "src\utils" -Force
```

**Result**: Created all 6 subdirectories within src/

### PowerShell Output
```
Directory: C:\Users\Sewmini\Desktop\Backend\express-rest-api

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/23/2025   7:40 AM                src

Directory: C:\Users\Sewmini\Desktop\Backend\express-rest-api\src

Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        10/23/2025   7:40 AM                config
d-----        10/23/2025   7:40 AM                controllers
d-----        10/23/2025   7:40 AM                middleware
d-----        10/23/2025   7:40 AM                models
d-----        10/23/2025   7:40 AM                routes
d-----        10/23/2025   7:40 AM                utils
```

---

## 3. Directory Structure Details

### config/
**Purpose**: Application-wide configuration

**Future Files** (to be created in next steps):
- `database.js` - MongoDB connection logic
- `jwt.js` - JWT token utilities (sign, verify)
- `cors.js` - CORS configuration options
- `rateLimiter.js` - Rate limiting configuration

**Responsibilities**:
- Centralize all configuration
- Environment-based settings
- Export configuration objects
- Initialize connections

**Example Pattern**:
```javascript
// config/database.js
const connectDB = async () => {
  // Connection logic
};
module.exports = connectDB;
```

### controllers/
**Purpose**: Handle business logic

**Future Files**:
- `auth.controller.js` - Authentication logic (register, login, logout)
- `user.controller.js` - User management (CRUD)
- `item.controller.js` - Item management (CRUD)

**Responsibilities**:
- Receive requests from routes
- Process business logic
- Interact with models
- Format responses
- Handle errors

**Pattern**:
```javascript
// controllers/item.controller.js
exports.getItems = async (req, res) => {
  // Business logic here
};
```

### middleware/
**Purpose**: Request/response processing pipeline

**Future Files**:
- `auth.js` - Authentication middleware (protect, authorize)
- `validation.js` - Input validation rules
- `errorHandler.js` - Centralized error handling

**Responsibilities**:
- Verify authentication
- Validate inputs
- Handle errors
- Modify req/res objects
- Call next() to continue

**Pattern**:
```javascript
// middleware/auth.js
exports.protect = async (req, res, next) => {
  // Verify token
  // Attach user to request
  next();
};
```

### models/
**Purpose**: Database schema definitions

**Future Files**:
- `User.js` - User schema (name, email, password, role)
- `Item.js` - Item schema (name, description, price, category)

**Responsibilities**:
- Define schema structure
- Set validation rules
- Create indexes
- Add instance methods
- Add static methods
- Define pre/post hooks

**Pattern**:
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ...
});
module.exports = mongoose.model('User', userSchema);
```

### routes/
**Purpose**: API endpoint definitions

**Future Files**:
- `auth.routes.js` - Authentication endpoints
- `user.routes.js` - User endpoints
- `item.routes.js` - Item endpoints
- `api.routes.js` - General API info

**Responsibilities**:
- Define endpoints
- Attach middleware
- Link to controllers
- Group related routes
- Export router

**Pattern**:
```javascript
// routes/item.routes.js
const express = require('express');
const router = express.Router();
const { getItems, createItem } = require('../controllers/item.controller');

router.get('/', getItems);
router.post('/', createItem);

module.exports = router;
```

### utils/
**Purpose**: Reusable helper functions

**Future Files**:
- `logger.js` - Custom logging utility
- `helpers.js` - General helper functions

**Responsibilities**:
- Provide utility functions
- Custom logging
- Data formatting
- Calculations
- Common operations

**Pattern**:
```javascript
// utils/logger.js
const logger = {
  info: (message) => console.log(`[INFO] ${message}`),
  error: (message) => console.error(`[ERROR] ${message}`)
};
module.exports = logger;
```

---

## 4. MVC Pattern Explanation

### What is MVC?

**MVC** = Model-View-Controller

**Adapted for API**: Model-Controller-Route
- **No Views**: APIs return JSON, not HTML
- **Models**: Database schemas
- **Controllers**: Business logic
- **Routes**: Endpoint definitions (replaces views)

### Request Flow

```
1. Client Request → 2. Route → 3. Middleware → 4. Controller → 5. Model → 6. Database
                                                                        ↓
7. Client Response ← 6. Controller ← 5. Model ← 4. Database Response
```

**Detailed Flow**:
1. **Client sends request**: POST /api/items
2. **Route matches**: item.routes.js
3. **Middleware runs**: auth.protect, validation
4. **Controller executes**: createItem in item.controller.js
5. **Model interacts**: Item.create() in Item.js
6. **Database operation**: MongoDB insert
7. **Response flows back**: JSON response to client

### Benefits of MVC

1. **Separation of Concerns**: Each layer has specific responsibility
2. **Maintainability**: Easy to find and fix issues
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add features
5. **Team Collaboration**: Different developers can work on different layers
6. **Code Reusability**: Models and middleware can be reused

---

## 5. Old vs New Structure

### Old Structure (Before)
```
express-rest-api/
├── routes/
│   └── api.js           # Everything in one file
├── server.js
└── package.json
```

**Problems**:
- ❌ All logic in one place
- ❌ Hard to maintain
- ❌ Difficult to scale
- ❌ No separation of concerns
- ❌ Not professional standard

### New Structure (After)
```
express-rest-api/
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Processing pipeline
│   ├── models/          # Data structure
│   ├── routes/          # API endpoints
│   └── utils/           # Helpers
├── server.js            # Entry point
├── package.json
└── .env
```

**Improvements**:
- ✅ Clear separation
- ✅ Easy to maintain
- ✅ Scalable architecture
- ✅ Professional standard
- ✅ Following best practices

---

## 6. File Organization Principles

### 1. Single Responsibility
- Each file has one clear purpose
- Controllers handle specific resources
- Models represent specific entities
- Routes group related endpoints

### 2. Naming Conventions

**Files**:
- Lowercase with hyphens: `auth-controller.js` OR
- CamelCase: `authController.js` OR
- Dot notation: `auth.controller.js` ✅ (We used this)

**Exports**:
- Named exports for multiple functions
- Default export for single entity
- Consistent across project

**Variables**:
- camelCase for variables and functions
- PascalCase for classes and models
- UPPER_CASE for constants

### 3. Module Organization

Each module (auth, user, item) has:
- One model file: `User.js`
- One controller file: `user.controller.js`
- One route file: `user.routes.js`

**Example - User Module**:
```
src/
├── models/User.js              # User schema
├── controllers/user.controller.js  # User logic
└── routes/user.routes.js       # User endpoints
```

---

## 7. Directory Creation Verification

### Command to Verify
```bash
tree /F src
# OR in PowerShell
Get-ChildItem -Path src -Recurse
```

### Expected Output
```
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
└── utils/
```

### Verification Checklist
- ✅ src/ directory created
- ✅ config/ subdirectory exists
- ✅ controllers/ subdirectory exists
- ✅ middleware/ subdirectory exists
- ✅ models/ subdirectory exists
- ✅ routes/ subdirectory exists
- ✅ utils/ subdirectory exists
- ✅ All directories are empty (ready for files)

---

## 8. Next Steps Planning

### Files to Create Next

**Step 3 - Configuration Files (4 files)**:
1. src/config/database.js
2. src/config/jwt.js
3. src/config/cors.js
4. src/config/rateLimiter.js

**Step 4 - Models (2 files)**:
1. src/models/User.js
2. src/models/Item.js

**Step 5 - Middleware (3 files)**:
1. src/middleware/auth.js
2. src/middleware/validation.js
3. src/middleware/errorHandler.js

**Step 6 - Controllers (3 files)**:
1. src/controllers/auth.controller.js
2. src/controllers/user.controller.js
3. src/controllers/item.controller.js

**Step 7 - Routes (4 files)**:
1. src/routes/auth.routes.js
2. src/routes/user.routes.js
3. src/routes/item.routes.js
4. src/routes/api.routes.js

**Step 8 - Utilities (2 files)**:
1. src/utils/logger.js
2. src/utils/helpers.js

**Step 9 - Update Server**:
1. Update server.js to use new structure

**Total**: 18 new files to create

---

## 9. Architecture Benefits

### Scalability
- Easy to add new resources (just add model/controller/route)
- Can split into microservices later
- Clear boundaries between components

### Maintainability
- Easy to find specific functionality
- Changes are localized
- Reduced code duplication

### Testability
- Each layer can be unit tested
- Mock dependencies easily
- Integration tests are clearer

### Team Collaboration
- Multiple developers can work simultaneously
- Clear ownership of components
- Merge conflicts reduced

### Best Practices
- Industry standard structure
- Easy for new developers to understand
- Follows Express.js conventions
- Aligns with Node.js patterns

---

## 10. Common Patterns Used

### 1. Module Exports Pattern
```javascript
// Single export
module.exports = connectDB;

// Multiple exports
module.exports = {
  protect,
  authorize
};

// Named exports
exports.register = async (req, res) => { };
```

### 2. Route-Controller Pattern
```javascript
// routes/item.routes.js
const { getItems } = require('../controllers/item.controller');
router.get('/', getItems);

// controllers/item.controller.js
exports.getItems = async (req, res) => {
  // Logic here
};
```

### 3. Middleware Chain Pattern
```javascript
router.post('/', 
  protect,           // Authentication
  validation,        // Validation
  createItem         // Controller
);
```

### 4. Error Handling Pattern
```javascript
// Using async handler
const asyncHandler = require('../middleware/errorHandler');

exports.getItems = asyncHandler(async (req, res) => {
  // Logic here
  // Errors automatically caught
});
```

---

## 11. Removed Old Structure

### Files Removed
- ✅ `routes/api.js` - Old routes file deleted
- ✅ `routes/` directory - Old directory removed

### Why Remove?
- Replaced by new src/routes/ structure
- Old file had in-memory storage (not needed)
- Starting fresh with database integration
- Avoid confusion with old code

### Verification
```powershell
# Old routes folder no longer exists
Test-Path routes  # Returns False
```

---

## 12. Design Decisions

### Why src/ instead of root?
**Pros**:
- ✅ Professional standard
- ✅ Clear source code location
- ✅ Easy to build/compile
- ✅ Better for large projects

**Cons**:
- Slightly longer import paths
- Extra directory level

**Decision**: Use src/ for professional appearance

### Why separate config folder?
**Pros**:
- ✅ Centralized configuration
- ✅ Easy to modify settings
- ✅ Environment-specific configs
- ✅ Clear configuration location

**Decision**: Essential for maintainability

### Why separate controllers and routes?
**Pros**:
- ✅ Thin routes, fat controllers
- ✅ Easier testing
- ✅ Reusable business logic
- ✅ Clear separation of concerns

**Decision**: Standard MVC practice

---

## Files Created in This Step

None - only directories created

## Directories Created in This Step

1. ✅ `src/`
2. ✅ `src/config/`
3. ✅ `src/controllers/`
4. ✅ `src/middleware/`
5. ✅ `src/models/`
6. ✅ `src/routes/`
7. ✅ `src/utils/`

**Total**: 7 new directories

---

## Verification Commands

```powershell
# List src directory
Get-ChildItem -Path src

# Verify subdirectories
Test-Path src/config
Test-Path src/controllers
Test-Path src/middleware
Test-Path src/models
Test-Path src/routes
Test-Path src/utils
```

---

**Step 2 Complete! ✅**

*Next: Step 3 - Database Setup and Configuration*


