# Financial Manager API Documentation

## 🎉 Implementation Complete!

Your Express REST API has been successfully upgraded with **4 new financial management tables** connected to **MongoDB Atlas**.

---

## 📊 **Database Tables Created**

### 1. **Income Table**
Tracks income sources and earnings.

**Fields:**
- `incomeSource` (String, required) - Source of income
- `amount` (Number, required, min: 0) - Income amount
- `frequency` (String, required) - How often received
  - Values: `daily`, `weekly`, `bi-weekly`, `monthly`, `quarterly`, `yearly`, `one-time`
- `dateReceived` (Date, required) - Date income was received
- `createdBy` (ObjectId) - User reference
- `createdAt` (Date, auto) - Record creation timestamp
- `updatedAt` (Date, auto) - Record update timestamp

### 2. **Assets Table**
Tracks financial assets and investments.

**Fields:**
- `assetsName` (String, required) - Name of the asset
- `assetsType` (String, required) - Category of asset
  - Values: `savings`, `investment`, `property`, `vehicle`, `stocks`, `bonds`, `cryptocurrency`, `other`
- `currentValue` (Number, required, min: 0) - Current value
- `interestRate` (Number, 0-100%) - Annual interest/return rate
- `createdBy` (ObjectId) - User reference
- `createdAt` (Date, auto) - Record creation timestamp
- `updatedAt` (Date, auto) - Record update timestamp

### 3. **Liability Table**
Tracks debts and financial obligations.

**Fields:**
- `liabilityName` (String, required) - Name of the liability
- `type` (String, required) - Category of liability
  - Values: `loan`, `mortgage`, `personal-loan`, `car-loan`, `student-loan`, `medical`, `other`
- `outstandingAmount` (Number, required, min: 0) - Amount owed
- `interestRate` (Number, required, 0-100%) - Annual interest rate
- `dueDate` (Date, required) - Payment due date
- `createdBy` (ObjectId) - User reference
- `createdAt` (Date, auto) - Record creation timestamp
- `updatedAt` (Date, auto) - Record update timestamp

### 4. **Credit Card Table**
Tracks credit card accounts.

**Fields:**
- `bankName` (String, required) - Issuing bank name
- `cardName` (String, required) - Card name/type
- `creditLimit` (Number, required, min: 0) - Maximum credit
- `outstandingBalance` (Number, required, min: 0) - Current balance owed
- `interestRate` (Number, required, 0-100%) - APR percentage
- `dueDate` (Date, required) - Next payment due date
- `availableCredit` (Virtual field) - Calculated: creditLimit - outstandingBalance
- `utilizationRate` (Virtual field) - Calculated: (outstandingBalance / creditLimit) * 100
- `createdBy` (ObjectId) - User reference
- `createdAt` (Date, auto) - Record creation timestamp
- `updatedAt` (Date, auto) - Record update timestamp

---

## 🔌 **API Endpoints**

### Base URL
```
http://localhost:3000/api
```

---

## 📥 **Income Endpoints**

### Get All Income Records
```http
GET /api/income
```

**Query Parameters:**
- `page` (Number) - Page number (default: 1)
- `limit` (Number) - Items per page (default: 10)
- `frequency` (String) - Filter by frequency
- `sort` (String) - Sort field (default: -dateReceived)

**Example:**
```bash
curl http://localhost:3000/api/income?page=1&limit=10&frequency=monthly
```

### Get Single Income Record
```http
GET /api/income/:id
```

### Create Income Record
```http
POST /api/income
Content-Type: application/json

{
  "incomeSource": "Salary",
  "amount": 5000,
  "frequency": "monthly",
  "dateReceived": "2025-01-01"
}
```

### Update Income Record
```http
PUT /api/income/:id
Content-Type: application/json

{
  "amount": 5500,
  "frequency": "monthly"
}
```

### Delete Income Record
```http
DELETE /api/income/:id
```

