const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  threshold: {
    type: Number,
    required: true,
    default: 20,
  },
});

const inventorySchema = new mongoose.Schema(
  {
    bases: [inventoryItemSchema],
    sauces: [inventoryItemSchema],
    cheeses: [inventoryItemSchema],
    vegetables: [inventoryItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);