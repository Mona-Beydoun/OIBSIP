import { createContext, useContext, useState, useMemo } from 'react';
import { calculatePizzaPrice } from '../utils/pricing';

const PizzaBuilderContext = createContext();

export function PizzaBuilderProvider({ children }) {
  const [base, setBaseRaw] = useState(null);
  const [sauce, setSauceRaw] = useState(null);
  const [cheese, setCheeseRaw] = useState(null);
  const [vegetables, setVegetablesRaw] = useState([]);
  const [photo, setPhoto] = useState(null);

  // Any manual ingredient change (from the builder steps) invalidates the
  // "real menu photo" since the pizza is no longer exactly that preset.
  const setBase = (val) => {
    setBaseRaw(val);
    setPhoto(null);
  };
  const setSauce = (val) => {
    setSauceRaw(val);
    setPhoto(null);
  };
  const setCheese = (val) => {
    setCheeseRaw(val);
    setPhoto(null);
  };
  const toggleVegetable = (vegName) => {
    setVegetablesRaw((prev) =>
      prev.includes(vegName) ? prev.filter((v) => v !== vegName) : [...prev, vegName]
    );
    setPhoto(null);
  };
  // Used by Menu.jsx to set a whole preset at once — does NOT clear photo,
  // since Menu sets the photo itself right after calling this.
  const setVegetablesList = (list) => {
    setVegetablesRaw(list);
  };

  const resetBuilder = () => {
    setBaseRaw(null);
    setSauceRaw(null);
    setCheeseRaw(null);
    setVegetablesRaw([]);
    setPhoto(null);
  };

  const totalPrice = useMemo(
    () => calculatePizzaPrice({ base, sauce, cheese, vegetables }),
    [base, sauce, cheese, vegetables]
  );

  const isComplete = !!base && !!sauce && !!cheese;

  const value = {
    base,
    setBase,
    sauce,
    setSauce,
    cheese,
    setCheese,
    vegetables,
    toggleVegetable,
    setVegetablesList,
    photo,
    setPhoto,
    totalPrice,
    isComplete,
    resetBuilder,
  };

  return (
    <PizzaBuilderContext.Provider value={value}>{children}</PizzaBuilderContext.Provider>
  );
}

export function usePizzaBuilder() {
  return useContext(PizzaBuilderContext);
}