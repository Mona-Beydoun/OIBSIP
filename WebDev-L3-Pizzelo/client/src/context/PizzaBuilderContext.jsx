import { createContext, useContext, useState, useMemo } from 'react';
import { calculatePizzaPrice } from '../utils/pricing';

const PizzaBuilderContext = createContext();

export function PizzaBuilderProvider({ children }) {
  const [base, setBase] = useState(null);
  const [sauce, setSauce] = useState(null);
  const [cheese, setCheese] = useState(null);
  const [vegetables, setVegetables] = useState([]);

  const toggleVegetable = (vegName) => {
    setVegetables((prev) =>
      prev.includes(vegName) ? prev.filter((v) => v !== vegName) : [...prev, vegName]
    );
  };

  const resetBuilder = () => {
    setBase(null);
    setSauce(null);
    setCheese(null);
    setVegetables([]);
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