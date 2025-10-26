const express = require('express');
const router = express.Router();
const {
  getAllAssets,
  getAssetsById,
  createAssets,
  updateAssets,
  deleteAssets,
  deleteAllAssets,
} = require('../controllers/assets.controller');

// @route   GET /api/assets
// @desc    Get all assets with pagination and filtering
// @access  Public (can be protected with auth middleware)
router.get('/', getAllAssets);

// @route   POST /api/assets
// @desc    Create new asset
// @access  Public (can be protected with auth middleware)
router.post('/', createAssets);

// @route   DELETE /api/assets
// @desc    Delete all assets
// @access  Public (can be protected with auth middleware)
router.delete('/', deleteAllAssets);

// @route   GET /api/assets/:id
// @desc    Get single asset by ID
// @access  Public (can be protected with auth middleware)
router.get('/:id', getAssetsById);

// @route   PUT /api/assets/:id
// @desc    Update asset
// @access  Public (can be protected with auth middleware)
router.put('/:id', updateAssets);

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Public (can be protected with auth middleware)
router.delete('/:id', deleteAssets);

module.exports = router;


