# Step 8: Server Configuration

## Overview
This step covers the main server.js file that integrates all components and starts the Express application.

## Date
October 24, 2025

## Objectives
1. Update server.js with all new components
2. Integrate database connection
3. Mount all middleware
4. Mount all routes
5. Set up error handling
6. Configure server startup

---

## 1. Complete server.js File

### File Updated: `server.js`

**Purpose**: Main entry point for the application

**Total Lines**: ~90 lines

**Full Code Structure**:
```javascript
// 1. Imports
// 2. Express app initialization
// 3. Database connection
// 4. Middleware setup
// 5. Route mounting
// 6. Error handling
// 7. Server startup
// 8. Process event handlers
```

### Section 1: Imports

```javascript
// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/database');
const corsOptions = require('./src/config/cors');
const { apiLimiter } = require('./src/config/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');
```

**Key Imports**:
1. `dotenv` - Load environment variables first
2. `express` - Web framework
3. `cors`, `helmet`, `morgan` - Security & logging middleware
4. `connectDB` - Database connection function
5. `corsOptions` - CORS configuration
6. `apiLimiter` - Rate limiting
7. `errorHandler`, `notFound` - Error handling
8. `logger` - Custom logger utility

**dotenv.config() Position**:
- Must be first to load .env variables
- Makes process.env.* available

### Section 2: App Initialization & Database

```javascript
// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();
```

**Execution Order**:
1. Create Express app instance
2. Connect to database immediately
3. Database connection is async but doesn't block server startup

**Why connect before routes?**
- Models need database connection
- Fail fast if database unavailable
- Clear error if connection fails

### Section 3: Security Middleware

```javascript
// Security Middleware
app.use(helmet()); // Set security headers

// CORS
app.use(cors(corsOptions)); // Enable CORS with options
```

**helmet()**:
Sets multiple security headers:
- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- Strict-Transport-Security
- X-Download-Options
- X-Content-Type-Options
- X-Permitted-Cross-Domain-Policies
- Referrer-Policy
- X-XSS-Protection

**cors(corsOptions)**:
- Configured with specific origin
- Allows credentials (JWT)
- Restricted to necessary headers and methods

### Section 4: Body Parser Middleware

```javascript
// Body Parser Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
```

**express.json()**:
- Parses incoming requests with JSON payloads
- Available under `req.body`
- Content-Type: application/json

**express.urlencoded({ extended: true })**:
- Parses URL-encoded data
- `extended: true` allows rich objects and arrays
- Used for form submissions

**Example**:
```javascript
// POST request with JSON
{ "name": "John", "email": "john@test.com" }
// Available as: req.body.name, req.body.email
```

### Section 5: Logging Middleware

```javascript
// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Development logging
} else {
  app.use(morgan('combined')); // Production logging
}
```

**Development Format (dev)**:
```
GET /api/items 200 15.234 ms - 1024
```
- Colored output
- Concise format
- Response time

**Production Format (combined)**:
```
::1 - - [24/Oct/2025:10:30:45 +0000] "GET /api/items HTTP/1.1" 200 1024
```
- Apache combined log format
- IP address, timestamp
- Full request details
- For log analysis tools

### Section 6: Rate Limiting

```javascript
// Rate Limiting
app.use('/api/', apiLimiter);
```

**Applied to**: All routes starting with /api/
**Limit**: 100 requests per 15 minutes per IP
**Excludes**: Root route (/) and /health

**Why /api/ prefix?**
- Protects all API endpoints
- Allows unlimited access to documentation
- Health checks not rate-limited

### Section 7: Route Mounting

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

**Route Prefixes**:
- `/api/auth` - Authentication endpoints
- `/api/users` - User management endpoints
- `/api/items` - Item CRUD endpoints
- `/api` - API info and health

**Order Matters**:
- Specific routes before general routes
- `/api/auth` before `/api`
- Otherwise `/api` would catch everything

