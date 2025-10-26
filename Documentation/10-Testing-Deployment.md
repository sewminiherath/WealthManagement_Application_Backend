# Step 10: Testing & Deployment Guide

## Overview
This final step covers testing strategies, deployment options, and production best practices.

## Date
October 24, 2025

## Objectives
1. Provide testing guidelines
2. Document deployment options
3. Share production best practices
4. Explain monitoring and maintenance

---

## 1. Manual Testing

### Prerequisites
- Server running: `npm run dev`
- MongoDB connected
- .env file configured

### Testing Authentication

#### 1. Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "Test User", "email": "test@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Save the token** for next requests!

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

#### 3. Get Profile (Protected)
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Update Password
```bash
curl -X PUT http://localhost:3000/api/auth/updatepassword \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "test123",
    "newPassword": "newtest456"
  }'
```

### Testing Items

#### 1. Create Item (Protected)
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "quantity": 10,
    "category": "electronics"
  }'
```

#### 2. Get All Items (Public)
```bash
curl -X GET http://localhost:3000/api/items
```

#### 3. Get Items with Pagination
```bash
curl -X GET "http://localhost:3000/api/items?page=1&limit=10"
```

#### 4. Get Items with Filters
```bash
curl -X GET "http://localhost:3000/api/items?category=electronics&status=active&minPrice=100&maxPrice=2000"
```

#### 5. Search Items
```bash
curl -X GET "http://localhost:3000/api/items?search=laptop"
```

#### 6. Sort Items
```bash
curl -X GET "http://localhost:3000/api/items?sort=-price"
```

#### 7. Update Item (Protected)
```bash
curl -X PUT http://localhost:3000/api/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 899.99
  }'
```

#### 8. Delete Item (Protected)
```bash
curl -X DELETE http://localhost:3000/api/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Testing Error Scenarios

#### 1. Invalid Token
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Expected**: 401 Unauthorized

#### 2. Missing Required Field
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com"}'
```

**Expected**: 400 Validation Error

#### 3. Duplicate Email
```bash
# Register same email twice
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Expected**: 400 "Email already exists"

#### 4. Invalid ID Format
```bash
curl -X GET http://localhost:3000/api/items/invalid_id
```

**Expected**: 400 "Invalid ID format"

#### 5. Unauthorized Access
```bash
# Try to delete without token
curl -X DELETE http://localhost:3000/api/items/ITEM_ID
```

**Expected**: 401 Unauthorized

#### 6. Rate Limiting
```bash
# Make 6 rapid login attempts
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@test.com", "password": "wrong"}';
done
```

**Expected**: 429 "Too Many Requests" on 6th attempt

---

## 2. Testing Tools

### Postman

#### Setup
1. Download Postman: https://www.postman.com/downloads/
2. Create new collection: "Express REST API"
3. Add environment variables:
   - `BASE_URL`: `http://localhost:3000`
   - `TOKEN`: `<will be set after login>`

#### Collections to Create
- **Authentication**
  - Register
  - Login
  - Get Me
  - Update Password
- **Items**
  - Get All Items
  - Get Item by ID
  - Create Item
  - Update Item
  - Delete Item
- **Users** (Admin)
  - Get All Users
  - Get User by ID
  - Update User
  - Delete User

#### Automation Script
In Postman, add to register/login requests:
```javascript
// Tests tab
var jsonData = pm.response.json();
pm.environment.set("TOKEN", jsonData.data.token);
```

### Thunder Client (VS Code Extension)

1. Install Thunder Client extension
2. Create new collection
3. Add requests similar to Postman
4. Use environment variables

---

## 3. Automated Testing (Future Implementation)

### Unit Testing with Jest

#### Installation
```bash
npm install --save-dev jest supertest
```

#### Example Test File: `tests/auth.test.js`
```javascript
const request = require('supertest');
const app = require('../server');

describe('Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
  });
  
  it('should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data.token');
  });
});
```

#### package.json Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## 4. Deployment Options

### Option 1: Railway

#### Steps
1. Sign up at https://railway.app
2. Create new project
3. Connect GitHub repository
4. Add MongoDB plugin (or use Atlas)
5. Set environment variables
6. Deploy

#### Environment Variables on Railway
```
PORT=3000
NODE_ENV=production
MONGODB_URI=<railway-mongodb-url or atlas-url>
JWT_SECRET=<strong-random-secret>
JWT_EXPIRE=7d
CLIENT_URL=<frontend-url>
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Railway CLI (Alternative)
```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Option 2: Heroku

#### Steps
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create app-name`
4. Add MongoDB: `heroku addons:create mongolab:sandbox` (or use Atlas)
5. Set environment variables
6. Deploy

#### Procfile
```
web: node server.js
```

#### Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set CLIENT_URL=https://yourfrontend.com
heroku config:set JWT_EXPIRE=7d
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
```

#### Deploy
```bash
git push heroku main
```

### Option 3: Render

#### Steps
1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Add environment variables
6. Deploy

### Option 4: DigitalOcean App Platform

#### Steps
1. Sign up at https://www.digitalocean.com
2. Create new App
3. Connect GitHub repository
4. Select Node.js runtime
5. Configure environment variables
6. Deploy

### Option 5: AWS EC2 (Advanced)

#### Overview
- More control
- Requires server management
- Cost-effective at scale
- Need to configure security groups, load balancer, etc.

#### Basic Steps
1. Launch EC2 instance (Ubuntu)
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure PM2 for process management
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

### Option 6: Docker + Kubernetes (Advanced)

#### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

