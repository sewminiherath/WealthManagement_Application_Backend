# Step 4: Models Implementation

## Overview
This step covers creating Mongoose schemas for User and Item models with validation, methods, and middleware hooks.

## Date
October 24, 2025

## Objectives
1. Create User model with authentication features
2. Create Item model with validation
3. Implement password hashing
4. Add instance and static methods
5. Set up indexes for performance

---

## 1. User Model

### File Created: `src/models/User.js`

**Purpose**: Define user schema with authentication capabilities

**Full Code**: [67 lines]
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
```

### Schema Fields Explained

#### name Field
```javascript
name: {
  type: String,
  required: [true, 'Please provide a name'],
  trim: true,
  maxlength: [50, 'Name cannot be more than 50 characters'],
}
```

**Validators**:
- `required`: Cannot be empty
- `trim`: Removes whitespace from both ends
- `maxlength`: Prevents overly long names

**Example Valid Values**:
- "John Doe" ✅
- "  Jane  " → "Jane" (trimmed) ✅

**Example Invalid Values**:
- "" (empty) ❌
- " " (only spaces) ❌
- "A very long name that exceeds fifty characters limit..." ❌

#### email Field
```javascript
email: {
  type: String,
  required: [true, 'Please provide an email'],
  unique: true,
  lowercase: true,
  trim: true,
  match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'Please provide a valid email',
  ],
}
```

**Validators**:
- `required`: Cannot be empty
- `unique`: No duplicate emails (creates index)
- `lowercase`: Converts to lowercase
- `trim`: Removes whitespace
- `match`: Regex validation for email format

**Regex Breakdown**:
- `^\w+` - Starts with word characters
- `([\.-]?\w+)*` - Optional dots/hyphens with word characters
- `@` - Must contain @
- `\w+` - Domain name
- `([\.-]?\w+)*` - Subdomains
- `(\.\w{2,3})+` - TLD (.com, .org, etc.)

**Example Valid Values**:
- "john@example.com" ✅
- "Jane.Doe@company.co.uk" ✅
- "USER@DOMAIN.COM" → "user@domain.com" (lowercased) ✅

**Example Invalid Values**:
- "notanemail" ❌
- "missing@domain" ❌
- "@nodomain.com" ❌

#### password Field
```javascript
password: {
  type: String,
  required: [true, 'Please provide a password'],
  minlength: [6, 'Password must be at least 6 characters'],
  select: false,
}
```

**Validators**:
- `required`: Cannot be empty
- `minlength`: Security requirement
- `select: false`: **NOT returned in queries by default**

**select: false Importance**:
- Prevents accidental password leaks
- Must explicitly request: `User.findById(id).select('+password')`
- Security best practice

**Example**:
```javascript
// Password NOT included
const user = await User.findById(id);
console.log(user.password); // undefined

// Password included when needed
const user = await User.findById(id).select('+password');
console.log(user.password); // $2a$10$hash...
```

#### role Field
```javascript
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
}
```

**Validators**:
- `enum`: Only allows 'user' or 'admin'
- `default`: New users are 'user' role

**Role-Based Access**:
- **user**: Basic access, own resources
- **admin**: Full access, all resources

#### isActive Field
```javascript
isActive: {
  type: Boolean,
  default: true,
}
```

**Purpose**: Soft delete mechanism
- `true`: Account is active
- `false`: Account deactivated (but not deleted)

**Use Cases**:
- Suspend accounts without deleting data
- Reactivate accounts later
- Audit trail preservation

#### timestamps Option
```javascript
{
  timestamps: true
}
```

**Automatically Adds**:
- `createdAt`: When document was created
- `updatedAt`: When document was last modified

**Managed By**: Mongoose (no manual updates needed)

### Pre-Save Hook (Middleware)

```javascript
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

**Purpose**: Hash password before saving to database

**When It Runs**:
- Before `user.save()`
- Before `User.create()`
- NOT on `User.findByIdAndUpdate()` (use save() instead)

**isModified Check**:
```javascript
if (!this.isModified('password')) {
  return next();
}
```
- Prevents re-hashing already hashed passwords
- Important for updates that don't change password

