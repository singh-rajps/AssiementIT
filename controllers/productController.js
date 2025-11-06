const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const logger = require('../config/logger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email');

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Get inventory information
    const inventory = await Inventory.findOne({ product: product._id });

    res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        inventory: inventory ? {
          quantity: inventory.quantity,
          isLowStock: inventory.isLowStock,
          inStock: inventory.quantity > 0,
        } : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;

    const product = await Product.create(req.body);

    // Create inventory entry for the product
    await Inventory.create({
      product: product._id,
      quantity: req.body.initialStock || 0,
    });

    logger.info(`Product created: ${product.name} by user ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    logger.info(`Product updated: ${product.name} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Soft delete - mark as inactive
    product.isActive = false;
    await product.save();

    logger.info(`Product deleted: ${product.name} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
