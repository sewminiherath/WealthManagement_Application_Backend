# API Testing Examples

This document provides practical examples for testing all API endpoints using cURL, Postman, or any HTTP client.

## Base URL

```
http://localhost:3000
```

---

## 🔐 Authentication Endpoints

### 1. Register a New User

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64abc123def456...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64abc123def456...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc123def456...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 4. Update Password

**Request:**
```bash
curl -X PUT http://localhost:3000/api/auth/updatepassword \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

---

## 📦 Item Endpoints

### 1. Get All Items (Public)

**Basic Request:**
```bash
curl -X GET http://localhost:3000/api/items
```

**With Pagination:**
```bash
curl -X GET "http://localhost:3000/api/items?page=1&limit=10"
```

**With Filtering:**
```bash
curl -X GET "http://localhost:3000/api/items?category=electronics&status=active"
```

**With Price Range:**
```bash
curl -X GET "http://localhost:3000/api/items?minPrice=100&maxPrice=1000"
```

**With Search:**
```bash
curl -X GET "http://localhost:3000/api/items?search=laptop"
```

**With Sorting:**
```bash
# Sort by price ascending
curl -X GET "http://localhost:3000/api/items?sort=price"

# Sort by price descending
curl -X GET "http://localhost:3000/api/items?sort=-price"

# Sort by multiple fields
curl -X GET "http://localhost:3000/api/items?sort=-createdAt,name"
```

**Complex Query:**
```bash
curl -X GET "http://localhost:3000/api/items?page=1&limit=20&category=electronics&minPrice=100&maxPrice=1000&status=active&search=laptop&sort=-price"
```

**Expected Response (200):**
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
      "tags": ["computer", "tech"],
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

### 2. Get Single Item by ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/items/64abc456...
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64abc456...",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "quantity": 10,
    "category": "electronics",
    "status": "active",
    "tags": ["computer", "tech"],
    "createdBy": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
}
```

### 3. Create New Item (Protected)

**Request:**
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 599.99,
    "quantity": 50,
    "category": "electronics",
    "tags": ["mobile", "tech"]
  }'
```

**Expected Response (201):**
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
    "createdAt": "2024-01-01T11:00:00.000Z",
    "updatedAt": "2024-01-01T11:00:00.000Z"
  }
}
```

### 4. Update Item (Protected)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/items/64abc789... \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 549.99,
    "quantity": 45,
    "status": "active"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "_id": "64abc789...",
    "name": "Smartphone",
    "description": "Latest model smartphone",
    "price": 549.99,
    "quantity": 45,
    "category": "electronics",
    "status": "active",
    "tags": ["mobile", "tech"],
    "createdBy": "64abc123...",
    "createdAt": "2024-01-01T11:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

### 5. Delete Item (Protected)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/items/64abc789... \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Item deleted successfully",
  "data": {}
}
```

### 6. Delete All Items (Admin Only)

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/items \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "All items deleted successfully (25 items)",
  "data": {
    "deletedCount": 25
  }
}
```

---

## 👥 User Management Endpoints (Admin Only)

### 1. Get All Users

**Request:**
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 2. Get User by ID

**Request:**
```bash
curl -X GET http://localhost:3000/api/users/64abc123... \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 3. Update User

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/64abc123... \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "role": "admin",
    "isActive": true
  }'
```

### 4. Delete User

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/64abc123... \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

### 5. Update Own Profile (Any Authenticated User)

**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "email": "john.new@example.com"
  }'
```

---

## 🏥 Health Check Endpoints

### 1. Root Health Check

**Request:**
```bash
curl -X GET http://localhost:3000/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "uptime": 12345.67,
  "environment": "development"
}
```

### 2. API Health Check

**Request:**
```bash
curl -X GET http://localhost:3000/api/health
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "uptime": 12345.67
}
```

### 3. API Documentation

**Request:**
```bash
curl -X GET http://localhost:3000/api
```

---

## ❌ Error Response Examples

### 400 - Bad Request (Validation Error)

```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Not authorized to access this route. Please login."
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "error": "Forbidden",
  "message": "User role 'user' is not authorized to access this route."
}
```

### 404 - Not Found

```json
{
  "success": false,
  "error": "Not Found",
  "message": "Item not found with id 64abc789..."
}
```

### 429 - Too Many Requests

```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "error": "Server Error"
}
```

---

## 🧪 Testing Workflow

### Complete User Journey

1. **Register a new user**
2. **Login and save the token**
3. **Get your profile**
4. **Create an item**
5. **Get all items**
6. **Update the item**
7. **Delete the item**

### Example Script:

```bash
#!/bin/bash

# 1. Register
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}')

echo "Register: $REGISTER_RESPONSE"

# Extract token (requires jq)
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')

# 2. Create Item
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Test","price":99.99,"category":"other"}'

# 3. Get All Items
curl -X GET http://localhost:3000/api/items

# 4. Get My Profile
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Notes

- Replace `YOUR_TOKEN_HERE` with the actual JWT token received from login/register
- Replace `ADMIN_TOKEN_HERE` with a token from a user with admin role
- Replace IDs (like `64abc123...`) with actual MongoDB ObjectIDs
- All timestamps are in ISO 8601 format
- Prices are stored as numbers with 2 decimal places

## 🔗 Postman

Import these endpoints into Postman:
1. Create a new collection
2. Add environment variables:
   - `BASE_URL`: `http://localhost:3000`
   - `TOKEN`: `<will be set after login>`
3. Set up pre-request scripts to automatically update the token after login


