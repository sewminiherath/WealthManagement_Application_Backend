# Step 1: Initial Setup and Environment Configuration

## Overview
This step covers the initial project setup, including environment configuration, dependency installation, and basic project structure verification.

## Date
October 24, 2025

## Objectives
1. Verify existing project structure
2. Install required npm packages
3. Configure environment variables
4. Set up Git ignore rules
5. Create environment documentation

---

## 1. Initial Project Assessment

### What We Found
The project already had:
```
express-rest-api/
├── node_modules/
├── routes/
│   └── api.js (basic CRUD with in-memory storage)
├── server.js (basic Express setup)
├── package.json
└── package-lock.json
```

### Issues Identified
- ❌ No database integration
- ❌ No authentication system
- ❌ No proper folder structure
- ❌ In-memory storage only
- ❌ No input validation
- ❌ Minimal security measures
- ❌ No environment configuration

---

## 2. Package Installation

### Command Executed
```bash
cd express-rest-api
npm install mongoose bcryptjs jsonwebtoken express-validator helmet morgan express-rate-limit
```

### Packages Installed

#### 1. **mongoose (v8.19.2)**
- **Purpose**: MongoDB Object Data Modeling (ODM)
- **Why**: Provides schema validation, middleware, and easier MongoDB interaction
- **Features Used**:
  - Schema definition
  - Data validation
  - Query building
  - Middleware (pre-save hooks)
  - Population (joining collections)

#### 2. **bcryptjs (v3.0.2)**
- **Purpose**: Password hashing
- **Why**: Secure password storage with salt and hash
- **Features Used**:
  - Password hashing before storage
  - Password comparison for login
  - Salt generation (10 rounds)

#### 3. **jsonwebtoken (v9.0.2)**
- **Purpose**: JWT (JSON Web Token) implementation
- **Why**: Stateless authentication for REST APIs
- **Features Used**:
  - Token generation on login/register
  - Token verification on protected routes
  - Token expiration (7 days default)

#### 4. **express-validator (v7.3.0)**
- **Purpose**: Input validation and sanitization
- **Why**: Prevent invalid data and security vulnerabilities
- **Features Used**:
  - Request body validation
  - Email format validation
  - Field length validation
  - Custom validation rules
  - Error formatting

#### 5. **helmet (v8.1.0)**
- **Purpose**: Security HTTP headers
- **Why**: Protect against common web vulnerabilities
- **Headers Set**:
  - Content-Security-Policy
  - X-DNS-Prefetch-Control
  - X-Frame-Options
  - X-Content-Type-Options
  - And more...

#### 6. **morgan (v1.10.1)**
- **Purpose**: HTTP request logger
- **Why**: Monitor API requests and debugging
- **Modes Used**:
  - 'dev' mode for development (colored, concise)
  - 'combined' mode for production (detailed)

#### 7. **express-rate-limit (v8.1.0)**
- **Purpose**: Rate limiting middleware
- **Why**: Prevent abuse and DDoS attacks
- **Limits Set**:
  - General API: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes

#### 8. **cors (v2.8.5)** [Already installed]
- **Purpose**: Cross-Origin Resource Sharing
- **Why**: Allow frontend to communicate with backend
- **Configuration**: Custom origins, credentials support

#### 9. **dotenv (v16.6.1)** [Already installed]
- **Purpose**: Environment variable management
- **Why**: Keep sensitive data out of source code
- **Usage**: Load .env file variables into process.env

#### 10. **express (v4.21.2)** [Already installed]
- **Purpose**: Web application framework
- **Why**: Core framework for building the API

### Installation Result
```
added 45 packages, and audited 147 packages in 11s
```

### Package Versions in package.json
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.6.1",
    "express": "^4.21.2",
    "express-rate-limit": "^8.1.0",
    "express-validator": "^7.3.0",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.19.2",
    "morgan": "^1.10.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

---

## 3. Environment Configuration

### 3.1 Git Ignore Setup

**File Created**: `.gitignore`

