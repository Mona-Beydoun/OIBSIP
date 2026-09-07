import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { CHEESE_PRICES } from '../utils/pricing';

function CheeseStep({ items }) {
  const { cheese, setCheese } = usePizzaBuilder();

  return (
    <div className="step-container">
      <h2 className="ingredient-heading">Choose Your Cheese</h2>
      <div className="ingredient-sticker-row">
        {items.map((item) => {
          const outOfStock = item.stock <= 0;
          const priceAddOn = CHEESE_PRICES[item.name] ?? 0;
          return (
            <button
              key={item._id}
              className={
                'ingredient-sticker' +
                (cheese === item.name ? ' selected' : '') +
                (outOfStock ? ' disabled' : '')
              }
              onClick={() => !outOfStock && setCheese(item.name)}
              disabled={outOfStock}
            >
              <img
                className="ingredient-sticker-img"
                src={`/images/cheeses/${item.name}.png`}
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

export default CheeseStep;