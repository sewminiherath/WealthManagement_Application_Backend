# Step 6: Controllers Implementation

## Overview
This step covers implementing controllers for authentication, user management, and item management with complete business logic.

## Date
October 24, 2025

## Objectives
1. Create authentication controller (register, login, profile)
2. Create user management controller (CRUD operations)
3. Create item management controller (CRUD with advanced features)
4. Implement ownership validation
5. Add pagination, filtering, and sorting

---

## 1. Authentication Controller

### File Created: `src/controllers/auth.controller.js`

**Purpose**: Handle all authentication-related operations

**Functions**: 4 main functions
- register
- login
- getMe
- updatePassword

### Register Function

```javascript
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'User already exists with this email',
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});
```

**Flow**:
1. Extract name, email, password from request body
2. Check if email already registered
3. Create new user (password auto-hashed by model hook)
4. Generate JWT token
5. Return user info and token

**Response Example**:
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
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login Function

```javascript
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Your account has been deactivated',
    });
  }

  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  });
});
```

**Security Features**:
- `.select('+password')` - Explicitly include password (normally excluded)
- Generic error message for invalid credentials
- Active account check
- Password comparison using bcrypt

### Get Current User (getMe)

```javascript
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});
```

**Notes**:
- `req.user` available from `protect` middleware
- Returns full user profile
- Protected route (requires authentication)

### Update Password

```javascript
exports.updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Please provide current password and new password',
    });
  }

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Current password is incorrect',
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
    data: {
      token,
    },
  });
});
```

**Security**:
- Requires current password verification
- Password hashing triggered by save() hook
- New token generated after update
- Protected route

---

## 2. User Controller

### File Created: `src/controllers/user.controller.js`

**Purpose**: Manage user accounts (admin operations and profile updates)

**Functions**: 5 functions
- getAllUsers
- getUser
- updateUser
- deleteUser
- updateProfile

### Get All Users (Admin)

```javascript
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
```

**Purpose**: List all users (admin only)
**Security**: Password excluded from results

### Get Single User (Admin)

```javascript
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User not found with id ${req.params.id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
```

**Purpose**: View specific user details (admin only)

### Update User (Admin)

```javascript
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User not found with id ${req.params.id}`,
    });
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});
```

**Features**:
- Selective field updates
- Admin can change role
- Admin can activate/deactivate accounts

### Delete User (Admin)

```javascript
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User not found with id ${req.params.id}`,
    });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {},
  });
});
```

**Purpose**: Permanently delete user account (admin only)

### Update Profile (Any User)

```javascript
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});
```

**Features**:
- Users can update own name and email
- Cannot change role or isActive (only admin)
- Uses req.user (from protect middleware)

---

## 3. Item Controller

### File Created: `src/controllers/item.controller.js`

**Purpose**: Manage items with CRUD, pagination, filtering, sorting, and search

**Functions**: 6 functions
- getAllItems
- getItem
- createItem
- updateItem
- deleteItem
- deleteAllItems

### Get All Items (with Advanced Features)

```javascript
exports.getAllItems = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Filtering
  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.minPrice) {
    query.price = { ...query.price, $gte: parseFloat(req.query.minPrice) };
  }

  if (req.query.maxPrice) {
    query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
  }

  // Search by name or description
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Sorting
  let sort = '-createdAt'; // Default: newest first
  if (req.query.sort) {
    sort = req.query.sort.split(',').join(' ');
  }

  // Execute query
  const items = await Item.find(query)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Item.countDocuments(query);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: items,
  });
});
```

**Advanced Features Breakdown**:

#### 1. Pagination
```javascript
const page = parseInt(req.query.page, 10) || 1;
const limit = parseInt(req.query.limit, 10) || 10;
const skip = (page - 1) * limit;
```
- Default: Page 1, 10 items per page
- skip calculation: Page 2 with limit 10 = skip 10

**Example URLs**:
- `/api/items?page=1&limit=20` - First 20 items
- `/api/items?page=3&limit=10` - Items 21-30

#### 2. Category Filtering
```javascript
if (req.query.category) {
  query.category = req.query.category;
}
```
**Example**: `/api/items?category=electronics`

#### 3. Status Filtering
```javascript
if (req.query.status) {
  query.status = req.query.status;
}
```
**Example**: `/api/items?status=active`

#### 4. Price Range Filtering
```javascript
if (req.query.minPrice) {
  query.price = { ...query.price, $gte: parseFloat(req.query.minPrice) };
}
if (req.query.maxPrice) {
  query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
}
```
**MongoDB Operators**:
- `$gte` - Greater than or equal
- `$lte` - Less than or equal

