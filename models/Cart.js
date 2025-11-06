const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total amount before saving
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  this.updatedAt = Date.now();
  next();
});

// Method to add item to cart
cartSchema.methods.addItem = async function (productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({ product: productId, quantity, price });
  }

  return await this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  return await this.save();
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = async function (productId, quantity) {
  const item = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    return await this.removeItem(productId);
  }

  item.quantity = quantity;
  return await this.save();
};

// Method to clear cart
cartSchema.methods.clearCart = async function () {
  this.items = [];
  this.totalAmount = 0;
  return await this.save();
};

module.exports = mongoose.model('Cart', cartSchema);
