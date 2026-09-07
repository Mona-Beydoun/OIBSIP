import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { getInventory } from '../services/inventoryService';
import PizzaPreview from '../components/PizzaPreview';
import PizzaBaseStep from '../components/PizzaBaseStep';
import SauceStep from '../components/SauceStep';
import CheeseStep from '../components/CheeseStep';
import VegetableStep from '../components/VegetableStep';

const STEPS = ['Base', 'Sauce', 'Cheese', 'Vegetables'];

function PizzaBuilder() {
  const [stepIndex, setStepIndex] = useState(0);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { base, sauce, cheese, totalPrice } = usePizzaBuilder();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        setError('Could not load ingredients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const canGoNext = () => {
    if (stepIndex === 0) return !!base;
    if (stepIndex === 1) return !!sauce;
    if (stepIndex === 2) return !!cheese;
    return true;
  };

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      navigate('/order-summary');
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  return (
    <div className="builder-page">
      <div className="builder-brand">
        <span className="logo-text builder-brand-logo">
          PI<span className="logo-zz">ZZ</span>ELO
        </span>
        <span className="builder-brand-tagline">let's build your pizza</span>
      </div>

      <div className="builder-side-copy">
        <span className="side-copy-line1">YOUR DIET CAN WAIT</span>
        <span className="side-copy-line2">YOUR PIZZA CAN'T.</span>
       
      </div>

      <div className="builder-stage">
        {loading && <p className="builder-status-text">Loading ingredients...</p>}
        {!loading && error && (
          <p className="builder-status-text builder-status-error">{error}</p>
        )}

        {!loading && !error && inventory && (
          <div className="builder-content-wrap">
            <div className="builder-progress-rail">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={
                    'rail-step' +
                    (i === stepIndex ? ' active' : '') +
                    (i < stepIndex ? ' done' : '')
                  }
                >
                  <span className="rail-dot" />
                  <span className="rail-label">{label}</span>
                </div>
              ))}
            </div>

            <PizzaPreview />

            <div className="builder-step-zone">
              {stepIndex === 0 && <PizzaBaseStep items={inventory.bases} />}
              {stepIndex === 1 && <SauceStep items={inventory.sauces} />}
              {stepIndex === 2 && <CheeseStep items={inventory.cheeses} />}
              {stepIndex === 3 && <VegetableStep items={inventory.vegetables} />}
            </div>

            <div className="builder-footer">
              <div className="builder-price-ticket">
                Total<span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="builder-nav-buttons">
                <button className="btn-secondary" onClick={handleBack} disabled={stepIndex === 0}>
                  Back
                </button>
                <button className="btn-primary" onClick={handleNext} disabled={!canGoNext()}>
                  {stepIndex === STEPS.length - 1 ? 'Review Order' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PizzaBuilder;