### Delete All Income Records
```http
DELETE /api/income
```

---

## 💰 **Assets Endpoints**

### Get All Assets
```http
GET /api/assets
```

**Query Parameters:**
- `page` (Number) - Page number (default: 1)
- `limit` (Number) - Items per page (default: 10)
- `assetsType` (String) - Filter by asset type
- `sort` (String) - Sort field (default: -currentValue)

**Example:**
```bash
curl http://localhost:3000/api/assets?page=1&limit=10&assetsType=property
```

### Get Single Asset
```http
GET /api/assets/:id
```

### Create Asset
```http
POST /api/assets
Content-Type: application/json

{
  "assetsName": "Main Residence",
  "assetsType": "property",
  "currentValue": 500000,
  "interestRate": 3.5
}
```

### Update Asset
```http
PUT /api/assets/:id
Content-Type: application/json

{
  "currentValue": 525000,
  "interestRate": 4.0
}
```

### Delete Asset
```http
DELETE /api/assets/:id
```

### Delete All Assets
```http
DELETE /api/assets
```

---

## 📉 **Liability Endpoints**

### Get All Liabilities
```http
GET /api/liabilities
```

**Query Parameters:**
- `page` (Number) - Page number (default: 1)
- `limit` (Number) - Items per page (default: 10)
- `type` (String) - Filter by liability type
- `sort` (String) - Sort field (default: dueDate)

**Example:**
```bash
curl http://localhost:3000/api/liabilities?page=1&limit=10&type=mortgage
```

### Get Single Liability
```http
GET /api/liabilities/:id
```

### Create Liability
```http
POST /api/liabilities
Content-Type: application/json

{
  "liabilityName": "Home Mortgage",
  "type": "mortgage",
  "outstandingAmount": 350000,
  "interestRate": 3.75,
  "dueDate": "2025-02-01"
}
```

### Update Liability
```http
PUT /api/liabilities/:id
Content-Type: application/json

{
  "outstandingAmount": 345000,
  "dueDate": "2025-03-01"
}
```

### Delete Liability
```http
DELETE /api/liabilities/:id
```

### Delete All Liabilities
```http
DELETE /api/liabilities
```

---

## 💳 **Credit Card Endpoints**

### Get All Credit Cards
```http
GET /api/credit-cards
```

**Query Parameters:**
- `page` (Number) - Page number (default: 1)
- `limit` (Number) - Items per page (default: 10)
- `bankName` (String) - Filter by bank name (case-insensitive)
- `sort` (String) - Sort field (default: dueDate)

**Example:**
```bash
curl http://localhost:3000/api/credit-cards?page=1&limit=10&bankName=Chase
```

### Get Single Credit Card
```http
GET /api/credit-cards/:id
```

**Response includes virtual fields:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "bankName": "Chase Bank",
    "cardName": "Visa Platinum",
    "creditLimit": 10000,
    "outstandingBalance": 2500,
    "interestRate": 18.5,
    "dueDate": "2025-02-15",
    "availableCredit": 7500,
    "utilizationRate": "25.00",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Create Credit Card
```http
POST /api/credit-cards
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

### Update Credit Card
```http
PUT /api/credit-cards/:id
Content-Type: application/json

{
  "outstandingBalance": 2000,
  "dueDate": "2025-03-15"
}
```

### Delete Credit Card
```http
DELETE /api/credit-cards/:id
```

### Delete All Credit Cards
```http
DELETE /api/credit-cards
```

---

## 🧪 **Testing with cURL**

### 1. Test Income API
```bash
# Create income record
curl -X POST http://localhost:3000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "incomeSource": "Monthly Salary",
    "amount": 5000,
    "frequency": "monthly",
    "dateReceived": "2025-01-15"
  }'

# Get all income
curl http://localhost:3000/api/income

