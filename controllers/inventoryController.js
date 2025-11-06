const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const logger = require('../config/logger');

// @desc    Get inventory for a product
// @route   GET /api/inventory/:productId
// @access  Private/Admin
exports.getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne({ product: req.params.productId })
      .populate('product', 'name price category');

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product',
      });
    }

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin
exports.getAllInventory = async (req, res, next) => {
  try {
    const { lowStock, page = 1, limit = 10 } = req.query;

    let query = {};

    const inventoryItems = await Inventory.find(query)
      .populate('product', 'name price category')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ updatedAt: -1 });

    // Filter low stock items if requested
    let filteredItems = inventoryItems;
    if (lowStock === 'true') {
      filteredItems = inventoryItems.filter(item => item.isLowStock);
    }

    res.status(200).json({
      success: true,
      count: filteredItems.length,
      data: filteredItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory quantity
// @route   PUT /api/inventory/:productId
// @access  Private/Admin
exports.updateInventory = async (req, res, next) => {
  try {
    const { quantity, lowStockThreshold, warehouse } = req.body;

    let inventory = await Inventory.findOne({ product: req.params.productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product',
      });
    }

    if (quantity !== undefined) inventory.quantity = quantity;
    if (lowStockThreshold !== undefined) inventory.lowStockThreshold = lowStockThreshold;
    if (warehouse) inventory.warehouse = warehouse;

    await inventory.save();

    logger.info(`Inventory updated for product ${req.params.productId} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add stock to inventory
// @route   POST /api/inventory/:productId/add-stock
// @access  Private/Admin
exports.addStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    let inventory = await Inventory.findOne({ product: req.params.productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product',
      });
    }

    await inventory.increaseStock(quantity);

    logger.info(`Stock added: ${quantity} units for product ${req.params.productId}`);

    res.status(200).json({
      success: true,
      message: `Successfully added ${quantity} units to inventory`,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reduce stock from inventory
// @route   POST /api/inventory/:productId/reduce-stock
// @access  Private/Admin
exports.reduceStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid quantity',
      });
    }

    let inventory = await Inventory.findOne({ product: req.params.productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory not found for this product',
      });
    }

    await inventory.reduceStock(quantity);

    logger.info(`Stock reduced: ${quantity} units for product ${req.params.productId}`);

    res.status(200).json({
      success: true,
      message: `Successfully reduced ${quantity} units from inventory`,
      data: inventory,
    });
  } catch (error) {
    if (error.message === 'Insufficient stock') {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available',
      });
    }
    next(error);
  }
};
