# Environment Setup Instructions

## Create .env File

Please create a `.env` file in the `express-rest-api` folder with the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/express-rest-api
# For MongoDB Atlas (cloud), use this format instead:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Important Notes:

1. **Never commit the `.env` file to version control** (it's already in .gitignore)
2. Change `JWT_SECRET` to a strong random string in production
3. Update `MONGODB_URI` with your actual MongoDB connection string
4. For MongoDB Atlas (cloud database), use the connection string format provided in your Atlas dashboard

## Quick Setup:

### Option 1: Local MongoDB
- Install MongoDB on your machine
- Use the default connection string: `mongodb://localhost:27017/express-rest-api`

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string from the Atlas dashboard
- Replace the MONGODB_URI value with your Atlas connection string


