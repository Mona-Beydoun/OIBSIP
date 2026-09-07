const Inventory = require('../models/Inventory');

// @desc Get the current inventory (creates one if it doesn't exist yet)
const getInventory = async (req, res) => {
  try {
    let inventory = await Inventory.findOne();

    if (!inventory) {
      inventory = await Inventory.create({
        bases: [],
        sauces: [],
        cheeses: [],
        vegetables: [],
      });
    }

    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a single item's stock (admin only)
// category = 'bases' | 'sauces' | 'cheeses' | 'vegetables'
const updateStockItem = async (req, res) => {
  try {
    const { category, itemId } = req.params;
    const { stock, threshold } = req.body;

    const validCategories = ['bases', 'sauces', 'cheeses', 'vegetables'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const inventory = await Inventory.findOne();
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const item = inventory[category].id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (stock !== undefined) item.stock = stock;
    if (threshold !== undefined) item.threshold = threshold;

    await inventory.save();
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new item to a category (admin only)
const addStockItem = async (req, res) => {
  try {
    const { category } = req.params;
    const { name, stock, threshold } = req.body;

    const validCategories = ['bases', 'sauces', 'cheeses', 'vegetables'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    let inventory = await Inventory.findOne();
    if (!inventory) {
      inventory = await Inventory.create({ bases: [], sauces: [], cheeses: [], vegetables: [] });
    }

    inventory[category].push({ name, stock: stock || 0, threshold: threshold || 20 });
    await inventory.save();

    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInventory, updateStockItem, addStockItem };