**Example Matching**:
```
POST /api/auth/register → authRoutes
GET /api/users/123 → userRoutes
GET /api/items → itemRoutes
GET /api → apiRoutes
```

### Section 8: Home Route

```javascript
// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Express REST API Server',
    version: '2.0.0',
    status: 'running',
    documentation: '/api',
    endpoints: {
      api: '/api',
      auth: '/api/auth',
      users: '/api/users',
      items: '/api/items',
      health: '/api/health',
    },
  });
});
```

**Purpose**: Welcome message and quick links
**URL**: `http://localhost:3000/`
**Access**: Public, no rate limiting

### Section 9: Health Check Route

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});
```

**Purpose**: Server status monitoring
**URL**: `http://localhost:3000/health`
**Access**: Public, no rate limiting

**Includes**:
- Timestamp: Current server time
- Uptime: Seconds since server started
- Environment: Current mode

**Use Cases**:
- Health checks by load balancers
- Monitoring systems
- Deployment verification
- Uptime tracking

### Section 10: Error Handlers

```javascript
// 404 handler (must be after all routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);
```

**Order Critical**:
1. All routes defined first
2. 404 handler catches undefined routes
3. Error handler catches all errors

**notFound**:
- Catches requests to undefined routes
- Returns 404 with helpful message

**errorHandler**:
- Catches all errors from routes
- Formats error responses
- Logs errors
- Hides stack traces in production

### Section 11: Server Startup

