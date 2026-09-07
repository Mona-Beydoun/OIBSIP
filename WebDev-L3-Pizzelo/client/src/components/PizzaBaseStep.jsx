import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { CRUST_PRICES } from '../utils/pricing';

function PizzaBaseStep({ items }) {
  const { base, setBase } = usePizzaBuilder();

  return (
    <div className="step-container">
      <h2 className="ingredient-heading">Choose Your Crust</h2>
      <div className="ingredient-sticker-row">
        {items.map((item) => {
          const outOfStock = item.stock <= 0;
          const priceAddOn = CRUST_PRICES[item.name] ?? 0;
          return (
            <button
              key={item._id}
              className={
                'ingredient-sticker' +
                (base === item.name ? ' selected' : '') +
                (outOfStock ? ' disabled' : '')
              }
              onClick={() => !outOfStock && setBase(item.name)}
              disabled={outOfStock}
            >
              <img
                className="ingredient-sticker-img"
                src={`/images/crusts/${item.name}.png`}
                alt={item.name}
              />
              <span className="ingredient-sticker-name">{item.name}</span>
              <span className="ingredient-sticker-price">
                {priceAddOn > 0 ? `+$${priceAddOn.toFixed(2)}` : 'Included'}
              </span>
              {outOfStock && <span className="ingredient-chip-outofstock">Out of Stock</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PizzaBaseStep;