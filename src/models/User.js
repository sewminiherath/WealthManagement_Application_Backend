/**
 * User Model
 * 
 * Mongoose schema and model for user authentication and authorization.
 * Includes password hashing, validation, and instance methods for authentication.
 * Uses bcrypt for secure password storage with automatic hashing on save.
 * 
 * @module models/User
 * @requires mongoose
 * @requires bcryptjs
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * 
 * Defines the structure and validation rules for user documents in MongoDB.
 * Includes fields for authentication (email, password), authorization (role),
 * and account management (name, isActive). Passwords are automatically hashed
 * before saving using pre-save middleware hook.
 * 
 * @typedef {Object} UserSchema
 * @property {string} name - User's full name (required, max 50 chars)
 * @property {string} email - User's email address (required, unique, lowercase)
 * @property {string} password - Hashed password (required, min 6 chars, not returned by default)
 * @property {string} role - User role (enum: 'user'|'admin', default: 'user')
 * @property {boolean} isActive - Account active status (default: true, soft delete)
 * @property {Date} createdAt - Timestamp when user was created (auto-generated)
 * @property {Date} updatedAt - Timestamp when user was last updated (auto-generated)
 */
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
      select: false, // Don't return password by default
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
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

/**
 * Pre-save Hook: Hash Password Before Saving
 * 
 * Mongoose middleware that runs before saving a user document.
 * Automatically hashes the password using bcrypt if it has been modified.
 * Skips hashing if password hasn't changed (important for updates that don't touch password).
 * Uses bcrypt with 10 salt rounds for security.
 * 
 * @memberof User
 * @hook pre('save')
 * @async
 * @param {Function} next - Callback to continue to next middleware
 * 
 * @example
 * // Password automatically hashed on save
 * const user = new User({ name: 'John', email: 'john@test.com', password: 'plain123' });
 * await user.save(); // password is now hashed
 * 
 * @example
 * // Password NOT re-hashed if not modified
 * user.name = 'Jane';
 * await user.save(); // password stays the same (not re-hashed)
 * 
 * @throws {Error} Passes bcrypt errors to next() for error handling
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
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

/**
 * Compare Entered Password with Hashed Password
 * 
 * Instance method to verify if an entered password matches the stored hashed password.
 * Uses bcrypt.compare() which handles salt extraction and comparison automatically.
 * This method should be called during login to verify user credentials.
 * 
 * @memberof User
 * @instance
 * @async
 * @function comparePassword
 * @param {string} enteredPassword - Plain text password entered by user during login
 * @returns {Promise<boolean>} True if password matches, false otherwise
 * 
 * @example
 * // During login
 * const user = await User.findOne({ email }).select('+password');
 * const isMatch = await user.comparePassword(enteredPassword);
 * if (isMatch) {
 *   // Login successful
 * } else {
 *   // Invalid credentials
 * }
 * 
 * @throws {Error} Bcrypt comparison errors (rarely occurs)
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Remove Password from JSON Response
 * 
 * Overrides the default toJSON method to exclude password field from JSON responses.
 * Ensures password is never accidentally sent to client in API responses.
 * Called automatically when user object is serialized (res.json(user)).
 * Additional security layer on top of select: false in schema.
 * 
 * @memberof User
 * @instance
 * @function toJSON
 * @returns {Object} User object without password field
 * 
 * @example
 * // Password automatically removed when sending response
 * const user = await User.findById(id).select('+password'); // includes password
 * res.json(user); // password NOT included in response due to toJSON
 * 
 * @example
 * // Manual JSON stringification
 * const user = await User.findById(id);
 * const jsonString = JSON.stringify(user); // password NOT included
 */
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/**
 * User Model
 * 
 * Mongoose model for user collection in MongoDB.
 * Provides methods for querying, creating, updating, and deleting users.
 * Collection name in database will be 'users' (lowercase, plural).
 * 
 * @typedef {mongoose.Model} User
 * @property {Function} create - Create new user
 * @property {Function} findOne - Find one user by criteria
 * @property {Function} findById - Find user by MongoDB ObjectId
 * @property {Function} find - Find multiple users
 * @property {Function} findByIdAndUpdate - Find and update user by ID
 * @property {Function} findByIdAndDelete - Find and delete user by ID
 * 
 * @example
 * // Create new user
 * const user = await User.create({ name: 'John', email: 'john@test.com', password: 'pass123' });
 * 
 * @example
 * // Find user by email
 * const user = await User.findOne({ email: 'john@test.com' });
 * 
 * @example
 * // Find user with password (explicitly select it)
 * const user = await User.findOne({ email: 'john@test.com' }).select('+password');
 * 
 * @example
 * // Update user
 * const user = await User.findByIdAndUpdate(userId, { name: 'Jane' }, { new: true });
 */
module.exports = mongoose.model('User', userSchema);