**Example Scenario**:
```javascript
// Create new user - password IS modified
const user = new User({ name: 'John', email: 'john@test.com', password: 'plain123' });
await user.save(); // Hook runs, password hashed

// Update name - password NOT modified
user.name = 'Jane';
await user.save(); // Hook runs but skips hashing

// Update password - password IS modified
user.password = 'newplain456';
await user.save(); // Hook runs, new password hashed
```

**bcrypt.genSalt(10)**:
- Generates random salt
- `10` is cost factor (2^10 = 1024 rounds)
- Higher = more secure but slower
- 10 is recommended balance

**bcrypt.hash(password, salt)**:
- Combines password with salt
- Creates irreversible hash
- Same password + different salt = different hash

**Example Hash**:
```
Plain: "password123"
Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

### Instance Methods

#### comparePassword Method
```javascript
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

**Purpose**: Verify password during login

**Usage**:
```javascript
const user = await User.findOne({ email }).select('+password');
const isMatch = await user.comparePassword(enteredPassword);
if (isMatch) {
  // Login successful
}
```

**How It Works**:
- bcrypt.compare() extracts salt from hash
- Hashes entered password with same salt
- Compares resulting hashes
- Returns true/false

**Example**:
```javascript
// Stored hash: $2a$10$xyz...abc
// User enters: "password123"
// bcrypt extracts salt from hash
// bcrypt hashes "password123" with same salt
// Compares: hash === stored_hash
// Returns: true
```

#### toJSON Method
```javascript
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};
```

**Purpose**: Remove password from JSON responses

**When It Runs**:
- Automatically when sending response: `res.json(user)`
- When: `JSON.stringify(user)`

**Before toJSON**:
```json
{
  "_id": "64abc123",
  "name": "John",
  "email": "john@test.com",
  "password": "$2a$10$hash...",
  "role": "user"
}
```

**After toJSON**:
```json
{
  "_id": "64abc123",
  "name": "John",
  "email": "john@test.com",
  "role": "user"
}
```

### User Model Export
```javascript
module.exports = mongoose.model('User', userSchema);
```

**Creates**:
- Model named 'User'
- Collection named 'users' (lowercase, plural)
- Based on userSchema

---

## 2. Item Model

### File Created: `src/models/Item.js`

**Purpose**: Define item/product schema with validation

**Full Code**: [55 lines]
```javascript
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an item name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    quantity: {
      type: Number,
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      trim: true,
      enum: {
        values: ['electronics', 'clothing', 'food', 'books', 'other'],
        message: '{VALUE} is not a valid category',
      },
      default: 'other',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'discontinued'],
      default: 'active',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster searches
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Item', itemSchema);
```

### Schema Fields Explained

#### name Field
```javascript
name: {
  type: String,
  required: [true, 'Please provide an item name'],
  trim: true,
  maxlength: [100, 'Name cannot be more than 100 characters'],
}
```
- Required field for item identification
- Longer max length than user name (100 vs 50)

#### description Field
```javascript
description: {
  type: String,
  trim: true,
  maxlength: [500, 'Description cannot be more than 500 characters'],
}
```
- Optional field (not required)
- Longer text for detailed information

#### price Field
```javascript
price: {
  type: Number,
  min: [0, 'Price cannot be negative'],
  default: 0,
}
```
- Number type for calculations
- Cannot be negative
- Defaults to 0 (free item)

**Usage**:
```javascript
{ price: 99.99 }  // $99.99
{ price: 0 }      // Free
{ price: -10 }    // Error: Price cannot be negative
```

#### quantity Field
```javascript
quantity: {
  type: Number,
  min: [0, 'Quantity cannot be negative'],
  default: 0,
}
```
- Inventory tracking
- Cannot be negative
- 0 = out of stock

#### category Field
```javascript
category: {
  type: String,
  trim: true,
  enum: {
    values: ['electronics', 'clothing', 'food', 'books', 'other'],
    message: '{VALUE} is not a valid category',
  },
  default: 'other',
}
```

**Enum Values**:
- `electronics` - Tech products
- `clothing` - Apparel
- `food` - Food items
- `books` - Books, magazines
- `other` - Miscellaneous

**Custom Error Message**:
- `{VALUE}` is replaced with invalid value
- Example: "invalid_category is not a valid category"

