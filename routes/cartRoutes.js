const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  checkout,
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { cartValidation, validate } = require('../middleware/validator');

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);

router.post('/items', protect, cartValidation, validate, addToCart);
router.put('/items/:productId', protect, updateCartItem);
router.delete('/items/:productId', protect, removeFromCart);
router.post('/checkout', protect, checkout);

module.exports = router;
