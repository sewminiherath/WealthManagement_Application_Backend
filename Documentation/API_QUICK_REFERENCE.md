# API Quick Reference Cheat Sheet

## Base URL
```
http://localhost:3000
```

---

# 💰 Income API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/income` | Get all income records |
| GET | `/api/income/:id` | Get single income |
| POST | `/api/income` | Create income |
| PUT | `/api/income/:id` | Update income |
| DELETE | `/api/income/:id` | Delete income |
| DELETE | `/api/income` | Delete all income |

### Create Income
```json
POST /api/income
{
  "incomeSource": "Salary",
  "amount": 5000,
  "frequency": "monthly",
  "dateReceived": "2025-01-15"
}
```

**Frequency Options:** `daily`, `weekly`, `bi-weekly`, `monthly`, `quarterly`, `yearly`, `one-time`

---

# 🏦 Assets API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/assets` | Get all assets |
| GET | `/api/assets/:id` | Get single asset |
| POST | `/api/assets` | Create asset |
| PUT | `/api/assets/:id` | Update asset |
| DELETE | `/api/assets/:id` | Delete asset |
| DELETE | `/api/assets` | Delete all assets |

### Create Asset
```json
POST /api/assets
{
  "assetsName": "Savings Account",
  "assetsType": "savings",
  "currentValue": 25000,
  "interestRate": 2.5
}
```

**Type Options:** `savings`, `investment`, `property`, `vehicle`, `stocks`, `bonds`, `cryptocurrency`, `other`

---

# 📉 Liabilities API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/liabilities` | Get all liabilities |
| GET | `/api/liabilities/:id` | Get single liability |
| POST | `/api/liabilities` | Create liability |
| PUT | `/api/liabilities/:id` | Update liability |
| DELETE | `/api/liabilities/:id` | Delete liability |
| DELETE | `/api/liabilities` | Delete all liabilities |

### Create Liability
```json
POST /api/liabilities
{
  "liabilityName": "Car Loan",
  "type": "car-loan",
  "outstandingAmount": 15000,
  "interestRate": 4.5,
  "dueDate": "2025-02-15"
}
```

**Type Options:** `loan`, `mortgage`, `personal-loan`, `car-loan`, `student-loan`, `medical`, `other`

---

# 💳 Credit Cards API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/credit-cards` | Get all credit cards |
| GET | `/api/credit-cards/:id` | Get single card |
| POST | `/api/credit-cards` | Create card |
| PUT | `/api/credit-cards/:id` | Update card |
| DELETE | `/api/credit-cards/:id` | Delete card |
| DELETE | `/api/credit-cards` | Delete all cards |

### Create Credit Card
```json
POST /api/credit-cards
{
  "bankName": "Chase Bank",
  "cardName": "Visa Platinum",
  "creditLimit": 10000,
  "outstandingBalance": 2500,
  "interestRate": 18.5,
  "dueDate": "2025-02-15"
}
```

**Virtual Fields (Auto-calculated):**
- `availableCredit` = creditLimit - outstandingBalance
- `utilizationRate` = (outstandingBalance / creditLimit) × 100

---

# 🔍 Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `?page=2` |
| `limit` | Items per page | `?limit=20` |
| `sort` | Sort field | `?sort=-amount` |
| `frequency` | Filter income | `?frequency=monthly` |
| `assetsType` | Filter assets | `?assetsType=stocks` |
| `type` | Filter liabilities | `?type=mortgage` |
| `bankName` | Filter cards | `?bankName=Chase` |

**Sort:** Use `-` prefix for descending (e.g., `?sort=-amount`)

---

# 🧪 Quick Test Commands

### PowerShell
```powershell
# Get all income
Invoke-RestMethod http://localhost:3000/api/income

# Create income
$body = @{
  incomeSource = "Salary"
  amount = 5000
  frequency = "monthly"
  dateReceived = "2025-01-15"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/income" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### cURL
```bash
# Get all assets
curl http://localhost:3000/api/assets

# Create asset
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{"assetsName":"Stocks","assetsType":"stocks","currentValue":50000,"interestRate":8}'
```

### JavaScript Fetch
```javascript
// Get all liabilities
fetch('http://localhost:3000/api/liabilities')
  .then(r => r.json())
  .then(data => console.log(data));

// Create liability
fetch('http://localhost:3000/api/liabilities', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    liabilityName: "Student Loan",
    type: "student-loan",
    outstandingAmount: 30000,
    interestRate: 5.5,
    dueDate: "2025-03-01"
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

---

# 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": { /* record object */ }
}
```

### List Response
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [ /* array of records */ ]
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Amount is required"
}
```

---

# 🔢 Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Record created |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Record not found |
| 500 | Server Error | Server issue |

---

# 📝 Field Validations

## Income
- `incomeSource` ✅ required, string, max 100 chars
- `amount` ✅ required, number, ≥ 0
- `frequency` ✅ required, enum (7 options)
- `dateReceived` ✅ required, date

## Assets
- `assetsName` ✅ required, string, max 100 chars
- `assetsType` ✅ required, enum (8 options)
- `currentValue` ✅ required, number, ≥ 0
- `interestRate` optional, number, 0-100

## Liabilities
- `liabilityName` ✅ required, string, max 100 chars
- `type` ✅ required, enum (7 options)
- `outstandingAmount` ✅ required, number, ≥ 0
- `interestRate` ✅ required, number, 0-100
- `dueDate` ✅ required, date

## Credit Cards
- `bankName` ✅ required, string, max 100 chars
- `cardName` ✅ required, string, max 100 chars
- `creditLimit` ✅ required, number, ≥ 0
- `outstandingBalance` ✅ required, number, ≥ 0, ≤ creditLimit
- `interestRate` ✅ required, number, 0-100
- `dueDate` ✅ required, date

---

# 🎯 Common Use Cases

### Get records with pagination
```
GET /api/income?page=2&limit=20
```

### Sort by amount (descending)
```
GET /api/income?sort=-amount
```

### Filter monthly income
```
GET /api/income?frequency=monthly
```

### Filter and sort
```
GET /api/assets?assetsType=stocks&sort=-currentValue
```

### Get single record
```
GET /api/income/671a5b8c9d4e2f3a1b5c6d7e
```

### Update record
```
PUT /api/income/671a5b8c9d4e2f3a1b5c6d7e
{
  "amount": 5500
}
```

### Delete record
```
DELETE /api/income/671a5b8c9d4e2f3a1b5c6d7e
```

---

# 🌐 Browser Console Testing

```javascript
// Test in browser console at http://localhost:3000

// Get all income
fetch('/api/income').then(r => r.json()).then(console.log);

// Create income
fetch('/api/income', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    incomeSource: "Salary",
    amount: 5000,
    frequency: "monthly",
    dateReceived: "2025-01-15"
  })
}).then(r => r.json()).then(console.log);
```

---

# 📌 Important Notes

1. **Date Format:** Use `YYYY-MM-DD` or ISO 8601
2. **Numbers:** No quotes (e.g., `5000` not `"5000"`)
3. **Enums:** Case-insensitive, converted to lowercase
4. **IDs:** 24-character hex strings (MongoDB ObjectId)
5. **Credit Cards:** Balance cannot exceed limit

---

# 🔗 Full Documentation

- **Detailed Reference:** `API_REFERENCE.md`
- **Setup Guide:** `README.md`
- **Examples:** `API_EXAMPLES.md`
- **Financial Docs:** `FINANCIAL_API_DOCUMENTATION.md`

---

**Version:** 3.0.0  
**Server:** http://localhost:3000  
**Repository:** https://github.com/sewminiherath/WealthManagement_Application_Backend.git

