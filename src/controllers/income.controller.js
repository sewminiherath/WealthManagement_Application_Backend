const Income = require('../models/Income');

/**
 * @desc    Get all income records with filtering, sorting, and pagination
 * @route   GET /api/income
 * @access  Private
 */
exports.getAllIncome = async (req, res) => {
  try {
    const { page = 1, limit = 10, frequency, sort = '-dateReceived' } = req.query;

    // Build query
    const query = {};
    
    // Filter by frequency if provided
    if (frequency) {
      query.frequency = frequency;
    }

    // Add user filter if user is authenticated (optional based on your auth setup)
    if (req.user) {
      query.createdBy = req.user._id;
    }

    // Execute query with pagination
    const income = await Income.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await Income.countDocuments(query);

    res.status(200).json({
      success: true,
      count: income.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: income,
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
 * @desc    Get single income record by ID
 * @route   GET /api/income/:id
 * @access  Private
 */
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: income,
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
 * @desc    Create new income record
 * @route   POST /api/income
 * @access  Private
 */
exports.createIncome = async (req, res) => {
  try {
    // Add user reference if authenticated
    if (req.user) {
      req.body.createdBy = req.user._id;
    }

    const income = await Income.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Income record created successfully',
      data: income,
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
 * @desc    Update income record
 * @route   PUT /api/income/:id
 * @access  Private
 */
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income record updated successfully',
      data: income,
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
 * @desc    Delete income record
 * @route   DELETE /api/income/:id
 * @access  Private
 */
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);

    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income record deleted successfully',
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
 * @desc    Delete all income records
 * @route   DELETE /api/income
 * @access  Private
 */
exports.deleteAllIncome = async (req, res) => {
  try {
    const result = await Income.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} income records deleted successfully`,
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


