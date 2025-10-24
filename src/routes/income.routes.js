const express = require('express');
const router = express.Router();
const {
  getAllIncome,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
  deleteAllIncome,
} = require('../controllers/income.controller');

// @route   GET /api/income
// @desc    Get all income records with pagination and filtering
// @access  Public (can be protected with auth middleware)
router.get('/', getAllIncome);

// @route   POST /api/income
// @desc    Create new income record
// @access  Public (can be protected with auth middleware)
router.post('/', createIncome);

// @route   DELETE /api/income
// @desc    Delete all income records
// @access  Public (can be protected with auth middleware)
router.delete('/', deleteAllIncome);

// @route   GET /api/income/:id
// @desc    Get single income record by ID
// @access  Public (can be protected with auth middleware)
router.get('/:id', getIncomeById);

// @route   PUT /api/income/:id
// @desc    Update income record
// @access  Public (can be protected with auth middleware)
router.put('/:id', updateIncome);

// @route   DELETE /api/income/:id
// @desc    Delete income record
// @access  Public (can be protected with auth middleware)
router.delete('/:id', deleteIncome);

module.exports = router;