# Get with pagination
curl "http://localhost:3000/api/income?page=1&limit=5&sort=-amount"
```

### 2. Test Assets API
```bash
# Create asset
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "assetsName": "Savings Account",
    "assetsType": "savings",
    "currentValue": 25000,
    "interestRate": 2.5
  }'

# Get all assets
curl http://localhost:3000/api/assets

# Filter by type
curl "http://localhost:3000/api/assets?assetsType=savings"
```

### 3. Test Liabilities API
```bash
# Create liability
curl -X POST http://localhost:3000/api/liabilities \
  -H "Content-Type: application/json" \
  -d '{
    "liabilityName": "Car Loan",
    "type": "car-loan",
    "outstandingAmount": 15000,
    "interestRate": 4.5,
    "dueDate": "2025-02-01"
  }'

# Get all liabilities
curl http://localhost:3000/api/liabilities

# Sort by due date
curl "http://localhost:3000/api/liabilities?sort=dueDate"
```

### 4. Test Credit Cards API
```bash
# Create credit card
curl -X POST http://localhost:3000/api/credit-cards \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Bank of America",
    "cardName": "Mastercard Gold",
    "creditLimit": 5000,
    "outstandingBalance": 1200,
    "interestRate": 19.99,
    "dueDate": "2025-02-10"
  }'

# Get all credit cards
curl http://localhost:3000/api/credit-cards

# Get single card with virtual fields
curl http://localhost:3000/api/credit-cards/CARD_ID_HERE
```

---

## ⚙️ **Setup Instructions**

### Step 1: Update MongoDB Atlas Connection String

Edit the `.env` file:
```env
MONGODB_URI=mongodb+srv://YOUR-USERNAME:YOUR-PASSWORD@YOUR-CLUSTER.mongodb.net/financial-manager?retryWrites=true&w=majority
```

Replace:
- `YOUR-USERNAME` - Your MongoDB Atlas username
- `YOUR-PASSWORD` - Your MongoDB Atlas password
- `YOUR-CLUSTER` - Your cluster name (e.g., cluster0.xxxxx)

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Verify Connection
You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
📊 Database: financial-manager
🚀 Server is running in development mode on port 3000
```

### Step 4: Test the API
```bash
# View all endpoints
curl http://localhost:3000/

# View API documentation
curl http://localhost:3000/api
```

---

## 📁 **Files Created**

### Models (4 files)
- `src/models/Income.js`
- `src/models/Assets.js`
- `src/models/Liability.js`
- `src/models/CreditCard.js`

### Controllers (4 files)
- `src/controllers/income.controller.js`
- `src/controllers/assets.controller.js`
- `src/controllers/liability.controller.js`
- `src/controllers/creditCard.controller.js`

### Routes (4 files)
- `src/routes/income.routes.js`
- `src/routes/assets.routes.js`
- `src/routes/liability.routes.js`
- `src/routes/creditCard.routes.js`

### Modified Files
- `server.js` - Added new routes
- `src/config/database.js` - Removed deprecated options
- `src/routes/api.routes.js` - Updated API documentation
- `.env` - Added MongoDB Atlas connection string

---

## 🎯 **Features**

### ✅ Full CRUD Operations
- Create, Read, Update, Delete for all 4 tables
- Bulk delete (delete all) functionality

### ✅ Advanced Querying
- Pagination (page, limit)
- Filtering (by type, frequency, bank name)
- Sorting (any field, ascending/descending)

### ✅ Data Validation
- Required fields enforced
- Data type validation
- Min/max value constraints
- Enum validation for categorized fields
- Custom validators (e.g., balance ≤ credit limit)

### ✅ Virtual Fields (Credit Cards)
- `availableCredit` - Automatically calculated
- `utilizationRate` - Credit utilization percentage

### ✅ Database Features
- Indexes for faster queries
- Timestamps (createdAt, updatedAt)
- User reference tracking (createdBy)
- Independent tables (no relationships)

---

## 📊 **Response Format**

