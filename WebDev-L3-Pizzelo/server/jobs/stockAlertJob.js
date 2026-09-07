const cron = require('node-cron');
const Inventory = require('../models/Inventory');
const sendEmail = require('../utils/sendEmail');

const CATEGORY_LABELS = {
  bases: 'Bases',
  sauces: 'Sauces',
  cheeses: 'Cheeses',
  vegetables: 'Vegetables',
};

const checkLowStock = async () => {
  try {
    const inventory = await Inventory.findOne();

    if (!inventory) {
      console.log('[stockAlertJob] No inventory document found, skipping check.');
      return;
    }

    const lowStockItems = [];

    for (const category of Object.keys(CATEGORY_LABELS)) {
      const items = inventory[category] || [];
      items.forEach((item) => {
        if (item.stock < item.threshold) {
          lowStockItems.push({
            category: CATEGORY_LABELS[category],
            name: item.name,
            stock: item.stock,
            threshold: item.threshold,
          });
        }
      });
    }

    if (lowStockItems.length === 0) {
      console.log('[stockAlertJob] No low stock items found.');
      return;
    }

    const rows = lowStockItems
      .map(
        (item) => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.category}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;color:#d1453b;font-weight:600;">${item.stock}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.threshold}</td>
          </tr>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#E8792F;">Pizzelo — Low Stock Alert</h2>
        <p>The following inventory items are below their restock threshold:</p>
        <table style="border-collapse:collapse;width:100%;">
          <thead>
            <tr>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #E8792F;">Category</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #E8792F;">Item</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #E8792F;">Current Stock</th>
              <th style="text-align:left;padding:8px 12px;border-bottom:2px solid #E8792F;">Threshold</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p style="margin-top:20px;color:#888;font-size:12px;">
          This is an automated alert from the Pizzelo inventory system.
        </p>
      </div>
    `;

    await sendEmail(
      process.env.EMAIL_USER,
      `Pizzelo: ${lowStockItems.length} item(s) low on stock`,
      html
    );

    console.log(`[stockAlertJob] Alert email sent for ${lowStockItems.length} low stock item(s).`);
  } catch (error) {
    console.error('[stockAlertJob] Error checking low stock:', error.message);
  }
};

const startStockAlertJob = () => {
  // Runs every day at 8:00 AM server time
  cron.schedule('0 8 * * *', () => {
    console.log('[stockAlertJob] Running scheduled low stock check...');
    checkLowStock();
  });

  console.log('[stockAlertJob] Cron job scheduled (daily at 8:00 AM).');
};

module.exports = { startStockAlertJob, checkLowStock };