const Item = require('../models/Item');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all items with pagination, filtering, and sorting
// @route   GET /api/items
// @access  Public
exports.getAllItems = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Filtering
  if (req.query.category) {
    query.category = req.query.category;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.minPrice) {
    query.price = { ...query.price, $gte: parseFloat(req.query.minPrice) };
  }

  if (req.query.maxPrice) {
    query.price = { ...query.price, $lte: parseFloat(req.query.maxPrice) };
  }

  // Search by name or description
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Sorting
  let sort = '-createdAt'; // Default: newest first
  if (req.query.sort) {
    sort = req.query.sort.split(',').join(' ');
  }

  // Execute query
  const items = await Item.find(query)
    .populate('createdBy', 'name email')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const total = await Item.countDocuments(query);

  res.status(200).json({
    success: true,
    count: items.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
    data: items,
  });
});

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate(
    'createdBy',
    'name email'
  );

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item not found with id ${req.params.id}`,
    });
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

// @desc    Create new item
// @route   POST /api/items
// @access  Private
exports.createItem = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const item = await Item.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
});

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
exports.updateItem = asyncHandler(async (req, res) => {
  let item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item not found with id ${req.params.id}`,
    });
  }

  // Check ownership or admin
  if (
    item.createdBy &&
    item.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Not authorized to update this item',
    });
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Item not found with id ${req.params.id}`,
    });
  }

  // Check ownership or admin
  if (
    item.createdBy &&
    item.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Not authorized to delete this item',
    });
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
    data: {},
  });
});

// @desc    Delete all items
// @route   DELETE /api/items
// @access  Private/Admin
exports.deleteAllItems = asyncHandler(async (req, res) => {
  const result = await Item.deleteMany({});

  res.status(200).json({
    success: true,
    message: `All items deleted successfully (${result.deletedCount} items)`,
    data: { deletedCount: result.deletedCount },
  });
});


