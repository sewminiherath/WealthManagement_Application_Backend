const Assets = require('../models/Assets');

/**
 * @desc    Get all assets with filtering, sorting, and pagination
 * @route   GET /api/assets
 * @access  Private
 */
exports.getAllAssets = async (req, res) => {
  try {
    const { page = 1, limit = 10, assetsType, sort = '-currentValue' } = req.query;

    // Build query
    const query = {};
    
    // Filter by assets type if provided
    if (assetsType) {
      query.assetsType = assetsType;
    }

    // Add user filter if user is authenticated
    if (req.user) {
      query.createdBy = req.user._id;
    }

    // Execute query with pagination
    const assets = await Assets.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await Assets.countDocuments(query);

    res.status(200).json({
      success: true,
      count: assets.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * @desc    Get single asset by ID
 * @route   GET /api/assets/:id
 * @access  Private
 */
exports.getAssetsById = async (req, res) => {
  try {
    const asset = await Assets.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * @desc    Create new asset
 * @route   POST /api/assets
 * @access  Private
 */
exports.createAssets = async (req, res) => {
  try {
    // Add user reference if authenticated
    if (req.user) {
      req.body.createdBy = req.user._id;
    }

    const asset = await Assets.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset,
    });
  } catch (error) {
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * @desc    Update asset
 * @route   PUT /api/assets/:id
 * @access  Private
 */
exports.updateAssets = async (req, res) => {
  try {
    const asset = await Assets.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset,
    });
  } catch (error) {
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * @desc    Delete asset
 * @route   DELETE /api/assets/:id
 * @access  Private
 */
exports.deleteAssets = async (req, res) => {
  try {
    const asset = await Assets.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

/**
 * @desc    Delete all assets
 * @route   DELETE /api/assets
 * @access  Private
 */
exports.deleteAllAssets = async (req, res) => {
  try {
    const result = await Assets.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} assets deleted successfully`,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message,
    });
  }
};

