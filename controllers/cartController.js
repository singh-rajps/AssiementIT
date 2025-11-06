const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const logger = require('../config/logger');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product', 'name price images category');

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check inventory
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory || !inventory.isInStock(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available',
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Add item to cart
    await cart.addItem(productId, quantity, product.price);

    // Populate product details
    cart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category');

    logger.info(`Item added to cart: ${product.name} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Check inventory
    const inventory = await Inventory.findOne({ product: productId });
    if (!inventory || !inventory.isInStock(quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available',
      });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.updateItemQuantity(productId, quantity);

    cart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category');

    logger.info(`Cart item updated: ${productId} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.removeItem(productId);

    cart = await Cart.findById(cart._id)
      .populate('items.product', 'name price images category');

    logger.info(`Item removed from cart: ${productId} by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    await cart.clearCart();

    logger.info(`Cart cleared by user ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Checkout (process cart)
// @route   POST /api/cart/checkout
// @access  Private
exports.checkout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Verify stock availability for all items
    for (const item of cart.items) {
      const inventory = await Inventory.findOne({ product: item.product._id });
      if (!inventory || !inventory.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`,
        });
      }
    }

    // Reduce inventory for all items
    for (const item of cart.items) {
      const inventory = await Inventory.findOne({ product: item.product._id });
      await inventory.reduceStock(item.quantity);
    }

    const orderSummary = {
      items: cart.items,
      totalAmount: cart.totalAmount,
      orderDate: new Date(),
    };

    // Clear the cart
    await cart.clearCart();

    logger.info(`Checkout completed by user ${req.user.email}, Total: ${orderSummary.totalAmount}`);

    res.status(200).json({
      success: true,
      message: 'Checkout successful',
      data: orderSummary,
    });
  } catch (error) {
    next(error);
  }
};
