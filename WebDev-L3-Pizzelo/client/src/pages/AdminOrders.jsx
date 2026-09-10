import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../services/orderService';

const STATUSES = ['Order Received', 'In Kitchen', 'Sent to Delivery'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await getAllOrdersAdmin();
      setOrders(data);
    } catch (err) {
      setError('Could not load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatusAdmin(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert('Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const badgeClass = (status) => {
    if (status === 'Order Received') return 'order-badge order-badge-received';
    if (status === 'In Kitchen') return 'order-badge order-badge-kitchen';
    return 'order-badge order-badge-delivery';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>Orders</h1>
          <p className="admin-welcome">Track and update every order's status</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-secondary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {loading && <p className="builder-status-text">Loading orders...</p>}
      {error && <p className="builder-status-text builder-status-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="builder-status-text">No orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-table-wrap">
          <table className="inventory-table orders-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Pizza</th>
                <th>Vegetables</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div className="order-customer-name">{order.user?.name || 'Unknown'}</div>
                    <div className="order-customer-email">{order.user?.email || ''}</div>
                  </td>
                  <td>
                    {order.pizza.base} / {order.pizza.sauce} / {order.pizza.cheese}
                  </td>
                  <td>
                    {order.pizza.vegetables.length > 0
                      ? order.pizza.vegetables.join(', ')
                      : '—'}
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        order.paymentStatus === 'Paid'
                          ? 'inventory-badge inventory-badge-ok'
                          : 'inventory-badge inventory-badge-low'
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="order-status-cell">
                      <span className={badgeClass(order.status)}>{order.status}</span>
                      <select
                        className="order-status-select"
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;