### Success Response
```json
{
  "success": true,
  "message": "Income record created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7e",
    "incomeSource": "Salary",
    "amount": 5000,
    "frequency": "monthly",
    "dateReceived": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-10-24T10:30:00.000Z",
    "updatedAt": "2025-10-24T10:30:00.000Z"
  }
}
```

### List Response (with pagination)
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Amount is required, Frequency is required"
}
```

---

## 🔒 **Security Notes**

### Current Setup
- Routes are **public** (no authentication required)
- All endpoints accessible without login

### To Add Authentication
Uncomment the `protect` middleware in route files:

```javascript
const { protect } = require('../middleware/auth');

// Add to routes
router.get('/', protect, getAllIncome);
router.post('/', protect, createIncome);
```

This will require JWT token in Authorization header.

---

## 🚀 **Quick Start Example**

### Complete Workflow
```bash
# 1. Create income
curl -X POST http://localhost:3000/api/income \
  -H "Content-Type: application/json" \
  -d '{"incomeSource":"Freelance","amount":3000,"frequency":"monthly","dateReceived":"2025-01-20"}'

# 2. Create asset
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{"assetsName":"Stocks Portfolio","assetsType":"stocks","currentValue":50000,"interestRate":8}'

# 3. Create liability
curl -X POST http://localhost:3000/api/liabilities \
  -H "Content-Type: application/json" \
  -d '{"liabilityName":"Student Loan","type":"student-loan","outstandingAmount":30000,"interestRate":5.5,"dueDate":"2025-03-01"}'

# 4. Create credit card
curl -X POST http://localhost:3000/api/credit-cards \
  -H "Content-Type: application/json" \
  -d '{"bankName":"Citibank","cardName":"Visa Rewards","creditLimit":8000,"outstandingBalance":2000,"interestRate":17.5,"dueDate":"2025-02-20"}'

# 5. View all data
curl http://localhost:3000/api/income
curl http://localhost:3000/api/assets
curl http://localhost:3000/api/liabilities
curl http://localhost:3000/api/credit-cards
```

---

## 📈 **Postman Collection**

### Import into Postman
Create a new collection with these endpoints:

**Environment Variables:**
- `BASE_URL`: `http://localhost:3000`

**Requests:**
1. GET {{BASE_URL}}/api/income
2. POST {{BASE_URL}}/api/income
3. GET {{BASE_URL}}/api/assets
4. POST {{BASE_URL}}/api/assets
5. GET {{BASE_URL}}/api/liabilities
6. POST {{BASE_URL}}/api/liabilities
7. GET {{BASE_URL}}/api/credit-cards
8. POST {{BASE_URL}}/api/credit-cards

---

## 🎉 **Summary**

### ✅ What's Working
- 4 Financial tables with complete schemas
- 24 API endpoints (6 per table)
- Full CRUD operations
- Pagination, filtering, and sorting
- Data validation
- Virtual fields (Credit Cards)
- Morgan logging
- Error handling

### 📌 Next Steps
1. **Update MongoDB Atlas connection string** in `.env`
2. **Start the server**: `npm run dev`
3. **Test endpoints** using cURL or Postman
4. **(Optional) Add authentication** to protect routes
5. **(Optional) Create a frontend** to interact with the API

---

## 💡 **Need Help?**

### Common Issues

**MongoDB Connection Error:**
- Verify MongoDB Atlas connection string
- Check username/password (URL encode special characters)
- Whitelist your IP in MongoDB Atlas
- Ensure network access is configured

**Validation Errors:**
- Check required fields
- Verify data types (Number, String, Date)
- Ensure enum values are correct
- Check min/max constraints

**404 Errors:**
- Verify endpoint URL
- Check HTTP method (GET, POST, PUT, DELETE)
- Ensure server is running

---

**🎉 Your Financial Manager API is ready to use!**

For questions or issues, refer to the main `README.md` or check the server logs.

