import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const ReceivedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="6" y="4" width="12" height="16" rx="1.5" />
    <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" />
    <path d="M9 10h6M9 14h6M9 18h3" />
  </svg>
);

const KitchenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3c-2 2.5-3 4.5-3 6.5a3 3 0 0 0 6 0c0-1-0.4-1.8-1-2.5.3 1-0.2 2-1 2-1 0-1.3-1-1-2 .3-1 .3-2.5 0-4z" />
    <path d="M6 14a6 6 0 0 0 12 0" />
    <path d="M6 14c0 3 2.5 6 6 6s6-3 6-6" />
  </svg>
);

const DeliveryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="7" width="11" height="9" rx="1" />
    <path d="M13 10h4l3 3v3h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </svg>
);

const STATUS_STEPS = [
  { label: 'Order Received', Icon: ReceivedIcon },
  { label: 'In Kitchen', Icon: KitchenIcon },
  { label: 'Sent to Delivery', Icon: DeliveryIcon },
];
const POLL_INTERVAL_MS = 8000;

function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      // silent fail on background polls; only matters for first load
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h1>My Orders</h1>
          <p className="admin-welcome">Welcome back, {user?.name || 'there'}</p>
        </div>
        <div className="admin-header-actions">
          <button className="btn-primary" onClick={() => navigate('/pizza-builder')}>
            Order Another Pizza
          </button>
        </div>
      </div>

      {loading && <p className="builder-status-text">Loading your orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="builder-status-text">
          You haven't placed any orders yet — go build your first pizza!
        </p>
      )}

      {!loading && orders.length > 0 && (
        <div className="my-orders-list">
          {orders.map((order) => {
            const currentStepIndex = STATUS_STEPS.findIndex((s) => s.label === order.status);
            return (
              <div key={order._id} className="my-order-card">
                <div className="my-order-header">
                  <div>
                    <div className="my-order-title">
                      {order.pizza.base} — {order.pizza.sauce}, {order.pizza.cheese}
                    </div>
                    <div className="my-order-meta">
                      {new Date(order.createdAt).toLocaleString()} · $
                      {order.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <span
                    className={
                      order.paymentStatus === 'Paid'
                        ? 'inventory-badge inventory-badge-ok'
                        : 'inventory-badge inventory-badge-low'
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                                <div className="order-tracker">
                  <div
                    className="order-tracker-fill"
                    style={{
                      width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                  {STATUS_STEPS.map((step, i) => {
                    const { Icon } = step;
                    const isDone = i < currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    return (
                      <div
                        key={step.label}
                        className={
                          'order-tracker-step' +
                          (isDone ? ' done' : '') +
                          (isCurrent ? ' current' : '')
                        }
                      >
                        <span className="order-tracker-dot">
                          {isDone ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                              <path d="M5 12l4.5 4.5L19 7" />
                            </svg>
                          ) : (
                            <Icon />
                          )}
                        </span>
                        <span className="order-tracker-label">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;