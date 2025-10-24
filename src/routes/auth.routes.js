const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updatePassword,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  validate,
} = require('../middleware/validation');
const { authLimiter } = require('../config/rateLimiter');

// Public routes
router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;


