import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { VEGETABLE_PRICE } from '../utils/pricing';

function VegetableStep({ items }) {
  const { vegetables, toggleVegetable } = usePizzaBuilder();

  return (
    <div className="step-container">
      <h2 className="ingredient-heading">Add Vegetables (optional)</h2>
      <div className="ingredient-sticker-row">
        {items.map((item) => {
          const outOfStock = item.stock <= 0;
          const isSelected = vegetables.includes(item.name);
          return (
            <button
              key={item._id}
              className={
                'ingredient-sticker' +
                (isSelected ? ' selected' : '') +
                (outOfStock ? ' disabled' : '')
              }
              onClick={() => !outOfStock && toggleVegetable(item.name)}
              disabled={outOfStock}
            >
              <img
                className="ingredient-sticker-img"
                src={`/images/vegetables/${item.name}.png`}
                alt={item.name}
              />
              <span className="ingredient-sticker-name">{item.name}</span>
              <span className="ingredient-sticker-price">+${VEGETABLE_PRICE.toFixed(2)}</span>
              {isSelected && <span className="ingredient-chip-check">✓ Added</span>}
              {outOfStock && <span className="ingredient-chip-outofstock">Out of Stock</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VegetableStep;