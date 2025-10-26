const express = require('express');
const router = express.Router();
const {
  getAllCreditCards,
  getCreditCardById,
  createCreditCard,
  updateCreditCard,
  deleteCreditCard,
  deleteAllCreditCards,
} = require('../controllers/creditCard.controller');

// @route   GET /api/credit-cards
// @desc    Get all credit cards with pagination and filtering
// @access  Public (can be protected with auth middleware)
router.get('/', getAllCreditCards);

// @route   POST /api/credit-cards
// @desc    Create new credit card
// @access  Public (can be protected with auth middleware)
router.post('/', createCreditCard);

// @route   DELETE /api/credit-cards
// @desc    Delete all credit cards
// @access  Public (can be protected with auth middleware)
router.delete('/', deleteAllCreditCards);

// @route   GET /api/credit-cards/:id
// @desc    Get single credit card by ID
// @access  Public (can be protected with auth middleware)
router.get('/:id', getCreditCardById);

// @route   PUT /api/credit-cards/:id
// @desc    Update credit card
// @access  Public (can be protected with auth middleware)
router.put('/:id', updateCreditCard);

// @route   DELETE /api/credit-cards/:id
// @desc    Delete credit card
// @access  Public (can be protected with auth middleware)
router.delete('/:id', deleteCreditCard);

module.exports = router;


