const express = require('express');
const router = express.Router();
const { getInventory, updateStockItem, addStockItem } = require('../controllers/inventoryController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// Public: anyone can view inventory (needed later for the pizza builder to show available options)
router.get('/', getInventory);

// Admin only: modify stock
router.put('/:category/:itemId', protectAdmin, updateStockItem);
router.post('/:category', protectAdmin, addStockItem);

module.exports = router;