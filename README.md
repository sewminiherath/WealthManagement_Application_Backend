# Express REST API

A professional, production-ready RESTful API built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ **Authentication & Authorization** - JWT-based authentication with role-based access control
- ✅ **User Management** - Complete user CRUD operations
- ✅ **Item Management** - Full-featured item management with CRUD operations
- ✅ **Database Integration** - MongoDB with Mongoose ODM
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Password Hashing** - Secure password storage with bcrypt
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Pagination & Filtering** - Advanced query capabilities
- ✅ **Advanced Logging** - Enhanced Morgan with file rotation, custom tokens, and environment-specific configs
- ✅ **Environment Configuration** - dotenv for environment variables

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory (see `ENV_SETUP.md` for details):
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/express-rest-api
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:3000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running locally or use MongoDB Atlas connection string.

5. **Run the server**
   ```bash
   # Development mode with nodemon
   npm run dev
   
   # Production mode
   npm start
   ```

## 📁 Project Structure

```
express-rest-api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # MongoDB connection
│   │   ├── jwt.js        # JWT utilities
│   │   ├── cors.js       # CORS configuration
│   │   ├── morgan.js     # Morgan logging configuration
│   │   └── rateLimiter.js
│   ├── controllers/      # Business logic
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── item.controller.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── validation.js # Validation rules
│   │   └── errorHandler.js
│   ├── models/           # Database schemas
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── item.routes.js
│   │   └── api.routes.js
│   └── utils/            # Helper functions
│       ├── logger.js
│       └── helpers.js
├── logs/                 # HTTP request logs (gitignored)
│   ├── access.log        # All requests
│   └── error.log         # Error logs
├── .env                  # Environment variables
├── .gitignore
├── package.json
├── server.js             # Entry point
└── README.md
```

## 🔐 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/updatepassword` | Update password | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Admin |
| PUT | `/api/users/:id` | Update user | Admin |
| DELETE | `/api/users/:id` | Delete user | Admin |
| PUT | `/api/users/profile` | Update own profile | Private |

### Item Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/items` | Get all items (with pagination) | Public |
| GET | `/api/items/:id` | Get item by ID | Public |
| POST | `/api/items` | Create new item | Private |
| PUT | `/api/items/:id` | Update item | Private (Owner/Admin) |
| DELETE | `/api/items/:id` | Delete item | Private (Owner/Admin) |
| DELETE | `/api/items` | Delete all items | Admin |

### Health Check

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/health` | Health check | Public |
| GET | `/api/health` | API health check | Public |

## 📝 API Usage Examples

### 1. Register a New User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get All Items (with pagination)

```bash
GET /api/items?page=1&limit=10&category=electronics&sort=-createdAt
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 5
  },
  "data": [
    {
      "_id": "64abc456...",
      "name": "Laptop",
      "description": "High-performance laptop",
      "price": 999.99,
      "quantity": 10,
      "category": "electronics",
      "status": "active",
      "createdBy": {
        "_id": "64abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

### 4. Create a New Item (Protected)

```bash
POST /api/items
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Smartphone",
  "description": "Latest model smartphone",
  "price": 599.99,
  "quantity": 50,
  "category": "electronics",
  "tags": ["mobile", "tech"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "_id": "64abc789...",
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 599.99,
    "quantity": 50,
    "category": "electronics",
    "status": "active",
    "tags": ["mobile", "tech"],
    "createdBy": "64abc123...",
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 5. Update an Item (Protected)

```bash
PUT /api/items/64abc789...
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "price": 549.99,
  "quantity": 45
}
```

### 6. Delete an Item (Protected)

```bash
DELETE /api/items/64abc789...
Authorization: Bearer <your-token>
```

## 🔍 Query Parameters for GET /api/items

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | Number | Page number | `?page=1` |
| `limit` | Number | Items per page (max 100) | `?limit=10` |
| `category` | String | Filter by category | `?category=electronics` |
| `status` | String | Filter by status | `?status=active` |
| `minPrice` | Number | Minimum price | `?minPrice=100` |
| `maxPrice` | Number | Maximum price | `?maxPrice=1000` |
| `search` | String | Search in name/description | `?search=laptop` |
| `sort` | String | Sort fields (prefix with - for desc) | `?sort=-price,name` |

**Example:**
```bash
GET /api/items?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&sort=-price&search=laptop
```

## 🔒 Authentication

This API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### User Roles

- **user** - Regular user (default)
- **admin** - Administrator with full access

## 🛡️ Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing enabled
- **Rate Limiting** - Prevents abuse (100 requests per 15 min)
- **Auth Rate Limiting** - Stricter limits on auth endpoints (5 requests per 15 min)
- **Password Hashing** - Bcrypt with salt rounds
- **Input Validation** - Express-validator on all inputs
- **JWT Expiration** - Tokens expire after 7 days (configurable)

## 🧪 Testing with Postman/Insomnia

1. Import the API endpoints into your testing tool
2. Create an environment variable for `BASE_URL`: `http://localhost:3000`
3. After login/register, save the token
4. Use the token in Authorization header for protected routes

## 📦 Dependencies

### Production
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - CORS middleware
- **morgan** - HTTP request logger with enhanced features
- **rotating-file-stream** - Automatic log file rotation
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

### Development
- **nodemon** - Auto-restart server on changes

## 🚦 Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **429** - Too Many Requests
- **500** - Internal Server Error

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## 📊 Logging

### Development Mode
- **Console output** with colored formatting
- Logs appear in terminal
- Health checks are automatically skipped

### Production Mode
- **File-based logging** with automatic rotation
- Logs saved to `logs/` directory
- Access logs: `logs/access.log` (keeps 14 days)
- Error logs: `logs/error.log` (keeps 30 days)
- Old logs compressed with gzip
- Health checks automatically skipped

### View Logs
```bash
# View current access log
cat logs/access.log

# View current error log
cat logs/error.log

# View compressed log (yesterday)
zcat logs/access.log.1.gz

# Monitor logs in real-time
tail -f logs/access.log
```

For detailed logging configuration, see `Documentation/Morgan-Logging-Configuration.md`.

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (Mac/Linux)
sudo systemctl start mongod
```

### Port Already in Use

Change the `PORT` in your `.env` file or kill the process using the port:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## 📄 License

ISC

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ using Node.js and Express**