```javascript
// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`📍 Local: http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});
```

**Configuration**:
- PORT from environment or default 3000
- NODE_ENV from environment or default development

**server variable**:
- Stored for graceful shutdown
- Used in error handlers below

**Startup Logs**:
- Shows environment mode
- Shows server URL
- Shows documentation URL

**Console Output**:
```
🚀 Server is running in development mode on port 3000
📍 Local: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
```

### Section 12: Process Event Handlers

```javascript
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});
```

**unhandledRejection**:
- Catches promise rejections not caught by .catch()
- Logs error
- Gracefully closes server
- Exits with error code

**Example**:
```javascript
// Unhandled promise rejection
Promise.reject(new Error('Something went wrong'));
// Caught by unhandledRejection handler
```

**uncaughtException**:
- Catches synchronous exceptions
- Logs error
- Exits immediately

**Why exit?**
- Application is in unknown state
- Better to restart cleanly
- Prevents undefined behavior

**Production**:
- Process managers (PM2, Docker) restart automatically
- Kubernetes restarts pods
- System remains healthy

### Section 13: Export

```javascript
module.exports = app;
```

**Purpose**: Export app for testing
**Used by**: Test suites (if added later)

---

## 2. Middleware Order

### Complete Middleware Chain

1. **dotenv.config()** - Load environment variables
2. **connectDB()** - Connect to MongoDB
3. **helmet()** - Set security headers
4. **cors()** - Enable CORS
5. **express.json()** - Parse JSON bodies
6. **express.urlencoded()** - Parse URL-encoded bodies
7. **morgan()** - Log requests
8. **apiLimiter** - Rate limiting (on /api/*)
9. **Routes** - Application routes
10. **notFound** - 404 handler
11. **errorHandler** - Error handler

### Why This Order?

**Security First**:
- helmet() and cors() before routes
- Protect all endpoints

**Body Parsing Early**:
- Needed by routes to read request data
- Must be before route handlers

**Logging After Body Parsing**:
- Can log request bodies if needed
- Sees full request information

**Rate Limiting Before Routes**:
- Blocks excessive requests early
- Reduces load on application

**Routes in Middle**:
- After all processing middleware
- Before error handling

**Error Handlers Last**:
- Catch errors from all previous middleware
- Must be after routes to catch route errors

---

## 3. Environment Variables Used

### In server.js
```env
PORT=3000              # Server port
NODE_ENV=development   # Environment mode
MONGODB_URI=...        # Database connection (via connectDB)
CLIENT_URL=...         # CORS origin (via corsOptions)
RATE_LIMIT_*=...       # Rate limiting (via apiLimiter)
```

### Loading Order
1. dotenv.config() loads .env file
2. Variables available in process.env
3. Used throughout application

---

## 4. Request Flow Through Server

### Example: POST /api/items

1. **Request arrives** at Express
2. **helmet()** adds security headers
3. **cors()** checks origin, adds CORS headers
4. **express.json()** parses JSON body
5. **morgan()** logs request
6. **apiLimiter** checks rate limit
7. **Router matching** finds item routes
8. **Item routes** run middleware chain:
   - protect (auth)
   - createItemValidation (validation)
   - validate (check results)
   - createItem (controller)
9. **Controller** processes request
10. **Response sent** to client

### If Error Occurs

```
Error in controller → errorHandler → formatted error response
```

---

## 5. Server Startup Sequence

1. **Load environment variables** (dotenv)
2. **Create Express app**
3. **Connect to MongoDB**
4. **Apply middleware** (helmet, cors, body parser, morgan, rate limiter)
5. **Mount routes**
6. **Add error handlers**
7. **Start listening** on port
8. **Log startup info**
9. **Ready to receive requests**

### Startup Time
- Typically 1-3 seconds
- MongoDB connection: 0.5-2 seconds
- Middleware setup: < 0.5 seconds

---

## 6. Graceful Shutdown

### Why Important?
- Finish processing current requests
- Close database connections
- Clean up resources
- Prevent data corruption

### Implementation
```javascript
server.close(() => process.exit(1));
```

1. Stop accepting new connections
2. Wait for existing requests to complete
3. Close server
4. Exit process

### Production Considerations
- Process manager restarts automatically
- Kubernetes handles pod lifecycle
- Docker stops container gracefully
- Zero-downtime deployments possible

---

## 7. Server Configuration Best Practices

### ✅ Implemented

- **Environment-based configuration** - Different settings for dev/prod
- **Fail fast** - Exit if database connection fails
- **Centralized error handling** - Single error handler
- **Security headers** - Helmet protection
- **CORS configured** - Not open to all origins
- **Rate limiting** - Prevent abuse
- **Logging** - Different formats for dev/prod
- **Health check** - Monitoring endpoint
- **Graceful error handling** - Process event handlers
- **Documentation endpoint** - Self-documenting API

---

## 8. Testing Server Locally

### Start Server
```bash
npm run dev
```

### Expected Console Output
```
✅ MongoDB Connected: localhost
📊 Database: express-rest-api
🚀 Server is running in development mode on port 3000
📍 Local: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
```

### Quick Tests
```bash
# Test home route
curl http://localhost:3000/

# Test health check
curl http://localhost:3000/health

# Test API documentation
curl http://localhost:3000/api

# Test 404
curl http://localhost:3000/nonexistent

# Test rate limiting (make 101 rapid requests)
for i in {1..101}; do curl http://localhost:3000/api/health; done
```

---

## 9. Server Configuration Summary

### Core Features
- ✅ Express 4.x
- ✅ MongoDB connection
- ✅ Security headers (Helmet)
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Request logging
- ✅ Error handling
- ✅ Health monitoring

### Middleware Count
- **Security**: 2 (helmet, cors)
- **Parsing**: 2 (json, urlencoded)
- **Logging**: 1 (morgan)
- **Rate Limiting**: 1 (apiLimiter)
- **Error Handling**: 2 (notFound, errorHandler)
- **Total**: 8 middleware

### Routes Mounted
- Authentication: /api/auth
- Users: /api/users
- Items: /api/items
- API Info: /api

### Environment Variables
- PORT
- NODE_ENV
- MONGODB_URI
- JWT_SECRET
- CLIENT_URL
- RATE_LIMIT_*

---

## Files Modified in This Step

1. ✅ `server.js` - Complete rewrite (~90 lines)

---

**Step 8 Complete! ✅**

*Next: Step 9 - Utilities Implementation (logger, helpers)*

