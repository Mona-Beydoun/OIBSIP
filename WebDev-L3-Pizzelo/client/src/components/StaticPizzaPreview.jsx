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
  { top: '28%', left: '50%' }, { top: '36%', left: '66%' }, { top: '50%', left: '73%' },
  { top: '64%', left: '66%' }, { top: '72%', left: '50%' }, { top: '64%', left: '34%' },
  { top: '50%', left: '27%' },
];

function StaticPizzaPreview({ base, sauce, cheese, vegetables = [] }) {
  const sauceColor = SAUCE_COLORS[sauce] ?? '#C1442E';
  const holePercent = HOLE_SIZE[base] ?? 72;
  const fillStyle = {
    top: `${(100 - holePercent) / 2}%`,
    left: `${(100 - holePercent) / 2}%`,
    width: `${holePercent}%`,
    height: `${holePercent}%`,
  };

  return (
    <div className="pizza-preview-stack static-pizza-preview">
      <div className="pizza-layer-sauce" style={{ ...fillStyle, backgroundColor: sauceColor }} />

      <div className="pizza-layer-cheese-mask" style={fillStyle}>
        <img className="pizza-layer-cheese-img" src={`/images/cheeses/${cheese}.png`} alt={cheese} />
      </div>

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

      <img className="pizza-layer-crust" src={`/images/crusts/${base}.png`} alt={base} />
    </div>
  );
}

export default StaticPizzaPreview;