#### status Field
```javascript
status: {
  type: String,
  enum: ['active', 'inactive', 'discontinued'],
  default: 'active',
}
```

**Status Values**:
- `active` - Available for sale
- `inactive` - Temporarily unavailable
- `discontinued` - No longer sold

#### tags Field
```javascript
tags: [{
  type: String,
  trim: true,
}]
```
- Array of strings
- Optional
- Flexible tagging system

**Example**:
```javascript
{
  name: "Laptop",
  tags: ["computer", "electronics", "portable", "work"]
}
```

#### createdBy Field
```javascript
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
}
```
- Reference to User model
- Tracks who created item
- Enables ownership validation
- Can be populated

**Usage**:
```javascript
// Without populate
const item = await Item.findById(id);
console.log(item.createdBy); // "64abc123..." (just ID)

// With populate
const item = await Item.findById(id).populate('createdBy');
console.log(item.createdBy); // { _id: "64abc123...", name: "John", email: "..." }
```

### Indexes

```javascript
itemSchema.index({ name: 'text', description: 'text' });
itemSchema.index({ category: 1, status: 1 });
```

#### Text Index
```javascript
itemSchema.index({ name: 'text', description: 'text' });
```
- Enables full-text search
- Searches both name and description
- Used with `$text` operator

**Usage**:
```javascript
// Search for items containing "laptop"
Item.find({ $text: { $search: 'laptop' } });
```

#### Compound Index
```javascript
itemSchema.index({ category: 1, status: 1 });
```
- Optimizes queries filtering by category and status
- `1` means ascending order
- Makes category/status filtering faster

**Optimized Query**:
```javascript
Item.find({ category: 'electronics', status: 'active' });
// Uses index, very fast
```

**Benefits**:
- ✅ Faster queries
- ✅ Reduced database load
- ✅ Better performance at scale

---

## 3. Model Comparison

| Feature | User Model | Item Model |
|---------|-----------|-----------|
| **Primary Purpose** | Authentication | Resource management |
| **Key Fields** | email, password, role | name, price, category |
| **Relationships** | None (base entity) | References User (createdBy) |
| **Special Methods** | comparePassword() | None |
| **Hooks** | pre('save') password hashing | None |
| **Indexes** | email (unique) | text search, compound |
| **Security** | Password hashing, select: false | Ownership tracking |

---

## 4. Mongoose Features Used

### Schema Definition
```javascript
new mongoose.Schema({ fields }, { options })
```

### Field Validators
- `required` - Cannot be empty
- `unique` - No duplicates
- `minlength` / `maxlength` - String length
- `min` / `max` - Number range
- `enum` - Allowed values only
- `match` - Regex validation

### Field Modifiers
- `trim` - Remove whitespace
- `lowercase` / `uppercase` - Case conversion
- `default` - Default value
- `select` - Include/exclude from queries

### Schema Options
- `timestamps` - Auto createdAt/updatedAt
- `toJSON` - Customize JSON output

### Middleware (Hooks)
- `pre('save')` - Before saving
- `post('save')` - After saving

### Instance Methods
- Custom methods on documents
- `schema.methods.methodName = function() {}`

### Static Methods
- Custom methods on model
- `schema.statics.methodName = function() {}`

### Indexes
- `schema.index({ field: 1 })` - Single field
- `schema.index({ field1: 1, field2: 1 })` - Compound
- `schema.index({ field: 'text' })` - Text search

---

## 5. Security Features

### User Model Security
1. **Password Hashing** - bcrypt with salt
2. **select: false** - Password not returned by default
3. **Password Comparison** - Secure verification method
4. **toJSON Override** - Removes password from responses
5. **Role-Based Access** - Admin vs user roles
6. **Active Status** - Soft delete capability

### Item Model Security
1. **Ownership Tracking** - createdBy field
2. **Validation** - Prevent invalid data
3. **Status Control** - Manage availability
4. **Category Restriction** - Only valid categories

---

## Files Created in This Step

1. ✅ `src/models/User.js` - User schema (67 lines)
2. ✅ `src/models/Item.js` - Item schema (55 lines)

**Total**: 2 model files, ~122 lines

---

**Step 4 Complete! ✅**

*Next: Step 5 - Middleware Implementation (auth, validation, error handling)*

