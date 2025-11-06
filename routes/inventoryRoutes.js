const express = require('express');
const router = express.Router();
const {
  getInventory,
  getAllInventory,
  updateInventory,
  addStock,
  reduceStock,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');
const { inventoryValidation, validate } = require('../middleware/validator');

router.get('/', protect, authorize('admin'), getAllInventory);
router.get('/:productId', protect, authorize('admin'), getInventory);
router.put('/:productId', protect, authorize('admin'), inventoryValidation, validate, updateInventory);
router.post('/:productId/add-stock', protect, authorize('admin'), addStock);
router.post('/:productId/reduce-stock', protect, authorize('admin'), reduceStock);

module.exports = router;
