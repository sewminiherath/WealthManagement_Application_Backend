# Step 3: Database Configuration

## Overview
This step covers creating all configuration files including database connection, JWT utilities, CORS settings, and rate limiting.

## Date
October 24, 2025

## Objectives
1. Set up MongoDB connection with Mongoose
2. Configure JWT token generation and verification
3. Configure CORS for cross-origin requests
4. Set up rate limiting to prevent abuse

---

## 1. Database Connection Configuration

### File Created: `src/config/database.js`

**Purpose**: Establish and manage MongoDB connection using Mongoose

**Full Code**:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

**Code Explanation**:

#### Import Mongoose
```javascript
const mongoose = require('mongoose');
```
- Imports Mongoose library for MongoDB interactions

#### Async Function
```javascript
const connectDB = async () => {
```
- Async function to handle promise-based connection
- Allows use of await keyword

#### Connection Options
```javascript
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

**Options Explained**:
- `useNewUrlParser: true` - Uses new URL parser (MongoDB driver requirement)
- `useUnifiedTopology: true` - Uses new Server Discover and Monitoring engine

#### Success Handling
```javascript
console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
console.log(`📊 Database: ${conn.connection.name}`);
```
- Shows success message with database host
- Displays database name
- Uses emoji for visual clarity

#### Error Handling
```javascript
catch (error) {
  console.error(`❌ Error connecting to MongoDB: ${error.message}`);
  process.exit(1);
}
```
- Catches connection errors
- Logs error message
- Exits process with code 1 (error)
- Prevents running without database

### Environment Variable Used
```env
MONGODB_URI=mongodb://localhost:27017/express-rest-api
```

**Format Parts**:
- `mongodb://` - Protocol
- `localhost` - Host (or Atlas URL)
- `27017` - Port (default MongoDB port)
- `express-rest-api` - Database name

---

## 2. JWT Configuration

### File Created: `src/config/jwt.js`

**Purpose**: Handle JWT token generation and verification

**Full Code**:
```javascript
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
```

**Code Explanation**:

#### Generate Token Function
```javascript
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};
```

**Parameters**:
- `userId` - User's database ID to embed in token

**jwt.sign() Parameters**:
1. **Payload**: `{ id: userId }` - Data to store in token
2. **Secret**: `process.env.JWT_SECRET` - Secret key for signing
3. **Options**: `{ expiresIn: '7d' }` - Token expiration time

**Returns**: Signed JWT token string

**Example Token**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YWJjMTIzIiwiaWF0IjoxNjg4MTIzNDU2LCJleHAiOjE2ODg3MjgyNTZ9.xYzABC123...
```

**Token Structure**:
- Header: Algorithm and type
- Payload: User ID and timestamps
- Signature: Verification signature

#### Verify Token Function
```javascript
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
```

**Purpose**: Verify and decode JWT token

**jwt.verify() Parameters**:
1. **Token**: The JWT string to verify
2. **Secret**: Same secret used to sign

**Returns**:
- **Success**: Decoded payload `{ id: userId, iat: ..., exp: ... }`
- **Failure**: `null` (invalid/expired token)

**Possible Errors Caught**:
- JsonWebTokenError - Invalid token
- TokenExpiredError - Expired token
- NotBeforeError - Token not yet valid

### Environment Variables Used
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

---

## 3. CORS Configuration

### File Created: `src/config/cors.js`

**Purpose**: Configure Cross-Origin Resource Sharing for frontend access

**Full Code**:
```javascript
// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
```

**Code Explanation**:

#### Origin Setting
```javascript
origin: process.env.CLIENT_URL || 'http://localhost:3000',
```
- Specifies which origins can access API
- Uses environment variable for flexibility
- Defaults to localhost:3000 for development

**Production Example**:
```env
CLIENT_URL=https://myapp.com
```

#### Credentials
```javascript
credentials: true,
```
- Allows cookies and authentication headers
- Required for JWT authentication
- Enables sending credentials with requests

#### Options Success Status
```javascript
optionsSuccessStatus: 200,
```
- Response status for OPTIONS requests
- Some browsers (legacy) require 200 instead of 204
- Ensures compatibility

#### Allowed Methods
```javascript
methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
```
- Specifies which HTTP methods are allowed
- **GET**: Read data
- **POST**: Create new data
- **PUT**: Update entire resource
- **PATCH**: Update partial resource
- **DELETE**: Delete resource
- **OPTIONS**: Preflight requests

#### Allowed Headers
```javascript
allowedHeaders: ['Content-Type', 'Authorization'],
```
- **Content-Type**: Specifies request body format (application/json)
- **Authorization**: JWT token (Bearer token)

### Usage in Server
```javascript
const cors = require('cors');
const corsOptions = require('./src/config/cors');

app.use(cors(corsOptions));
```

---

## 4. Rate Limiter Configuration

### File Created: `src/config/rateLimiter.js`

**Purpose**: Prevent API abuse by limiting request frequency

**Full Code**:
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
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
```

**Code Explanation**:

### General API Limiter

#### Window Setting
```javascript
windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
```
- **15 * 60 * 1000** = 15 minutes in milliseconds
- Time window for counting requests
- Resets after window expires

