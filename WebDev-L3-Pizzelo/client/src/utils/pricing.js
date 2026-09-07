// Starting price for any pizza (covers a default base + sauce + cheese)
export const BASE_PRICE = 6.99;

// Up-charge per crust type (on top of BASE_PRICE). Add missing items as needed.
export const CRUST_PRICES = {
  'Thin Crust': 0,
  'Deep Pan': 1.0,
  'Stuffed Crust': 2.0,
  'Whole Wheat': 0.5,
  'Gluten-Free': 1.5,
};

// Up-charge per sauce type. Add missing items as needed.
export const SAUCE_PRICES = {
  'Classic Tomato': 0,
  'BBQ': 0.5,
  'Pesto': 1.0,
  'Alfredo': 1.0,
  'Spicy Arrabbiata': 0.5,
};

// Up-charge per cheese type. Add your full cheese list here — unlisted items default to $0.
export const CHEESE_PRICES = {
  'Mozzarella': 0,
};

// Flat price added per vegetable topping selected
export const VEGETABLE_PRICE = 0.75;

// Safe lookup helper — returns 0 if the item name isn't in the price map
const priceLookup = (map, itemName) => map[itemName] ?? 0;

export const calculatePizzaPrice = ({ base, sauce, cheese, vegetables = [] }) => {
  let total = BASE_PRICE;

  if (base) total += priceLookup(CRUST_PRICES, base);
  if (sauce) total += priceLookup(SAUCE_PRICES, sauce);
  if (cheese) total += priceLookup(CHEESE_PRICES, cheese);
  total += vegetables.length * VEGETABLE_PRICE;

  return Math.round(total * 100) / 100; // round to 2 decimals
};