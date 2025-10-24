const jwt = require('jsonwebtoken');

/**
 * Generate JWT authentication token
 * 
 * Creates a signed JSON Web Token containing the user's ID in the payload.
 * Token is signed with JWT_SECRET from environment variables and includes
 * an expiration time (default 7 days). Used after successful login/registration.
 * 
 * @function generateToken
 * @param {string} userId - MongoDB ObjectId of the user as a string
 * @returns {string} Signed JWT token string
 * 
 * @example
 * const token = generateToken('64abc123def456');
 * // Returns: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 * 
 * @requires JWT_SECRET environment variable
 * @requires JWT_EXPIRE environment variable (optional, defaults to '7d')
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Verify and decode JWT token
 * 
 * Verifies the signature of a JWT token using the secret key from environment
 * variables. Decodes the token payload if valid. Catches any JWT errors
 * (invalid signature, expired token, malformed token) and returns null.
 * 
 * @function verifyToken
 * @param {string} token - JWT token string to verify
 * @returns {Object|null} Decoded token payload with user ID and timestamps if valid, null if invalid
 * @returns {string} returns.id - User ID from token payload
 * @returns {number} returns.iat - Token issued at timestamp
 * @returns {number} returns.exp - Token expiration timestamp
 * 
 * @example
 * const decoded = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * if (decoded) {
 *   console.log(decoded.id); // '64abc123def456'
 *   console.log(decoded.exp); // 1234567890
 * } else {
 *   console.log('Invalid or expired token');
 * }
 * 
 * @requires JWT_SECRET environment variable
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};


