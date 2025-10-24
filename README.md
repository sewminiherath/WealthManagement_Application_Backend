# Express REST API - Financial Manager

A professional, production-ready RESTful API for financial management built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ **Financial Management** - Complete CRUD operations for Income, Assets, Liabilities, and Credit Cards
- ✅ **Database Integration** - MongoDB with Mongoose ODM
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Pagination & Filtering** - Advanced query capabilities with sorting
- ✅ **Advanced Logging** - Enhanced Morgan with file rotation, custom tokens, and environment-specific configs
- ✅ **Environment Configuration** - dotenv for environment variables
- ✅ **Virtual Fields** - Auto-calculated fields (Credit Card utilization rate, available credit)
- ✅ **Query Features** - Filter, sort, paginate across all endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sewminiherath/WealthManagement_Application_Backend.git
   cd express-rest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/financial-manager?retryWrites=true&w=majority
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
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── cors.js          # CORS configuration
│   │   ├── morgan.js        # Morgan logging configuration
│   │   └── rateLimiter.js   # Rate limiting config
│   ├── controllers/         # Business logic
│   │   ├── income.controller.js
│   │   ├── assets.controller.js
│   │   ├── liability.controller.js
│   │   └── creditCard.controller.js
│   ├── middleware/          # Custom middleware
│   │   ├── validation.js    # Validation rules
│   │   └── errorHandler.js  # Error handling
│   ├── models/              # Database schemas
│   │   ├── Income.js
│   │   ├── Assets.js
│   │   ├── Liability.js
│   │   └── CreditCard.js
│   ├── routes/              # API routes
│   │   ├── income.routes.js
│   │   ├── assets.routes.js
│   │   ├── liability.routes.js
│   │   ├── creditCard.routes.js
│   │   └── api.routes.js
│   └── utils/               # Helper functions
│       ├── logger.js
│       ├── helpers.js
│       └── QueryFeatures.js
├── logs/                    # HTTP request logs (gitignored)
│   ├── access.log           # All successful requests
│   └── error.log            # Error logs
├── Documentation/           # Project documentation
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## 🔐 API Endpoints

### Base URL
```
http://localhost:3000
```

### System Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Homepage | Public |
| GET | `/api` | API documentation | Public |
| GET | `/health` | Health check | Public |

### 💰 Income Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/income` | Get all income records | Public |
| GET | `/api/income/:id` | Get single income | Public |
| POST | `/api/income` | Create income | Public |
| PUT | `/api/income/:id` | Update income | Public |
| DELETE | `/api/income/:id` | Delete income | Public |
| DELETE | `/api/income` | Delete all income | Public |

**Income Fields:**
- `incomeSource` (String, required) - Source of income
- `amount` (Number, required) - Income amount
- `frequency` (Enum, required) - daily, weekly, bi-weekly, monthly, quarterly, annually, one-time
- `dateReceived` (Date, required) - Date income was received

### 🏦 Assets Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/assets` | Get all assets | Public |
| GET | `/api/assets/:id` | Get single asset | Public |
| POST | `/api/assets` | Create asset | Public |
| PUT | `/api/assets/:id` | Update asset | Public |
| DELETE | `/api/assets/:id` | Delete asset | Public |
| DELETE | `/api/assets` | Delete all assets | Public |

**Asset Fields:**
- `assetsName` (String, required) - Name of asset
- `assetsType` (Enum, required) - cash, savings, investment, property, vehicle, other
- `currentValue` (Number, required) - Current value
- `interestRate` (Number, optional) - Interest rate percentage

### 📉 Liabilities Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/liabilities` | Get all liabilities | Public |
| GET | `/api/liabilities/:id` | Get single liability | Public |
| POST | `/api/liabilities` | Create liability | Public |
| PUT | `/api/liabilities/:id` | Update liability | Public |
| DELETE | `/api/liabilities/:id` | Delete liability | Public |
| DELETE | `/api/liabilities` | Delete all liabilities | Public |

**Liability Fields:**
- `liabilityName` (String, required) - Name of liability
- `type` (Enum, required) - loan, mortgage, credit_card, other
- `outstandingAmount` (Number, required) - Outstanding amount
- `interestRate` (Number, optional) - Interest rate percentage
- `dueDate` (Date, required) - Due date

### 💳 Credit Cards Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/credit-cards` | Get all credit cards | Public |
| GET | `/api/credit-cards/:id` | Get single card | Public |
| POST | `/api/credit-cards` | Create card | Public |
| PUT | `/api/credit-cards/:id` | Update card | Public |
| DELETE | `/api/credit-cards/:id` | Delete card | Public |
| DELETE | `/api/credit-cards` | Delete all cards | Public |

**Credit Card Fields:**
- `bankName` (String, required) - Bank name
- `cardName` (String, required) - Card name
- `creditLimit` (Number, required) - Credit limit
- `outstandingBalance` (Number, required) - Current balance
- `interestRate` (Number, optional) - Interest rate percentage
- `dueDate` (Date, required) - Payment due date
- `availableCredit` (Virtual) - Auto-calculated: creditLimit - outstandingBalance
- `utilizationRate` (Virtual) - Auto-calculated: (balance / limit) × 100

## 📝 API Usage Examples

### 1. Get All Income Records

```bash
GET http://localhost:3000/api/income
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "671a5b8c9d4e2f3a1b5c6d7e",
      "incomeSource": "Monthly Salary",
      "amount": 5000,
      "frequency": "monthly",
      "dateReceived": "2025-01-15T00:00:00.000Z",
      "createdAt": "2025-10-24T10:00:00.000Z"
    }
  ]
}
```