#### Max Requests
```javascript
max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
```
- Maximum 100 requests per window
- Per IP address
- Balances usability and security

#### Error Message
```javascript
message: {
  success: false,
  error: 'Too Many Requests',
  message: 'Too many requests from this IP, please try again later.',
}
```
- Consistent with API error format
- Clear message to user
- HTTP 429 status code

#### Headers
```javascript
standardHeaders: true,   // RateLimit-* headers
legacyHeaders: false,    // X-RateLimit-* headers
```
- **standardHeaders**: Modern rate limit headers
  - `RateLimit-Limit`: Maximum requests
  - `RateLimit-Remaining`: Requests left
  - `RateLimit-Reset`: When limit resets
- **legacyHeaders**: Older X-RateLimit-* format

### Authentication Limiter

**Stricter Limits**:
```javascript
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 5,                     // Only 5 attempts
```

**Why Stricter?**
- Prevents brute force attacks
- Protects login/register endpoints
- Critical security measure

#### Skip Successful Requests
```javascript
skipSuccessfulRequests: true,
```
- Only counts failed login attempts
- Successful logins don't count toward limit
- User-friendly for legitimate users

### Usage Example
```javascript
const { apiLimiter, authLimiter } = require('./src/config/rateLimiter');

// Apply to all API routes
app.use('/api/', apiLimiter);

// Apply to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### Rate Limit Headers Example
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1688123456
```

---

## 5. Configuration Files Summary

| File | Purpose | Exports | Used By |
|------|---------|---------|---------|
| database.js | MongoDB connection | connectDB() | server.js |
| jwt.js | JWT operations | generateToken(), verifyToken() | Controllers, Middleware |
| cors.js | CORS settings | corsOptions object | server.js |
| rateLimiter.js | Rate limiting | apiLimiter, authLimiter | server.js, routes |

---

## 6. Environment Variables Summary

All configuration files use these environment variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/express-rest-api

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 7. Security Considerations

### Database Connection
- ✅ Connection string in environment variable
- ✅ Error handling prevents undefined behavior
- ✅ Exit process if connection fails
- ✅ Logging for monitoring

### JWT Configuration
- ✅ Secret key in environment variable
- ✅ Token expiration enforced
- ✅ Verification catches all errors
- ✅ Returns null on invalid token

### CORS
- ✅ Specific origin (not wildcard *)
- ✅ Limited to necessary methods
- ✅ Limited to necessary headers
- ✅ Environment-based configuration

### Rate Limiting
- ✅ Prevents DDoS attacks
- ✅ Prevents brute force attacks
- ✅ Different limits for different endpoints
- ✅ Clear error messages

---

## 8. Testing Configuration

### Test Database Connection
```javascript
// In server.js
const connectDB = require('./src/config/database');
connectDB();
// Should see: ✅ MongoDB Connected: localhost
```

### Test JWT Generation
```javascript
const { generateToken } = require('./src/config/jwt');
const token = generateToken('user123');
console.log(token);
// Should output: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test JWT Verification
```javascript
const { generateToken, verifyToken } = require('./src/config/jwt');
const token = generateToken('user123');
const decoded = verifyToken(token);
console.log(decoded);
// Should output: { id: 'user123', iat: ..., exp: ... }
```

### Test Rate Limiting
```bash
# Make multiple rapid requests
for i in {1..10}; do curl http://localhost:3000/api/health; done
# Should eventually return 429 Too Many Requests
```

---

## 9. Common Issues and Solutions

### Issue: MongoDB Connection Timeout
**Error**: `MongoServerSelectionError: connect ECONNREFUSED`
**Solutions**:
1. Ensure MongoDB service is running
2. Check MONGODB_URI is correct
3. For Atlas, check IP whitelist
4. Verify network connectivity

### Issue: JWT Secret Not Found
**Error**: `secretOrPrivateKey must have a value`
**Solution**: Ensure JWT_SECRET is set in .env file

### Issue: CORS Errors in Browser
**Error**: `Access-Control-Allow-Origin header`
**Solutions**:
1. Verify CLIENT_URL matches frontend URL
2. Check credentials option is true
3. Ensure CORS middleware is before routes

### Issue: Rate Limit Not Working
**Problem**: Can make unlimited requests
**Solutions**:
1. Check rate limiter is applied to routes
2. Verify middleware order
3. Test with different IP (rate limit is per IP)

---

## Files Created in This Step

1. ✅ `src/config/database.js` - MongoDB connection
2. ✅ `src/config/jwt.js` - JWT utilities
3. ✅ `src/config/cors.js` - CORS configuration
4. ✅ `src/config/rateLimiter.js` - Rate limiting

**Total**: 4 configuration files

---

## Code Statistics

- **Total Lines**: ~100 lines across 4 files
- **Functions**: 3 (connectDB, generateToken, verifyToken)
- **Configuration Objects**: 3 (corsOptions, apiLimiter, authLimiter)

---

**Step 3 Complete! ✅**

*Next: Step 4 - Models Implementation (User and Item schemas)*

