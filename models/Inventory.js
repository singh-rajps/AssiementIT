const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [0, 'Quantity cannot be negative'],
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: 0,
  },
  warehouse: {
    type: String,
    default: 'Main Warehouse',
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual for checking if stock is low
inventorySchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.lowStockThreshold;
});

// Update timestamp before saving
inventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if product is in stock
inventorySchema.methods.isInStock = function (requestedQuantity = 1) {
  return this.quantity >= requestedQuantity;
};

// Method to reduce stock
inventorySchema.methods.reduceStock = async function (quantity) {
  if (this.quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  this.quantity -= quantity;
  return await this.save();
};

// Method to increase stock
inventorySchema.methods.increaseStock = async function (quantity) {
  this.quantity += quantity;
  this.lastRestocked = Date.now();
  return await this.save();
};

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Inventory', inventorySchema);
