const CreditCard = require('../models/CreditCard');

/**
 * @desc    Get all credit cards with filtering, sorting, and pagination
 * @route   GET /api/credit-cards
 * @access  Private
 */
exports.getAllCreditCards = async (req, res) => {
  try {
    const { page = 1, limit = 10, bankName, sort = 'dueDate' } = req.query;

    // Build query
    const query = {};
    
    // Filter by bank name if provided
    if (bankName) {
      query.bankName = new RegExp(bankName, 'i'); // Case-insensitive search
    }

    // Add user filter if user is authenticated
    if (req.user) {
      query.createdBy = req.user._id;
    }

    // Execute query with pagination
    const creditCards = await CreditCard.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count for pagination
    const count = await CreditCard.countDocuments(query);

    res.status(200).json({
      success: true,
      count: creditCards.length,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: creditCards,
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
 * @desc    Get single credit card by ID
 * @route   GET /api/credit-cards/:id
 * @access  Private
 */
exports.getCreditCardById = async (req, res) => {
  try {
    const creditCard = await CreditCard.findById(req.params.id);

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      data: creditCard,
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
 * @desc    Create new credit card
 * @route   POST /api/credit-cards
 * @access  Private
 */
exports.createCreditCard = async (req, res) => {
  try {
    // Add user reference if authenticated
    if (req.user) {
      req.body.createdBy = req.user._id;
    }

    const creditCard = await CreditCard.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Credit card created successfully',
      data: creditCard,
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
 * @desc    Update credit card
 * @route   PUT /api/credit-cards/:id
 * @access  Private
 */
exports.updateCreditCard = async (req, res) => {
  try {
    const creditCard = await CreditCard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credit card updated successfully',
      data: creditCard,
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
 * @desc    Delete credit card
 * @route   DELETE /api/credit-cards/:id
 * @access  Private
 */
exports.deleteCreditCard = async (req, res) => {
  try {
    const creditCard = await CreditCard.findByIdAndDelete(req.params.id);

    if (!creditCard) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credit card deleted successfully',
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
 * @desc    Delete all credit cards
 * @route   DELETE /api/credit-cards
 * @access  Private
 */
exports.deleteAllCreditCards = async (req, res) => {
  try {
    const result = await CreditCard.deleteMany({});

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} credit cards deleted successfully`,
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