### 2. Create a New Income Record

```bash
POST http://localhost:3000/api/income
Content-Type: application/json

{
  "incomeSource": "Monthly Salary",
  "amount": 5000,
  "frequency": "monthly",
  "dateReceived": "2025-01-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Income record created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7e",
    "incomeSource": "Monthly Salary",
    "amount": 5000,
    "frequency": "monthly",
    "dateReceived": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z"
  }
}
```

### 3. Create a Credit Card (with Virtual Fields)

```bash
POST http://localhost:3000/api/credit-cards
Content-Type: application/json

{
  "bankName": "Chase Bank",
  "cardName": "Visa Platinum",
  "creditLimit": 10000,
  "outstandingBalance": 2500,
  "interestRate": 18.5,
  "dueDate": "2025-02-15"
}
```

**Response (includes virtual fields):**
```json
{
  "success": true,
  "message": "Credit card created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7e",
    "bankName": "Chase Bank",
    "cardName": "Visa Platinum",
    "creditLimit": 10000,
    "outstandingBalance": 2500,
    "interestRate": 18.5,
    "dueDate": "2025-02-15T00:00:00.000Z",
    "availableCredit": 7500,
    "utilizationRate": "25.00",
    "createdAt": "2025-10-24T10:00:00.000Z"
  }
}
```

### 4. Update an Asset

```bash
PUT http://localhost:3000/api/assets/671a5b8c9d4e2f3a1b5c6d7e
Content-Type: application/json

{
  "currentValue": 27000,
  "interestRate": 3.0
}
```

### 5. Delete a Liability

```bash
DELETE http://localhost:3000/api/liabilities/671a5b8c9d4e2f3a1b5c6d7e
```

## 🔍 Query Parameters

All GET endpoints support advanced querying:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `?page=2` |
| `limit` | Items per page | `?limit=20` |
| `sort` | Sort field | `?sort=-amount` (descending) |
| `frequency` | Filter income by frequency | `?frequency=monthly` |
| `assetsType` | Filter assets by type | `?assetsType=savings` |
| `type` | Filter liabilities by type | `?type=mortgage` |
| `bankName` | Filter credit cards by bank | `?bankName=Chase` |

**Examples:**

```bash
# Get monthly income, sorted by amount (highest first)
GET /api/income?frequency=monthly&sort=-amount

# Get savings assets with pagination
GET /api/assets?assetsType=savings&page=1&limit=10

# Get upcoming liabilities sorted by due date
GET /api/liabilities?sort=dueDate&limit=5

# Get credit cards from specific bank
GET /api/credit-cards?bankName=Chase
```

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-Origin Resource Sharing configured
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - Comprehensive validation rules
- **Error Handling** - Centralized error handling
- **MongoDB Injection Protection** - Mongoose sanitization
- **Environment Variables** - Sensitive data protection

## 🧪 Testing with Postman

Import the included Postman collection:

1. Open Postman
2. Click "Import"
3. Select `Financial_Manager_API.postman_collection.json`
4. Start testing!

**Features:**
- ✅ Auto-saves IDs when creating records
- ✅ All 27 endpoints pre-configured
- ✅ Environment variables included
- ✅ Example request bodies

## 📦 Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.19.2 | Web framework |
| mongoose | ^8.6.1 | MongoDB ODM |
| dotenv | ^16.4.5 | Environment variables |
| helmet | ^7.1.0 | Security headers |
| cors | ^2.8.5 | CORS handling |
| morgan | ^1.10.1 | HTTP logging |
| rotating-file-stream | ^3.2.7 | Log file rotation |
| express-rate-limit | ^7.4.0 | Rate limiting |
| express-validator | ^7.2.0 | Input validation |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| nodemon | ^3.1.4 | Auto-restart server |

## 🚦 Error Responses

### Validation Error
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Amount is required, Frequency is required"
}
```

### Not Found Error
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Income record not found"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `CLIENT_URL` | Yes | - | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | 900000 | Rate limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Max requests per window |

## 📊 Logging

### Development Mode
- Colored console output
- Response time tracking
- HTTP method and URL
- Status code with colors

### Production Mode
- **access.log** - All successful requests (2xx, 3xx)
- **error.log** - All error requests (4xx, 5xx)
- Daily log rotation with gzip compression
- 14 days retention for access logs
- 30 days retention for error logs

### View Logs

```bash
# View last 50 lines of access log
tail -n 50 logs/access.log

# View last 50 lines of error log
tail -n 50 logs/error.log

# Follow logs in real-time
tail -f logs/access.log

# View compressed logs
gunzip -c logs/access.log.20251024.gz | tail -n 50
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

1. Check MongoDB is running:
   ```bash
   # For local MongoDB
   mongosh
   ```

2. Verify connection string in `.env`
3. Check network connectivity for MongoDB Atlas
4. Ensure IP whitelist for MongoDB Atlas

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📚 Additional Resources

- **API Reference:** `API_REFERENCE.md` - Complete endpoint documentation
- **Quick Reference:** `API_QUICK_REFERENCE.md` - Quick lookup cheat sheet
- **Postman Collection:** `Financial_Manager_API.postman_collection.json`
- **Setup Guide:** `ENV_SETUP.md` - Environment variable guide
- **How to Use:** `HOW_TO_USE_API_DOCS.md` - Documentation guide

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start

# Check for errors
npm test
```

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ for Financial Management**

**Repository:** https://github.com/sewminiherath/WealthManagement_Application_Backend.git  
**Version:** 3.0.0  
**Last Updated:** October 24, 2025
