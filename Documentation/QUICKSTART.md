# 🚀 Quick Start Guide

Get your Express REST API up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14 or higher) - `node --version`
- ✅ MongoDB installed or MongoDB Atlas account
- ✅ npm installed - `npm --version`

---

## Step 1: Environment Setup (2 minutes)

### Create `.env` file

In the `express-rest-api` folder, create a `.env` file with these contents:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/express-rest-api
JWT_SECRET=my-super-secret-key-change-in-production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### MongoDB Options

**Option A: Local MongoDB**
```bash
# Check if MongoDB is running
mongosh

# If not installed, download from: https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Free Cloud Database)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster
4. Get connection string
5. Replace `MONGODB_URI` in `.env` with your Atlas connection string

---

## Step 2: Install Dependencies (1 minute)

```bash
cd express-rest-api
npm install
```

---

## Step 3: Start the Server (30 seconds)

```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
📊 Database: express-rest-api
🚀 Server is running in development mode on port 3000
📍 Local: http://localhost:3000
📚 API Documentation: http://localhost:3000/api
```

---

## Step 4: Test the API (1 minute)

### Option A: Using Browser

Open your browser and visit:
```
http://localhost:3000
```

You should see the welcome message!

### Option B: Using cURL

**Test health check:**
```bash
curl http://localhost:3000/health
```

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Expected response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Option C: Using Postman

1. Import the collection from `API_EXAMPLES.md`
2. Send a GET request to `http://localhost:3000/api`

---

## Step 5: Create Your First Item (30 seconds)

1. **Copy the token** from the register/login response

2. **Create an item:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My First Item",
    "description": "This is my first item",
    "price": 99.99,
    "quantity": 10,
    "category": "electronics"
  }'
```

3. **View all items:**
```bash
curl http://localhost:3000/api/items
```

---

## 🎉 Success!

You now have a fully functional REST API with:
- ✅ User authentication
- ✅ CRUD operations
- ✅ Database integration
- ✅ Security features
- ✅ Input validation

---

## Next Steps

### 1. Create an Admin User

To create an admin user, you need to manually update the database:

```bash
# Connect to MongoDB
mongosh

# Use your database
use express-rest-api

# Update a user to admin
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### 2. Test Protected Routes

```bash
# Login to get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  | jq -r '.data.token')

# Get your profile
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Explore the API

Visit these endpoints in your browser:
- API Documentation: http://localhost:3000/api
- Health Check: http://localhost:3000/health
- Items List: http://localhost:3000/api/items

### 4. Read the Full Documentation

- **README.md** - Complete documentation
- **API_EXAMPLES.md** - Detailed API examples
- **ENV_SETUP.md** - Environment configuration guide

---

## Troubleshooting

### Issue: "MongoDB connection error"

**Solution:**
1. Make sure MongoDB is running: `mongosh`
2. Check your `MONGODB_URI` in `.env`
3. For Atlas, check if your IP is whitelisted

### Issue: "Port 3000 already in use"

**Solution:**
Change the port in `.env`:
```env
PORT=3001
```

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "JWT secret not defined"

**Solution:**
Make sure your `.env` file exists and has `JWT_SECRET` defined

---

## Development Tips

### Hot Reload
The server automatically restarts when you make changes (using nodemon in dev mode)

### View Logs
All requests are logged in development mode

### Database GUI Tools
- **MongoDB Compass** - Official MongoDB GUI
- **Studio 3T** - Advanced MongoDB GUI
- **Robo 3T** - Lightweight MongoDB GUI

### API Testing Tools
- **Postman** - Most popular
- **Insomnia** - Modern alternative
- **Thunder Client** - VS Code extension
- **curl** - Command line

---

## Project Structure Overview

```
express-rest-api/
├── src/
│   ├── config/          # Configurations
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, etc.
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
├── .env                 # Environment variables
├── server.js            # Entry point
└── package.json
```

---

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install new package
npm install package-name

# View all routes
# (coming soon - add route listing feature)
```

---

## 📚 Resources

- Full Documentation: `README.md`
- API Examples: `API_EXAMPLES.md`
- Environment Setup: `ENV_SETUP.md`

---

## Need Help?

1. Check the documentation files
2. Review error messages in the console
3. Check MongoDB connection
4. Verify `.env` file configuration
5. Make sure all dependencies are installed

---

**Happy coding! 🎉**