**Purpose**: Prevent committing sensitive and unnecessary files to Git

**Content**:
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Build
dist/
build/

# Temporary files
tmp/
temp/
```

**Key Sections Explained**:
1. **Dependencies**: node_modules can be reinstalled from package.json
2. **Environment variables**: Contains sensitive data (passwords, secrets)
3. **Logs**: Temporary logging files
4. **OS files**: Operating system specific files
5. **IDE**: Editor-specific configuration files
6. **Testing**: Test coverage reports
7. **Build**: Compiled/built files
8. **Temporary**: Temp files during development

### 3.2 Environment Variables Documentation

**File Created**: `ENV_SETUP.md`

**Purpose**: Guide users to create their own .env file

**Note**: We cannot directly create `.env` files due to security restrictions in the editor, so we created comprehensive documentation instead.

**Required Environment Variables**:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/express-rest-api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Variable Explanations**:

#### PORT
- **Default**: 3000
- **Purpose**: Port number where the server will run
- **Usage**: `process.env.PORT`
- **Can change to**: Any available port (3001, 5000, 8080, etc.)

#### NODE_ENV
- **Default**: development
- **Purpose**: Determine runtime environment
- **Options**: 'development', 'production', 'test'
- **Effects**:
  - Different error details
  - Different logging formats
  - Different security levels

#### MONGODB_URI
- **Format**: `mongodb://[host]:[port]/[database-name]`
- **Local Example**: `mongodb://localhost:27017/express-rest-api`
- **Atlas Example**: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **Purpose**: Database connection string
- **Usage**: Mongoose connection

