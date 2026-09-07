import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { createOrder } from '../services/orderService';
import PizzaPreview from '../components/PizzaPreview';

function OrderSummary() {
  const { base, sauce, cheese, vegetables, totalPrice, resetBuilder, isComplete } = usePizzaBuilder();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setError('');
    setSubmitting(true);
    try {
      const order = await createOrder({ base, sauce, cheese, vegetables, totalPrice });
      setPlacedOrder(order);
      resetBuilder();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong placing your order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isComplete && !placedOrder) {
    return (
      <div className="builder-page">
        <div className="builder-brand">
          <span className="logo-text builder-brand-logo">
            PI<span className="logo-zz">ZZ</span>ELO
          </span>
          <span className="builder-brand-tagline">let's build your pizza</span>
        </div>
        <div className="builder-side-copy">
          <span className="side-copy-line1">Hold Up.</span>
          <span className="side-copy-line2">Where's The Pizza?</span>
          <span className="side-copy-script">(go build one first)</span>
        </div>
        <div className="builder-stage summary-stage">
          <div className="summary-panel summary-empty">
            <p className="builder-status-text">
              Looks like you haven't finished building a pizza yet.
            </p>
            <button className="btn-primary" onClick={() => navigate('/pizza-builder')}>
              Back to Builder
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="builder-page">
        <div className="builder-brand">
          <span className="logo-text builder-brand-logo">
            PI<span className="logo-zz">ZZ</span>ELO
          </span>
          <span className="builder-brand-tagline">let's build your pizza</span>
        </div>
        <div className="builder-side-copy">
          <span className="side-copy-line1">You Did It.</span>
          <span className="side-copy-line2">Pizza Incoming.</span>
          <span className="side-copy-script">(the good part starts now)</span>
        </div>
        <div className="builder-stage summary-stage">
          <div className="summary-panel summary-success">
            <span className="summary-success-icon">✓</span>
            <h2 className="ingredient-heading">Order Placed!</h2>
            <p className="summary-success-text">
              Your pizza is on its way to the kitchen. Status: <strong>{placedOrder.status}</strong>
            </p>
            <div className="builder-nav-buttons">
              <button className="btn-secondary" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="btn-primary" onClick={() => navigate('/pizza-builder')}>
                Order Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="builder-page">
      <div className="builder-brand">
        <span className="logo-text builder-brand-logo">
          PI<span className="logo-zz">ZZ</span>ELO
        </span>
        <span className="builder-brand-tagline">let's build your pizza</span>
      </div>

      <div className="builder-side-copy">
        <span className="side-copy-line1">Last Look</span>
        <span className="side-copy-line2">Before The Oven.</span>
        
      </div>

      <div className="builder-stage summary-stage">
        <div className="summary-panel">
          <h2 className="ingredient-heading">Review Your Order</h2>

          <div className="summary-pizza-small">
            <PizzaPreview />
          </div>

          <div className="summary-list">
            <div className="summary-row">
              <span>Crust</span>
              <span>{base}</span>
            </div>
            <div className="summary-row">
              <span>Sauce</span>
              <span>{sauce}</span>
            </div>
            <div className="summary-row">
              <span>Cheese</span>
              <span>{cheese}</span>
            </div>
            <div className="summary-row">
              <span>Vegetables</span>
              <span>{vegetables.length > 0 ? vegetables.join(', ') : 'None'}</span>
            </div>
          </div>

          {error && <p className="summary-error">{error}</p>}

          <div className="builder-footer">
            <div className="builder-price-ticket">
              Total<span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="builder-nav-buttons">
              <button
                className="btn-secondary"
                onClick={() => navigate('/pizza-builder')}
                disabled={submitting}
              >
                Edit
              </button>
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;