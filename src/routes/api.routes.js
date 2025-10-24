const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API info route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Express REST API - Financial Manager',
    version: '3.0.0',
    endpoints: {
      income: {
        getAll: 'GET /api/income',
        getOne: 'GET /api/income/:id',
        create: 'POST /api/income',
        update: 'PUT /api/income/:id',
        delete: 'DELETE /api/income/:id',
        deleteAll: 'DELETE /api/income',
      },
      assets: {
        getAll: 'GET /api/assets',
        getOne: 'GET /api/assets/:id',
        create: 'POST /api/assets',
        update: 'PUT /api/assets/:id',
        delete: 'DELETE /api/assets/:id',
        deleteAll: 'DELETE /api/assets',
      },
      liabilities: {
        getAll: 'GET /api/liabilities',
        getOne: 'GET /api/liabilities/:id',
        create: 'POST /api/liabilities',
        update: 'PUT /api/liabilities/:id',
        delete: 'DELETE /api/liabilities/:id',
        deleteAll: 'DELETE /api/liabilities',
      },
      creditCards: {
        getAll: 'GET /api/credit-cards',
        getOne: 'GET /api/credit-cards/:id',
        create: 'POST /api/credit-cards',
        update: 'PUT /api/credit-cards/:id',
        delete: 'DELETE /api/credit-cards/:id',
        deleteAll: 'DELETE /api/credit-cards',
      },
    },
  });
});

module.exports = router;


