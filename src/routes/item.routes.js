const express = require('express');
const router = express.Router();
const {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  deleteAllItems,
} = require('../controllers/item.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  createItemValidation,
  updateItemValidation,
  idValidation,
  paginationValidation,
  validate,
} = require('../middleware/validation');

// Public routes (with optional authentication)
router.get('/', optionalAuth, paginationValidation, validate, getAllItems);
router.get('/:id', optionalAuth, idValidation, validate, getItem);

// Protected routes
router.post('/', protect, createItemValidation, validate, createItem);
router.put('/:id', protect, idValidation, updateItemValidation, validate, updateItem);
router.delete('/:id', protect, idValidation, validate, deleteItem);

// Admin only routes
router.delete('/', protect, authorize('admin'), deleteAllItems);

module.exports = router;


