import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { useAuth } from '../context/AuthContext';
import { createRazorpayOrder, verifyPayment } from '../services/paymentService';
import PizzaPreview from '../components/PizzaPreview';

function OrderSummary() {
    const { base, sauce, cheese, vegetables, photo, totalPrice, resetBuilder, isComplete } = usePizzaBuilder();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [placedOrder, setPlacedOrder] = useState(null);
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    setError('');
    setSubmitting(true);

    try {
      const { orderId, amount, currency, keyId } = await createRazorpayOrder(totalPrice);

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'Pizzelo',
        description: 'Pizza order payment',
        order_id: orderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#E8792F',
        },
        handler: async (response) => {
          try {
            const order = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              base,
              sauce,
              cheese,
              vegetables,
              totalPrice,
            });
            setPlacedOrder(order);
            resetBuilder();
          } catch (err) {
            setError(
              err.response?.data?.message || 'Payment succeeded but order creation failed. Please contact support.'
            );
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start payment. Please try again.');
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
            <h2 className="ingredient-heading">Payment Successful!</h2>
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
       
      </div>

      <div className="builder-side-copy">
        <span className="side-copy-line1">Last Look</span>
        <span className="side-copy-line2">Before The Oven.</span>
        
      </div>

      <div className="builder-stage summary-stage">
        <div className="summary-panel">
          <h2 className="ingredient-heading">Review Your Order</h2>

                   <div className="summary-pizza-small">
            {photo ? (
              <img className="summary-pizza-photo" src={photo} alt="Your pizza" />
            ) : (
              <PizzaPreview />
            )}
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
                onClick={() => navigate(photo ? '/menu' : '/pizza-builder')}
                disabled={submitting}
              >
                Edit
              </button>
              <button className="btn-primary" onClick={handlePlaceOrder} disabled={submitting}>
                {submitting ? 'Processing...' : 'Pay & Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;