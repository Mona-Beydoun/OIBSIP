const Order = require('../models/Order');
const createOrderWithInventory = require('../utils/createOrderWithInventory');

const VALID_STATUSES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

// @desc Create a new order (customer only) — unpaid/direct path
const createOrder = async (req, res) => {
  try {
    const { base, sauce, cheese, vegetables, totalPrice } = req.body;
    const order = await createOrderWithInventory({
      userId: req.user._id,
      base,
      sauce,
      cheese,
      vegetables,
      totalPrice,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc Get the logged-in customer's own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get ALL orders (admin only), most recent first
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update an order's status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };