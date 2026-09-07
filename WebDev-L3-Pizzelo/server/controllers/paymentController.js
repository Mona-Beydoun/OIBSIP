const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const createOrderWithInventory = require('../utils/createOrderWithInventory');

// @desc Create a Razorpay order (payment intent) for the given total price
const createRazorpayOrder = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Razorpay expects the amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totalPrice * 100);

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `pizzelo_${Date.now()}`,
    });

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify a completed Razorpay payment, then create the order + decrement stock
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      base,
      sauce,
      cheese,
      vegetables,
      totalPrice,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await createOrderWithInventory({
      userId: req.user._id,
      base,
      sauce,
      cheese,
      vegetables,
      totalPrice,
      paymentInfo: {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };