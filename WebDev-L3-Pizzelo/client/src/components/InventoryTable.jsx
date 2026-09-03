import { useState } from 'react';
import { updateStockItem } from '../services/inventoryService';

function InventoryTable({ title, category, items, onUpdated }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditValue(item.stock);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (itemId) => {
    setSaving(true);
    try {
      const updated = await updateStockItem(category, itemId, { stock: Number(editValue) });
      onUpdated(updated);
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inventory-section">
      <h3 className="inventory-section-title">{title}</h3>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Stock</th>
            <th>Threshold</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isLow = item.stock < item.threshold;
            const isEditing = editingId === item._id;
            return (
              <tr key={item._id} className={isLow ? 'inventory-row-low' : ''}>
                <td>{item.name}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="inventory-edit-input"
                      autoFocus
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td>{item.threshold}</td>
                <td>
                  <span className={`inventory-badge ${isLow ? 'inventory-badge-low' : 'inventory-badge-ok'}`}>
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>
                  {isEditing ? (
                    <div className="inventory-actions">
                      <button onClick={() => saveEdit(item._id)} disabled={saving} className="inventory-btn-save">
                        {saving ? '...' : 'Save'}
                      </button>
                      <button onClick={cancelEdit} className="inventory-btn-cancel">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(item)} className="inventory-btn-edit">Edit</button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;