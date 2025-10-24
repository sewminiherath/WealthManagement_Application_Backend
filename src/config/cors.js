/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * Configures CORS settings for the Express application to allow cross-origin
 * requests from specified frontend origins. Enables credentials (cookies, JWT)
 * to be sent with requests. Specifies allowed HTTP methods and headers.
 * 
 * @constant {Object} corsOptions - CORS configuration object for cors middleware
 * @property {string} origin - Allowed origin URL for CORS requests (from CLIENT_URL env var)
 * @property {boolean} credentials - Allow credentials (cookies, authorization headers) to be included
 * @property {number} optionsSuccessStatus - HTTP status code for successful OPTIONS requests (200 for legacy browser support)
 * @property {string[]} methods - Allowed HTTP methods for CORS requests
 * @property {string[]} allowedHeaders - Allowed HTTP headers in CORS requests
 * 
 * @example
 * // In server.js
 * const cors = require('cors');
 * const corsOptions = require('./config/cors');
 * app.use(cors(corsOptions));
 * 
 * @requires CLIENT_URL environment variable (defaults to http://localhost:3000)
 */
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;


