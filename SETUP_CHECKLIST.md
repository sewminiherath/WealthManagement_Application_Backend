# ✅ Setup Checklist

Use this checklist to ensure your backend is properly configured and running.

---

## 📋 Pre-Setup Requirements

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MongoDB installed locally OR MongoDB Atlas account
- [ ] Code editor (VS Code, Sublime, etc.)
- [ ] Git installed (optional but recommended)

---

## 🔧 Initial Setup

### Step 1: Dependencies
- [ ] Run `npm install` in the express-rest-api folder
- [ ] Verify no errors during installation
- [ ] Check that `node_modules` folder is created

### Step 2: Environment Configuration
- [ ] Create `.env` file in express-rest-api folder
- [ ] Copy contents from `ENV_SETUP.md`
- [ ] Update `MONGODB_URI` with your MongoDB connection string
- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Verify all environment variables are set

### Step 3: Database Setup

**Option A: Local MongoDB**
- [ ] Install MongoDB Community Server
- [ ] Start MongoDB service
- [ ] Test connection: `mongosh`
- [ ] Use connection string: `mongodb://localhost:27017/express-rest-api`

**Option B: MongoDB Atlas (Cloud)**
- [ ] Create account at mongodb.com/cloud/atlas
- [ ] Create a free cluster
- [ ] Create database user
- [ ] Whitelist your IP (or use 0.0.0.0/0 for testing)
- [ ] Get connection string from Atlas dashboard
- [ ] Update `MONGODB_URI` in `.env`

---

## 🚀 Launch Checklist

### Before First Run
- [ ] `.env` file exists and is complete
- [ ] MongoDB is running/accessible
- [ ] Port 3000 is available (or change PORT in `.env`)
- [ ] All dependencies installed

### Starting the Server
- [ ] Run `npm run dev` for development mode
- [ ] OR run `npm start` for production mode
- [ ] Look for success messages:
  - [ ] "✅ MongoDB Connected"
  - [ ] "🚀 Server is running"
  - [ ] "📍 Local: http://localhost:3000"

### Verify Server is Running
- [ ] Open browser to `http://localhost:3000`
- [ ] Should see welcome JSON message
- [ ] Visit `http://localhost:3000/health`
- [ ] Should see "status": "OK"

---

## 🧪 Testing Checklist

### Test 1: Health Check
- [ ] GET `http://localhost:3000/health`
- [ ] Expect: 200 status, "status": "OK"

### Test 2: API Info
- [ ] GET `http://localhost:3000/api`
- [ ] Expect: List of all endpoints

### Test 3: Register User
- [ ] POST `http://localhost:3000/api/auth/register`
- [ ] Body: `{"name":"Test","email":"test@test.com","password":"test123"}`
- [ ] Expect: 201 status, user object, token
- [ ] Save the token for next tests

### Test 4: Login
- [ ] POST `http://localhost:3000/api/auth/login`
- [ ] Body: `{"email":"test@test.com","password":"test123"}`
- [ ] Expect: 200 status, user object, token

### Test 5: Get Profile (Protected)
- [ ] GET `http://localhost:3000/api/auth/me`
- [ ] Header: `Authorization: Bearer <your-token>`
- [ ] Expect: 200 status, user profile

### Test 6: Create Item (Protected)
- [ ] POST `http://localhost:3000/api/items`
- [ ] Header: `Authorization: Bearer <your-token>`
- [ ] Body: `{"name":"Test Item","price":99.99,"category":"other"}`
- [ ] Expect: 201 status, item object

### Test 7: Get All Items (Public)
- [ ] GET `http://localhost:3000/api/items`
- [ ] Expect: 200 status, array of items

### Test 8: Update Item (Protected)
- [ ] PUT `http://localhost:3000/api/items/<item-id>`
- [ ] Header: `Authorization: Bearer <your-token>`
- [ ] Body: `{"price":79.99}`
- [ ] Expect: 200 status, updated item

### Test 9: Delete Item (Protected)
- [ ] DELETE `http://localhost:3000/api/items/<item-id>`
- [ ] Header: `Authorization: Bearer <your-token>`
- [ ] Expect: 200 status, success message

---

## 🛡️ Security Checklist

- [ ] JWT_SECRET is NOT the default value
- [ ] .env file is in .gitignore
- [ ] MongoDB connection string is secure
- [ ] Rate limiting is enabled
- [ ] CORS is configured properly
- [ ] Helmet security headers are active
- [ ] Passwords are being hashed (check database)
- [ ] Input validation is working