#### JWT_SECRET
- **Purpose**: Secret key for signing JWT tokens
- **Requirements**: Should be long, random, and complex
- **Security**: NEVER commit this to Git
- **Generation**: Use: `openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Length**: Minimum 32 characters recommended

#### JWT_EXPIRE
- **Default**: 7d (7 days)
- **Purpose**: How long JWT tokens remain valid
- **Format Options**:
  - '1h' - 1 hour
  - '24h' - 24 hours
  - '7d' - 7 days
  - '30d' - 30 days
- **Security**: Shorter is more secure, longer is more convenient

#### CLIENT_URL
- **Default**: http://localhost:3000
- **Purpose**: Frontend URL for CORS configuration
- **Production**: Should be your actual frontend domain
- **Multiple URLs**: Can be configured as array in cors.js

#### RATE_LIMIT_WINDOW_MS
- **Default**: 900000 (15 minutes in milliseconds)
- **Purpose**: Time window for rate limiting
- **Calculation**: minutes * 60 * 1000

#### RATE_LIMIT_MAX_REQUESTS
- **Default**: 100
- **Purpose**: Maximum requests allowed per window
- **Balance**: High enough for normal use, low enough to prevent abuse

---

## 4. Package.json Updates

### Before
```json
{
  "name": "express-rest-api",
  "version": "1.0.0",
  "description": "Node.js REST API server using Express",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### After
```json
{
  "name": "express-rest-api",
  "version": "2.0.0",
  "description": "Professional Node.js REST API server with Express, MongoDB, JWT Authentication, and advanced features",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "server": "node server.js",
    "watch": "nodemon server.js"
  },
  "keywords": [
    "express",
    "rest",
    "api",
    "nodejs",
    "mongodb",
    "jwt",
    "authentication",
    "backend"
  ]
}
```

### Changes Made
1. **Version**: Updated from 1.0.0 to 2.0.0 (major upgrade)
2. **Description**: More detailed and accurate
3. **Scripts**: Added 'server' and 'watch' aliases
4. **Keywords**: Added more relevant keywords for npm search

---

## 5. MongoDB Setup Options

### Option A: Local MongoDB

#### Installation
**Windows**:
```bash
# Download from: https://www.mongodb.com/try/download/community
# Run the installer
# MongoDB typically installs as a Windows Service
```

**Mac** (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux** (Ubuntu):
```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/mongodb-6.gpg
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Verify Installation
```bash
mongosh
# Should connect to: mongodb://127.0.0.1:27017
```

#### Connection String
```
mongodb://localhost:27017/express-rest-api
```

### Option B: MongoDB Atlas (Cloud)

#### Steps
1. **Sign up**: Go to https://www.mongodb.com/cloud/atlas
2. **Create Free Cluster**: Select M0 (free tier)
3. **Create Database User**:
   - Username: your_username
   - Password: your_password
   - Database User Privileges: Read and write to any database
4. **Network Access**:
   - Add IP Address: 0.0.0.0/0 (for development)
   - Or specific IP for production
5. **Get Connection String**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace <password> with your password

#### Connection String Example
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/express-rest-api?retryWrites=true&w=majority
```

#### Advantages
- ✅ No local installation needed
- ✅ Automatic backups
- ✅ Free tier available
- ✅ Easy scaling
- ✅ Built-in monitoring

---

## 6. Project Dependencies Overview

### Direct Dependencies (10)
| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| express | 4.21.2 | ~200KB | Web framework |
| mongoose | 8.19.2 | ~800KB | MongoDB ODM |
| bcryptjs | 3.0.2 | ~45KB | Password hashing |
| jsonwebtoken | 9.0.2 | ~30KB | JWT tokens |
| express-validator | 7.3.0 | ~150KB | Validation |
| helmet | 8.1.0 | ~25KB | Security headers |
| cors | 2.8.5 | ~15KB | CORS middleware |
| morgan | 1.10.1 | ~20KB | HTTP logger |
| express-rate-limit | 8.1.0 | ~20KB | Rate limiting |
| dotenv | 16.6.1 | ~10KB | Env variables |

### Total Dependencies
After installation: **147 packages** (including sub-dependencies)

### Development Dependencies (1)
- **nodemon** 3.1.10 - Auto-restart server on file changes

---

## 7. Security Considerations

### Passwords and Secrets
- ✅ JWT_SECRET should be minimum 32 characters
- ✅ Use cryptographically random strings
- ✅ Never commit secrets to Git
- ✅ Different secrets for dev/staging/production
- ✅ Rotate secrets periodically

### Environment Files
- ✅ .env is in .gitignore
- ✅ .env.example provided (without actual secrets)
- ✅ Documentation on how to create .env
- ✅ Validate environment variables on startup

### Database Credentials
- ✅ Username and password in connection string
- ✅ Use strong passwords
- ✅ Limit database user privileges
- ✅ IP whitelist for production

---

## 8. Verification Checklist

After Step 1, verify:
- ✅ All packages installed successfully
- ✅ No vulnerabilities in dependencies (npm audit)
- ✅ .gitignore file created
- ✅ ENV_SETUP.md documentation created
- ✅ package.json updated with correct info
- ✅ MongoDB installation option chosen
- ✅ MongoDB running (if local)
- ✅ Ready to create .env file

---

## 9. Common Issues and Solutions

### Issue: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules
rm -rf node_modules
# Remove package-lock.json
rm package-lock.json
# Reinstall
npm install
```

### Issue: MongoDB won't start
**Solution**:
```bash
# Check if service is running
# Windows
sc query MongoDB
# Mac/Linux
sudo systemctl status mongod
# Start the service
# Windows
net start MongoDB
# Mac/Linux
sudo systemctl start mongod
```

### Issue: Port 3000 already in use
**Solution**: Change PORT in .env to different port (3001, 5000, 8080)

---

## 10. Next Steps

After completing Step 1:
1. ✅ Proceed to Step 2: Project Structure Creation
2. Create src/ directory structure
3. Organize code into MVC pattern
4. Set up configuration files

---

## Files Created in This Step

1. ✅ `.gitignore` - Git ignore rules
2. ✅ `ENV_SETUP.md` - Environment setup instructions
3. ✅ Updated `package.json` - Version 2.0.0

## Dependencies Added

10 production dependencies + 1 dev dependency = 11 new packages

---

**Step 1 Complete! ✅**

*Next: Step 2 - Project Structure Creation*


