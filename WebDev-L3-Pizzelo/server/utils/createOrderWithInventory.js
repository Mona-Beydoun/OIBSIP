const Order = require('../models/Order');
const Inventory = require('../models/Inventory');

const CATEGORY_MAP = {
  base: 'bases',
  sauce: 'sauces',
  cheese: 'cheeses',
};

// Validates ingredients, decrements stock, and creates the Order document.
// paymentInfo is optional: { razorpayOrderId, razorpayPaymentId } for paid orders.
const createOrderWithInventory = async ({ userId, base, sauce, cheese, vegetables, totalPrice, paymentInfo }) => {
  if (!base || !sauce || !cheese || totalPrice === undefined) {
    const err = new Error('Missing required pizza fields');
    err.statusCode = 400;
    throw err;
  }

  const veggieList = Array.isArray(vegetables) ? vegetables : [];

  const inventory = await Inventory.findOne();
  if (!inventory) {
    const err = new Error('Inventory not found');
    err.statusCode = 404;
    throw err;
  }

  const itemsToDecrement = [];

  const findAndValidate = (categoryKey, itemName) => {
    const item = inventory[categoryKey].find((i) => i.name === itemName);
    if (!item) {
      const err = new Error(`"${itemName}" not found in ${categoryKey}`);
      err.statusCode = 400;
      throw err;
    }
    if (item.stock <= 0) {
      const err = new Error(`"${itemName}" is out of stock`);
      err.statusCode = 400;
      throw err;
    }
    itemsToDecrement.push(item);
  };

  findAndValidate(CATEGORY_MAP.base, base);
  findAndValidate(CATEGORY_MAP.sauce, sauce);
  findAndValidate(CATEGORY_MAP.cheese, cheese);
  veggieList.forEach((veg) => findAndValidate('vegetables', veg));

  itemsToDecrement.forEach((item) => {
    item.stock -= 1;
  });

  await inventory.save();

  const order = await Order.create({
    user: userId,
    pizza: { base, sauce, cheese, vegetables: veggieList },
    totalPrice,
    paymentStatus: paymentInfo ? 'Paid' : 'Pending',
    razorpayOrderId: paymentInfo?.razorpayOrderId,
    razorpayPaymentId: paymentInfo?.razorpayPaymentId,
  });

  return order;
};

module.exports = createOrderWithInventory;