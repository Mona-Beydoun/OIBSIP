import { usePizzaBuilder } from '../context/PizzaBuilderContext';

const SAUCE_COLORS = {
  'Classic Tomato': '#C1442E',
  'BBQ': '#5C2A1A',
  'Pesto': '#4C6B2F',
  'Alfredo': '#EDE6D6',
  'Spicy Arrabbiata': '#A8321E',
};

const HOLE_SIZE = {
  'Thin Crust': 80,
  'Deep Pan': 68,
  'Stuffed Crust': 62,
  'Whole Wheat': 72,
  'Gluten-Free': 74,
};

const VEG_SPOTS = [
  { top: '25%', left: '50%' }, { top: '38%', left: '72%' }, { top: '62%', left: '72%' },
  { top: '75%', left: '50%' }, { top: '62%', left: '28%' }, { top: '38%', left: '28%' },
  { top: '50%', left: '50%' },
];

function PizzaPreview() {
  const { base, sauce, cheese, vegetables } = usePizzaBuilder();

  const sauceColor = sauce ? (SAUCE_COLORS[sauce] ?? '#C1442E') : null;
  const holePercent = base ? (HOLE_SIZE[base] ?? 72) : 72;
  const fillStyle = {
    top: `${(100 - holePercent) / 2}%`,
    left: `${(100 - holePercent) / 2}%`,
    width: `${holePercent}%`,
    height: `${holePercent}%`,
  };

  return (
    <div className="pizza-preview">
      <div className="pizza-preview-stack">
        {!base && <div className="pizza-dough-empty" />}

        {sauceColor && (
          <div className="pizza-layer-sauce" style={{ ...fillStyle, backgroundColor: sauceColor }} />
        )}

        {cheese && (
          <div className="pizza-layer-cheese-mask" style={fillStyle}>
            <img className="pizza-layer-cheese-img" src={`/images/cheeses/${cheese}.png`} alt={cheese} />
          </div>
        )}

        {vegetables.map((veg, i) => {
          const spot = VEG_SPOTS[i % VEG_SPOTS.length];
          return (
            <img
              key={veg + i}
              className="pizza-veg-img"
              src={`/images/vegetables/${veg}.png`}
              alt={veg}
              style={{ top: spot.top, left: spot.left }}
            />
          );
        })}

        {base && (
          <img
            className="pizza-layer-crust"
            src={`/images/crusts/${base}.png`}
            alt={base}
          />
        )}
      </div>

      <div className="pizza-preview-caption">
        {!base && 'pick a crust to start'}
        {base && !sauce && 'now choose a sauce'}
        {base && sauce && !cheese && 'add some cheese'}
        {base && sauce && cheese && 'looking good — add toppings if you like'}
      </div>
    </div>
  );
}

export default PizzaPreview;