---

## 📁 File Structure Verification

Verify all these files exist:

### Root Files
- [ ] server.js
- [ ] package.json
- [ ] .env
- [ ] .gitignore
- [ ] README.md
- [ ] API_EXAMPLES.md
- [ ] QUICKSTART.md
- [ ] ENV_SETUP.md
- [ ] PROJECT_SUMMARY.md
- [ ] SETUP_CHECKLIST.md

### src/config/
- [ ] database.js
- [ ] jwt.js
- [ ] cors.js
- [ ] rateLimiter.js

### src/controllers/
- [ ] auth.controller.js
- [ ] user.controller.js
- [ ] item.controller.js

### src/middleware/
- [ ] auth.js
- [ ] validation.js
- [ ] errorHandler.js

### src/models/
- [ ] User.js
- [ ] Item.js

### src/routes/
- [ ] auth.routes.js
- [ ] user.routes.js
- [ ] item.routes.js
- [ ] api.routes.js

### src/utils/
- [ ] logger.js
- [ ] helpers.js

---

## 🗄️ Database Verification

### Check MongoDB Connection
```bash
# For local MongoDB
mongosh

# List databases
show dbs

# Use your database
use express-rest-api

# Check collections
show collections

# Should see: users, items
```

### Check Users Collection
```javascript
// In mongosh
db.users.find().pretty()

// Should see registered users with hashed passwords
```

### Check Items Collection
```javascript
// In mongosh
db.items.find().pretty()

// Should see created items
```

---

## 🔍 Troubleshooting

### Issue: Cannot connect to MongoDB
- [ ] MongoDB service is running
- [ ] Connection string is correct
- [ ] Database username/password correct (for Atlas)
- [ ] IP address whitelisted (for Atlas)
- [ ] Firewall not blocking connection

### Issue: Port already in use
- [ ] Change PORT in .env to different port
- [ ] Or kill process using port 3000

### Issue: Module not found
- [ ] Delete node_modules folder
- [ ] Delete package-lock.json
- [ ] Run `npm install` again

### Issue: JWT errors
- [ ] JWT_SECRET is set in .env
- [ ] Token is included in Authorization header
- [ ] Token format: "Bearer <token>"
- [ ] Token is not expired

### Issue: Validation errors
- [ ] Check request body matches required format
- [ ] All required fields are included
- [ ] Data types are correct
- [ ] Email format is valid

---

## 📊 Success Criteria

Your backend is ready when:
- ✅ Server starts without errors
- ✅ MongoDB connection successful
- ✅ All health checks return 200
- ✅ Can register new user
- ✅ Can login and receive token
- ✅ Can access protected routes with token
- ✅ Can create, read, update, delete items
- ✅ Validation errors are returned properly
- ✅ Rate limiting is working
- ✅ No linting errors

---

## 🎯 Next Steps After Setup

1. **Create Admin User**
   ```javascript
   // In mongosh
   use express-rest-api
   db.users.updateOne(
     { email: "test@test.com" },
     { $set: { role: "admin" } }
   )
   ```

2. **Test Admin Routes**
   - Try accessing admin-only endpoints
   - Verify role-based access control

3. **Import into Postman**
   - Create collection from API_EXAMPLES.md
   - Set up environment variables
   - Test all endpoints

4. **Connect Frontend**
   - Update CLIENT_URL in .env
   - Test CORS configuration
   - Implement authentication flow

5. **Deploy (Optional)**
   - Choose hosting platform (Heroku, Railway, AWS, etc.)
   - Set up environment variables on server
   - Deploy MongoDB to Atlas
   - Update connection strings

---

## 📚 Documentation Reference

- **QUICKSTART.md** - Get started in 5 minutes
- **README.md** - Complete documentation
- **API_EXAMPLES.md** - API usage examples
- **ENV_SETUP.md** - Environment setup
- **PROJECT_SUMMARY.md** - Feature overview

---

## ✅ Final Checklist

Before considering setup complete:
- [ ] All dependencies installed
- [ ] Environment configured
- [ ] Database connected
- [ ] Server running
- [ ] Health checks passing
- [ ] Authentication working
- [ ] CRUD operations working
- [ ] Protected routes secured
- [ ] Validation working
- [ ] Error handling working
- [ ] Documentation reviewed

---

**Setup Complete! 🎉**

Your Express REST API backend is now ready for development!

---

*For questions or issues, refer to the documentation files or check the troubleshooting section above.*


