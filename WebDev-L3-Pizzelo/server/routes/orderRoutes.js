const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

router.get('/admin/all', protectAdmin, getAllOrders);
router.put('/admin/:id/status', protectAdmin, updateOrderStatus);

module.exports = router;