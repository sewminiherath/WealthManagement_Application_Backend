// Import required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const getMorganMiddleware = require('./src/config/morgan');
const connectDB = require('./src/config/database');
const corsOptions = require('./src/config/cors');
const { apiLimiter } = require('./src/config/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet()); // Set security headers

// CORS
app.use(cors(corsOptions)); // Enable CORS with options

// Body Parser Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Logging Middleware
// Apply Morgan middleware (returns array of middleware based on environment)
const morganMiddleware = getMorganMiddleware();
morganMiddleware.forEach(middleware => app.use(middleware));

// Rate Limiting
app.use('/api/', apiLimiter);

// Import routes
const apiRoutes = require('./src/routes/api.routes');
// Financial Management routes
const incomeRoutes = require('./src/routes/income.routes');
const assetsRoutes = require('./src/routes/assets.routes');
const liabilityRoutes = require('./src/routes/liability.routes');
const creditCardRoutes = require('./src/routes/creditCard.routes');

// Mount financial management routes
app.use('/api/income', incomeRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/liabilities', liabilityRoutes);
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Express REST API Server - Financial Manager',
    version: '3.0.0',
    status: 'running',
    documentation: '/api',
    endpoints: {
      api: '/api',
      income: '/api/income',
      assets: '/api/assets',
      liabilities: '/api/liabilities',
      creditCards: '/api/credit-cards',
      health: '/api/health',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler (must be after all routes)
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server is running in ${NODE_ENV} mode on port ${PORT}`);
  logger.info(`📍 Local: http://localhost:${PORT}`);
  logger.info(`📚 API Documentation: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
