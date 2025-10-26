const express = require('express');
const router = express.Router();
const {
  getAllLiabilities,
  getLiabilityById,
  createLiability,
  updateLiability,
  deleteLiability,
  deleteAllLiabilities,
} = require('../controllers/liability.controller');

// @route   GET /api/liabilities
// @desc    Get all liabilities with pagination and filtering
// @access  Public (can be protected with auth middleware)
router.get('/', getAllLiabilities);

// @route   POST /api/liabilities
// @desc    Create new liability
// @access  Public (can be protected with auth middleware)
router.post('/', createLiability);

// @route   DELETE /api/liabilities
// @desc    Delete all liabilities
// @access  Public (can be protected with auth middleware)
router.delete('/', deleteAllLiabilities);

// @route   GET /api/liabilities/:id
// @desc    Get single liability by ID
// @access  Public (can be protected with auth middleware)
router.get('/:id', getLiabilityById);

// @route   PUT /api/liabilities/:id
// @desc    Update liability
// @access  Public (can be protected with auth middleware)
router.put('/:id', updateLiability);

// @route   DELETE /api/liabilities/:id
// @desc    Delete liability
// @access  Public (can be protected with auth middleware)
router.delete('/:id', deleteLiability);

module.exports = router;