**Example**: `/api/items?minPrice=100&maxPrice=1000`

#### 5. Text Search
```javascript
if (req.query.search) {
  query.$or = [
    { name: { $regex: req.query.search, $options: 'i' } },
    { description: { $regex: req.query.search, $options: 'i' } },
  ];
}
```
**Features**:
- `$or` - Match either name OR description
- `$regex` - Pattern matching
- `i` option - Case insensitive

**Example**: `/api/items?search=laptop`

#### 6. Sorting
```javascript
let sort = '-createdAt'; // Default newest first
if (req.query.sort) {
  sort = req.query.sort.split(',').join(' ');
}
```
**Sort Formats**:
- `sort=price` - Ascending price
- `sort=-price` - Descending price
- `sort=-createdAt,name` - Newest first, then by name

**MongoDB Sorting**:
- Positive: Ascending
- Negative (minus): Descending

#### 7. Population
```javascript
.populate('createdBy', 'name email')
```
- Replaces createdBy ID with user object
- Only includes name and email fields

#### 8. Pagination Metadata
```javascript
pagination: {
  page: 1,
  limit: 10,
  pages: 5  // Total pages
}
```

**Complex Query Example**:
```
GET /api/items?
  page=2&
  limit=20&
  category=electronics&
  status=active&
  minPrice=100&
  maxPrice=1000&
  search=laptop&
  sort=-price
```

### Create Item

```javascript
exports.createItem = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
});
```

**Features**:
- Automatically sets createdBy to current user
- Protected route (requires authentication)
- Returns 201 Created status

### Update Item (with Ownership Check)

```javascript
exports.updateItem = asyncHandler(async (req, res) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item not found with id ${req.params.id}`,
    });
  }

  // Check ownership or admin
  if (
    item.createdBy &&
    item.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Not authorized to update this item',
    });
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});
```

**Authorization Logic**:
- Owner can update their items
- Admin can update any item
- Others get 403 Forbidden

**findByIdAndUpdate Options**:
- `new: true` - Return updated document
- `runValidators: true` - Run schema validation

### Delete Item (with Ownership Check)

```javascript
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item not found with id ${req.params.id}`,
    });
  }

  // Check ownership or admin
  if (
    item.createdBy &&
    item.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Not authorized to delete this item',
    });
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
    data: {},
  });
});
```

**Security**: Same ownership check as update

### Delete All Items (Admin Only)

```javascript
exports.deleteAllItems = asyncHandler(async (req, res) => {
  const result = await Item.deleteMany({});

  res.status(200).json({
    success: true,
    message: `All items deleted successfully (${result.deletedCount} items)`,
    data: { deletedCount: result.deletedCount },
  });
});
```

**Purpose**: Admin utility to clear all items
**Protected**: Admin role required (in route)

---

## 4. Controller Patterns Used

### Async Handler Wrapper
```javascript
exports.functionName = asyncHandler(async (req, res) => {
  // Controller logic
});
```
- Automatically catches errors
- Passes errors to error handler middleware

### Consistent Response Format
```javascript
{
  "success": true/false,
  "message": "Operation message",
  "data": { ... }
}
```

### Error Response Format
```javascript
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed message"
}
```

### HTTP Status Codes
- 200 - OK (successful GET, PUT, DELETE)
- 201 - Created (successful POST)
- 400 - Bad Request (validation error)
- 401 - Unauthorized (authentication required/failed)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found (resource doesn't exist)
- 500 - Server Error (unexpected error)

---

## 5. Business Logic Summary

### Authentication Controller
- User registration with duplicate check
- Login with password verification
- Get current user profile
- Password update with verification

### User Controller
- Admin: Full user management (CRUD)
- User: Profile management (own account)
- Soft delete capability (isActive field)

### Item Controller
- CRUD operations with ownership validation
- Advanced pagination (page, limit)
- Multiple filters (category, status, price range)
- Text search (name, description)
- Multi-field sorting
- Population (show creator info)

---

## Files Created in This Step

1. ✅ `src/controllers/auth.controller.js` - Authentication (4 functions, ~130 lines)
2. ✅ `src/controllers/user.controller.js` - User management (5 functions, ~100 lines)
3. ✅ `src/controllers/item.controller.js` - Item management (6 functions, ~200 lines)

**Total**: 3 controller files, 15 functions, ~430 lines

---

**Step 6 Complete! ✅**

*Next: Step 7 - Routes Implementation (API endpoint definitions)*


