# Financial Manager API - Endpoint Reference

## Base URL
```
http://localhost:3000
```

## Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} or []
}
```

---

# 💰 Income Endpoints

## 1. Get All Income Records
**GET** `/api/income`

### Query Parameters
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | Number | Page number | 1 | `?page=2` |
| `limit` | Number | Items per page | 10 | `?limit=20` |
| `frequency` | String | Filter by frequency | - | `?frequency=monthly` |
| `sort` | String | Sort field | `-dateReceived` | `?sort=amount` |

### Example Request
```bash
GET http://localhost:3000/api/income?page=1&limit=10&frequency=monthly
```

### Example Response
```json
{
  "success": true,
  "count": 5,
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
      "createdAt": "2025-10-24T10:00:00.000Z",
      "updatedAt": "2025-10-24T10:00:00.000Z"
    }
  ]
}
```

---

## 2. Get Single Income Record
**GET** `/api/income/:id`

### Example Request
```bash
GET http://localhost:3000/api/income/671a5b8c9d4e2f3a1b5c6d7e
```

### Example Response
```json
{
  "success": true,
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7e",
    "incomeSource": "Monthly Salary",
    "amount": 5000,
    "frequency": "monthly",
    "dateReceived": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

---

## 3. Create Income Record
**POST** `/api/income`

### Request Body
```json
{
  "incomeSource": "Monthly Salary",
  "amount": 5000,
  "frequency": "monthly",
  "dateReceived": "2025-01-15"
}
```

### Field Requirements
| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `incomeSource` | String | ✅ Yes | - | Source of income |
| `amount` | Number | ✅ Yes | ≥ 0 | Income amount |
| `frequency` | String | ✅ Yes | daily, weekly, bi-weekly, monthly, quarterly, yearly, one-time | How often received |
| `dateReceived` | Date | ✅ Yes | ISO 8601 | Date income received |

### Example Request (cURL)
```bash
curl -X POST http://localhost:3000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "incomeSource": "Freelance Project",
    "amount": 3000,
    "frequency": "one-time",
    "dateReceived": "2025-01-20"
  }'
```

### Example Response
```json
{
  "success": true,
  "message": "Income record created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7f",
    "incomeSource": "Freelance Project",
    "amount": 3000,
    "frequency": "one-time",
    "dateReceived": "2025-01-20T00:00:00.000Z",
    "createdAt": "2025-10-24T10:05:00.000Z",
    "updatedAt": "2025-10-24T10:05:00.000Z"
  }
}
```

---

## 4. Update Income Record
**PUT** `/api/income/:id`

### Request Body (All fields optional)
```json
{
  "amount": 5500,
  "frequency": "monthly"
}
```

### Example Request
```bash
curl -X PUT http://localhost:3000/api/income/671a5b8c9d4e2f3a1b5c6d7e \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5500
  }'
```

### Example Response
```json
{
  "success": true,
  "message": "Income record updated successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7e",
    "incomeSource": "Monthly Salary",
    "amount": 5500,
    "frequency": "monthly",
    "dateReceived": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:10:00.000Z"
  }
}
```

---

## 5. Delete Income Record
**DELETE** `/api/income/:id`

### Example Request
```bash
curl -X DELETE http://localhost:3000/api/income/671a5b8c9d4e2f3a1b5c6d7e
```

### Example Response
```json
{
  "success": true,
  "message": "Income record deleted successfully",
  "data": {}
}
```

---

## 6. Delete All Income Records
**DELETE** `/api/income`

### Example Request
```bash
curl -X DELETE http://localhost:3000/api/income
```

### Example Response
```json
{
  "success": true,
  "message": "15 income records deleted successfully",
  "data": {}
}
```

---

# 🏦 Assets Endpoints

## 1. Get All Assets
**GET** `/api/assets`

### Query Parameters
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | Number | Page number | 1 | `?page=2` |
| `limit` | Number | Items per page | 10 | `?limit=20` |
| `assetsType` | String | Filter by type | - | `?assetsType=property` |
| `sort` | String | Sort field | `-currentValue` | `?sort=assetsName` |

### Example Request
```bash
GET http://localhost:3000/api/assets?assetsType=savings&sort=-currentValue
```

---

## 2. Get Single Asset
**GET** `/api/assets/:id`

### Example Request
```bash
GET http://localhost:3000/api/assets/671a5b8c9d4e2f3a1b5c6d7e
```

---

## 3. Create Asset
**POST** `/api/assets`

### Request Body
```json
{
  "assetsName": "Main Residence",
  "assetsType": "property",
  "currentValue": 500000,
  "interestRate": 3.5
}
```

### Field Requirements
| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `assetsName` | String | ✅ Yes | - | Name of the asset |
| `assetsType` | String | ✅ Yes | savings, investment, property, vehicle, stocks, bonds, cryptocurrency, other | Category of asset |
| `currentValue` | Number | ✅ Yes | ≥ 0 | Current market value |
| `interestRate` | Number | No | 0-100 | Annual interest/return rate (%) |

### Example Request (Postman)
```
POST http://localhost:3000/api/assets
Content-Type: application/json

{
  "assetsName": "Savings Account",
  "assetsType": "savings",
  "currentValue": 25000,
  "interestRate": 2.5
}
```

### Example Response
```json
{
  "success": true,
  "message": "Asset created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7f",
    "assetsName": "Savings Account",
    "assetsType": "savings",
    "currentValue": 25000,
    "interestRate": 2.5,
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

---

## 4. Update Asset
**PUT** `/api/assets/:id`

### Request Body (All fields optional)
```json
{
  "currentValue": 27000,
  "interestRate": 3.0
}
```

---

## 5. Delete Asset
**DELETE** `/api/assets/:id`

---

## 6. Delete All Assets
**DELETE** `/api/assets`

---

# 📉 Liabilities Endpoints

## 1. Get All Liabilities
**GET** `/api/liabilities`

### Query Parameters
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | Number | Page number | 1 | `?page=2` |
| `limit` | Number | Items per page | 10 | `?limit=20` |
| `type` | String | Filter by type | - | `?type=mortgage` |
| `sort` | String | Sort field | `dueDate` | `?sort=-outstandingAmount` |

### Example Request
```bash
GET http://localhost:3000/api/liabilities?type=mortgage&sort=dueDate
```

---

## 2. Get Single Liability
**GET** `/api/liabilities/:id`

### Example Request
```bash
GET http://localhost:3000/api/liabilities/671a5b8c9d4e2f3a1b5c6d7e
```

---

## 3. Create Liability
**POST** `/api/liabilities`

### Request Body
```json
{
  "liabilityName": "Home Mortgage",
  "type": "mortgage",
  "outstandingAmount": 350000,
  "interestRate": 3.75,
  "dueDate": "2025-02-01"
}
```

### Field Requirements
| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `liabilityName` | String | ✅ Yes | - | Name of the liability |
| `type` | String | ✅ Yes | loan, mortgage, personal-loan, car-loan, student-loan, medical, other | Category of liability |
| `outstandingAmount` | Number | ✅ Yes | ≥ 0 | Amount currently owed |
| `interestRate` | Number | ✅ Yes | 0-100 | Annual interest rate (%) |
| `dueDate` | Date | ✅ Yes | ISO 8601 | Next payment or final due date |

### Example Request (JavaScript Fetch)
```javascript
fetch('http://localhost:3000/api/liabilities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    liabilityName: "Car Loan",
    type: "car-loan",
    outstandingAmount: 15000,
    interestRate: 4.5,
    dueDate: "2025-02-15"
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Example Response
```json
{
  "success": true,
  "message": "Liability created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7f",
    "liabilityName": "Car Loan",
    "type": "car-loan",
    "outstandingAmount": 15000,
    "interestRate": 4.5,
    "dueDate": "2025-02-15T00:00:00.000Z",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

---

## 4. Update Liability
**PUT** `/api/liabilities/:id`

### Request Body (All fields optional)
```json
{
  "outstandingAmount": 14500,
  "dueDate": "2025-03-15"
}
```

---

## 5. Delete Liability
**DELETE** `/api/liabilities/:id`

---

## 6. Delete All Liabilities
**DELETE** `/api/liabilities`

---

# 💳 Credit Cards Endpoints

## 1. Get All Credit Cards
**GET** `/api/credit-cards`

### Query Parameters
| Parameter | Type | Description | Default | Example |
|-----------|------|-------------|---------|---------|
| `page` | Number | Page number | 1 | `?page=2` |
| `limit` | Number | Items per page | 10 | `?limit=20` |
| `bankName` | String | Filter by bank (case-insensitive) | - | `?bankName=Chase` |
| `sort` | String | Sort field | `dueDate` | `?sort=-creditLimit` |

### Example Request
```bash
GET http://localhost:3000/api/credit-cards?bankName=Chase&sort=dueDate
```

---

## 2. Get Single Credit Card
**GET** `/api/credit-cards/:id`

### Example Request
```bash
GET http://localhost:3000/api/credit-cards/671a5b8c9d4e2f3a1b5c6d7e
```

### Example Response (includes virtual fields)
```json
{
  "success": true,
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
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

**Note:** `availableCredit` and `utilizationRate` are automatically calculated virtual fields.

---

## 3. Create Credit Card
**POST** `/api/credit-cards`

### Request Body
```json
{
  "bankName": "Bank of America",
  "cardName": "Mastercard Gold",
  "creditLimit": 5000,
  "outstandingBalance": 1200,
  "interestRate": 19.99,
  "dueDate": "2025-02-10"
}
```

### Field Requirements
| Field | Type | Required | Options | Description |
|-------|------|----------|---------|-------------|
| `bankName` | String | ✅ Yes | - | Issuing bank name |
| `cardName` | String | ✅ Yes | - | Card name or type |
| `creditLimit` | Number | ✅ Yes | ≥ 0 | Maximum credit available |
| `outstandingBalance` | Number | ✅ Yes | ≥ 0, ≤ creditLimit | Current balance owed |
| `interestRate` | Number | ✅ Yes | 0-100 | Annual interest rate (APR %) |
| `dueDate` | Date | ✅ Yes | ISO 8601 | Next payment due date |

### Validation Rules
- `outstandingBalance` cannot exceed `creditLimit`
- All numbers must be non-negative
- Interest rate must be between 0 and 100

### Example Request (Axios)
```javascript
axios.post('http://localhost:3000/api/credit-cards', {
  bankName: "Citibank",
  cardName: "Visa Rewards",
  creditLimit: 8000,
  outstandingBalance: 2000,
  interestRate: 17.5,
  dueDate: "2025-02-20"
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

### Example Response
```json
{
  "success": true,
  "message": "Credit card created successfully",
  "data": {
    "_id": "671a5b8c9d4e2f3a1b5c6d7f",
    "bankName": "Citibank",
    "cardName": "Visa Rewards",
    "creditLimit": 8000,
    "outstandingBalance": 2000,
    "interestRate": 17.5,
    "dueDate": "2025-02-20T00:00:00.000Z",
    "availableCredit": 6000,
    "utilizationRate": "25.00",
    "createdAt": "2025-10-24T10:00:00.000Z",
    "updatedAt": "2025-10-24T10:00:00.000Z"
  }
}
```

---

## 4. Update Credit Card
**PUT** `/api/credit-cards/:id`

### Request Body (All fields optional)
```json
{
  "outstandingBalance": 1800,
  "dueDate": "2025-03-20"
}
```

---

## 5. Delete Credit Card
**DELETE** `/api/credit-cards/:id`

---

## 6. Delete All Credit Cards
**DELETE** `/api/credit-cards`

---

# ❌ Error Responses

## Validation Error
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Amount is required, Frequency is required"
}
```

## Not Found Error
```json
{
  "success": false,
  "error": "Not Found",
  "message": "Income record not found"
}
```

## Server Error
```json
{
  "success": false,
  "error": "Server Error",
  "message": "Database connection failed"
}
```

---

# 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors, malformed JSON |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database errors, server issues |

---

# 🧪 Testing Tools

## Postman Collection Variables
```
BASE_URL: http://localhost:3000
```

## cURL Examples

### Create Income (PowerShell)
```powershell
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

### Get All Assets
```bash
curl http://localhost:3000/api/assets
```

### Update Liability
```bash
curl -X PUT http://localhost:3000/api/liabilities/ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"outstandingAmount": 14000}'
```

---

# 📝 Quick Reference Table

| Resource | GET All | GET One | POST | PUT | DELETE | DELETE All |
|----------|---------|---------|------|-----|--------|------------|
| **Income** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Assets** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Liabilities** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Credit Cards** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**All endpoints support:**
- ✅ Pagination (`page`, `limit`)
- ✅ Sorting (`sort=field` or `sort=-field`)
- ✅ Filtering (by type/category)
- ✅ Full CRUD operations

---

# 🎯 Common Query Patterns

## Pagination
```
GET /api/income?page=2&limit=20
```

## Sorting (Ascending)
```
GET /api/assets?sort=currentValue
```

## Sorting (Descending)
```
GET /api/assets?sort=-currentValue
```

## Filtering
```
GET /api/income?frequency=monthly
GET /api/assets?assetsType=stocks
GET /api/liabilities?type=mortgage
GET /api/credit-cards?bankName=Chase
```

## Combined
```
GET /api/liabilities?type=loan&sort=dueDate&page=1&limit=10
```

---

# 📌 Notes

1. **Date Format:** All dates should be in ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss.sssZ`
2. **IDs:** MongoDB ObjectId format (24 hex characters)
3. **Numbers:** Use decimal notation (e.g., `1234.56`, not `"1234.56"`)
4. **Enum Values:** Must match exactly (case-sensitive after lowercase conversion)
5. **Virtual Fields:** Credit Cards include calculated `availableCredit` and `utilizationRate`

---

# 🔗 Additional Resources

- **Full Documentation:** See `FINANCIAL_API_DOCUMENTATION.md`
- **Setup Guide:** See `README.md`
- **Code Examples:** See `API_EXAMPLES.md`
- **GitHub Repository:** https://github.com/sewminiherath/WealthManagement_Application_Backend.git

---

**Last Updated:** October 24, 2025  
**API Version:** 3.0.0  
**Server:** http://localhost:3000

