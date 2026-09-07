const Order = require('../models/Order');
const createOrderWithInventory = require('../utils/createOrderWithInventory');

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

module.exports = { createOrder, getMyOrders };