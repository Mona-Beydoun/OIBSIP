const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

const CATEGORY_MAP = {
  base: 'bases',
  sauce: 'sauces',
  cheese: 'cheeses',
};

// @desc Create a new order (customer only)
const createOrder = async (req, res) => {
  try {
    const { base, sauce, cheese, vegetables, totalPrice } = req.body;

    if (!base || !sauce || !cheese || totalPrice === undefined) {
      return res.status(400).json({ message: 'Missing required pizza fields' });
    }

    const veggieList = Array.isArray(vegetables) ? vegetables : [];

    const inventory = await Inventory.findOne();
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    // Validate + collect the items we need to decrement
    const itemsToDecrement = [];

    const findAndValidate = (categoryKey, itemName) => {
      const item = inventory[categoryKey].find((i) => i.name === itemName);
      if (!item) {
        throw new Error(`"${itemName}" not found in ${categoryKey}`);
      }
      if (item.stock <= 0) {
        throw new Error(`"${itemName}" is out of stock`);
      }
      itemsToDecrement.push(item);
    };

    findAndValidate(CATEGORY_MAP.base, base);
    findAndValidate(CATEGORY_MAP.sauce, sauce);
    findAndValidate(CATEGORY_MAP.cheese, cheese);
    veggieList.forEach((veg) => findAndValidate('vegetables', veg));

    // All valid — now actually decrement
    itemsToDecrement.forEach((item) => {
      item.stock -= 1;
    });

    await inventory.save();

    const order = await Order.create({
      user: req.user._id,
      pizza: { base, sauce, cheese, vegetables: veggieList },
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
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