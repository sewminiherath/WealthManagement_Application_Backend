const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const { idValidation, validate } = require('../middleware/validation');

// User profile route
router.put('/profile', protect, updateProfile);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), idValidation, validate, getUser);
router.put('/:id', protect, authorize('admin'), idValidation, validate, updateUser);
router.delete('/:id', protect, authorize('admin'), idValidation, validate, deleteUser);

module.exports = router;