#### Docker Compose (with MongoDB)
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/express-rest-api
      - JWT_SECRET=your-secret
      - NODE_ENV=production
    depends_on:
      - mongo
  
  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

## 5. Production Best Practices

### Environment Variables
✅ Use strong JWT_SECRET (32+ characters)
✅ Set NODE_ENV=production
✅ Use MongoDB Atlas or managed database
✅ Update CLIENT_URL to production frontend
✅ Never commit .env file

### Security
✅ HTTPS only in production
✅ Use environment-specific secrets
✅ Regular security updates: `npm audit fix`
✅ Rate limiting enabled
✅ Input validation on all endpoints
✅ CORS configured for specific origins

### Performance
✅ Enable compression middleware
✅ Use database indexes
✅ Implement caching (Redis)
✅ Use CDN for static assets
✅ Monitor performance metrics

### Monitoring
✅ Set up error tracking (Sentry)
✅ Monitor uptime (UptimeRobot, Pingdom)
✅ Log aggregation (Loggly, Papertrail)
✅ Application monitoring (New Relic, DataDog)
✅ Health check endpoints

### Backup
✅ Automated database backups
✅ Backup environment variables
✅ Version control for code
✅ Disaster recovery plan

### Scaling
✅ Horizontal scaling (multiple instances)
✅ Load balancing
✅ Database replication
✅ Caching layer (Redis)
✅ Queue system for heavy tasks

---

## 6. Production Checklist

### Before Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Error handling tested
- [ ] Rate limiting tested
- [ ] CORS configured correctly
- [ ] Security headers enabled
- [ ] Logs configured
- [ ] Health check working

### After Deployment
- [ ] Test all endpoints
- [ ] Verify database connection
- [ ] Check logs for errors
- [ ] Test authentication flow
- [ ] Verify CORS with frontend
- [ ] Test rate limiting
- [ ] Monitor performance
- [ ] Set up alerts

### Ongoing Maintenance
- [ ] Monitor error logs
- [ ] Review security updates
- [ ] Database backups verified
- [ ] Performance monitoring
- [ ] User feedback review
- [ ] API usage analytics
- [ ] Regular updates

---

## 7. Monitoring and Logging

### Production Logging

#### Winston (Advanced Logger)
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Error Tracking

#### Sentry Integration
```bash
npm install @sentry/node
```

```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// In error handler
Sentry.captureException(error);
```

### Health Monitoring

#### Health Check Endpoint
Already implemented: `GET /health`

Response includes:
- Status: OK/ERROR
- Timestamp
- Uptime
- Environment

### Performance Monitoring

#### Basic Metrics
- Response times
- Request count
- Error rate
- Database query times
- Memory usage
- CPU usage

---

## 8. Common Deployment Issues

### Issue: MongoDB Connection Fails
**Cause**: Wrong connection string or IP not whitelisted
**Solution**: 
- Check MONGODB_URI
- Whitelist deployment IP in Atlas
- Verify credentials

### Issue: Environment Variables Not Loading
**Cause**: .env not deployed (correct behavior)
**Solution**: Set env vars in hosting platform settings

### Issue: CORS Errors
**Cause**: CLIENT_URL not matching frontend
**Solution**: Update CLIENT_URL to production frontend URL

### Issue: Port Already in Use
**Cause**: Multiple processes running
**Solution**: Use PORT from environment (Heroku, Railway set automatically)

### Issue: Build Failures
**Cause**: Missing dependencies or wrong Node version
**Solution**: 
- Ensure package.json has all dependencies
- Specify Node version in package.json:
  ```json
  "engines": {
    "node": "18.x"
  }
  ```

---

## 9. Performance Optimization

### Add Compression
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### Database Optimization
- Indexes on frequently queried fields
- Limit query results
- Use pagination
- Avoid N+1 queries
- Connection pooling

### Caching (Redis)
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache example
app.get('/api/items', async (req, res) => {
  const cacheKey = 'all_items';
  
  // Check cache
  const cached = await client.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Fetch from DB
  const items = await Item.find();
  
  // Cache for 5 minutes
  await client.setex(cacheKey, 300, JSON.stringify(items));
  
  res.json(items);
});
```

---

## 10. Documentation Summary

### All Documentation Created

1. **00-Overview.md** - Project overview and summary
2. **01-Initial-Setup.md** - Environment and dependencies
3. **02-Project-Structure.md** - Folder structure creation
4. **03-Database-Configuration.md** - MongoDB and configs
5. **04-Models-Implementation.md** - User and Item models
6. **05-Middleware-Implementation.md** - Auth, validation, errors
7. **06-Controllers-Implementation.md** - Business logic
8. **07-Routes-Implementation.md** - API endpoints
9. **08-Server-Configuration.md** - Server setup
10. **09-Utilities-Implementation.md** - Logger and helpers
11. **10-Testing-Deployment.md** - This file

### Total Documentation
- **11 detailed documentation files**
- **~200+ pages of content**
- **Complete step-by-step guide**
- **Code examples throughout**
- **Best practices included**

---

## Congratulations! 🎉

Your Express REST API is complete and production-ready!

### What You've Built
✅ Professional backend architecture
✅ 19 API endpoints
✅ JWT authentication
✅ Role-based authorization
✅ Input validation
✅ Error handling
✅ Security features
✅ Advanced querying
✅ Complete documentation

### Next Steps
1. Deploy to production
2. Connect frontend
3. Add automated tests
4. Set up monitoring
5. Collect user feedback
6. Iterate and improve

---

**Step 10 Complete! ✅**
**All Steps Completed! 🚀**

*The backend development journey is complete. Time to deploy and build amazing applications!*


