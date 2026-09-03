import { useEffect, useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { getInventory } from '../services/inventoryService';
import InventoryTable from '../components/InventoryTable';
import '../App.css';

function AdminDashboard() {
  const { logoutAdmin } = useAdminAuth();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        console.error('Failed to load inventory', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <p style={{ color: 'white', padding: 40 }}>
          Loading inventory...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          {/* Pizzelo Branding */}
        <span className="logo-text">
            PI<span className="logo-zz">ZZ</span>ELO
          </span>

          {/* Admin Welcome Message */}
          <p className="admin-welcome">
            Welcome to Admin Dashboard
          </p>
        </div>

        <button onClick={logoutAdmin} className="btn-secondary">
          Log Out
        </button>
      </div>

      {inventory && (
        <div className="inventory-grid">
          <div className="inventory-card">
            <InventoryTable
              title="Pizza Bases"
              category="bases"
              items={inventory.bases}
              onUpdated={setInventory}
            />
          </div>

          <div className="inventory-card">
            <InventoryTable
              title="Sauces"
              category="sauces"
              items={inventory.sauces}
              onUpdated={setInventory}
            />
          </div>

          <div className="inventory-card">
            <InventoryTable
              title="Cheeses"
              category="cheeses"
              items={inventory.cheeses}
              onUpdated={setInventory}
            />
          </div>

          <div className="inventory-card">
            <InventoryTable
              title="Vegetables"
              category="vegetables"
              items={inventory.vegetables}
              onUpdated={setInventory}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;