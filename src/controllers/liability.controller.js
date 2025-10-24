const Liability = require('../models/Liability');

/**
 * @desc    Get all liabilities with filtering, sorting, and pagination
 * @route   GET /api/liabilities
 * @access  Private
 */
exports.getAllLiabilities = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, sort = 'dueDate' } = req.query;

    // Build query
    const query = {};
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Add user filter if user is authenticated
    if (req.user) {
      query.createdBy = req.user._id;
    }

    // Execute query with pagination
    const liabilities = await Liability.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await Liability.countDocuments(query);

    res.status(200).json({
      success: true,
      count: liabilities.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: liabilities,
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
 * @desc    Get single liability by ID
 * @route   GET /api/liabilities/:id
 * @access  Private
 */
exports.getLiabilityById = async (req, res) => {
  try {
    const liability = await Liability.findById(req.params.id);

    if (!liability) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Liability not found',
      });
    }

    res.status(200).json({
      success: true,
      data: liability,
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
 * @desc    Create new liability
 * @route   POST /api/liabilities
 * @access  Private
 */
exports.createLiability = async (req, res) => {
  try {
    // Add user reference if authenticated
    if (req.user) {
      req.body.createdBy = req.user._id;
    }

    const liability = await Liability.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Liability created successfully',
      data: liability,
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
 * @desc    Update liability
 * @route   PUT /api/liabilities/:id
 * @access  Private
 */
exports.updateLiability = async (req, res) => {
  try {
    const liability = await Liability.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!liability) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Liability not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Liability updated successfully',
      data: liability,
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
 * @desc    Delete liability
 * @route   DELETE /api/liabilities/:id
 * @access  Private
 */
exports.deleteLiability = async (req, res) => {
  try {
    const liability = await Liability.findByIdAndDelete(req.params.id);

    if (!liability) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Liability not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Liability deleted successfully',
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
 * @desc    Delete all liabilities
 * @route   DELETE /api/liabilities
 * @access  Private
 */
exports.deleteAllLiabilities = async (req, res) => {
  try {
    const result = await Liability.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} liabilities deleted successfully`,
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

