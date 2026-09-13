import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePizzaBuilder } from '../context/PizzaBuilderContext';
import { calculatePizzaPrice } from '../utils/pricing';
import '../App.css';

const MENU_ITEMS = [
  {
    photo: '/images/pizza-1.jpg',
    name: 'Ocean Breeze',
    description: 'Alfredo, mozzarella & tomato.',
    base: 'Thin Crust',
    sauce: 'Alfredo',
    cheese: 'Mozzarella',
    vegetables: ['Tomatoes'],
  },
  {
    photo: '/images/pizza-2.jpg',
    name: 'Smoky BBQ',
    description: 'BBQ, cheddar & onions.',
    base: 'Deep Pan',
    sauce: 'BBQ',
    cheese: 'Cheddar',
    vegetables: ['Onions'],
  },
  {
    photo: '/images/pizza-3.jpg',
    name: 'Forest Mushroom',
    description: 'Alfredo, parmesan & mushrooms.',
    base: 'Whole Wheat',
    sauce: 'Alfredo',
    cheese: 'Parmesan',
    vegetables: ['Mushrooms'],
  },
  {
    photo: '/images/pizza-4.jpg',
    name: 'Prosciutto Arugula',
    description: 'Tomato sauce, parmesan & tomatoes.',
    base: 'Stuffed Crust',
    sauce: 'Classic Tomato',
    cheese: 'Parmesan',
    vegetables: ['Tomatoes'],
  },
  {
    photo: '/images/pizza-5.jpg',
    name: 'Veggie Rainbow',
    description: 'Peppers, onions & black olives.',
    base: 'Gluten-Free',
    sauce: 'Classic Tomato',
    cheese: 'Mozzarella',
    vegetables: ['Bell Peppers', 'Onions', 'Black Olives'],
  },
  {
    photo: '/images/pizza-6.jpg',
    name: 'Classic Margherita',
    description: 'Tomato sauce, mozzarella & basil.',
    base: 'Thin Crust',
    sauce: 'Classic Tomato',
    cheese: 'Mozzarella',
    vegetables: ['Tomatoes'],
  },
  {
    photo: '/images/pizza-7.jpg',
    name: 'Hawaiian',
    description: 'Sweet & savory with corn.',
    base: 'Deep Pan',
    sauce: 'Classic Tomato',
    cheese: 'Mozzarella',
    vegetables: ['Corn'],
  },
  {
    photo: '/images/pizza-8.jpg',
    name: 'Pepperoni Classic',
    description: 'Tomato sauce & mozzarella.',
    base: 'Deep Pan',
    sauce: 'Classic Tomato',
    cheese: 'Mozzarella',
    vegetables: [],
  },
  {
    photo: '/images/pizza-9.jpg',
    name: 'Four Cheese',
    description: 'Alfredo & a blend of cheeses.',
    base: 'Deep Pan',
    sauce: 'Alfredo',
    cheese: 'Cheddar',
    vegetables: [],
  },
  {
    photo: '/images/pizza-10.jpg',
    name: 'Spicy Pepperoni',
    description: 'Tomato sauce & jalapeños.',
    base: 'Deep Pan',
    sauce: 'Spicy Arrabbiata',
    cheese: 'Mozzarella',
    vegetables: ['Jalapeños'],
  },
];
function Menu() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
    const { setBase, setSauce, setCheese, setVegetablesList, setPhoto, resetBuilder } = usePizzaBuilder();

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleOrderNow = (pizza) => {
    resetBuilder();
    setBase(pizza.base);
    setSauce(pizza.sauce);
    setCheese(pizza.cheese);
    setVegetablesList(pizza.vegetables);
    setPhoto(pizza.photo);
    navigate('/order-summary');
  };

  return (
    <div className="menu-page menu-page-fit">
      <nav className="navbar menu-navbar">
        <div className="navbar-logo">
          <span className="logo-text">
            PI<span className="logo-zz">ZZ</span>ELO
          </span>
        </div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="/menu">Menu</a>
          {isAuthenticated ? (
            <>
              <a href="/my-orders">My Orders</a>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                Log Out
              </a>
            </>
          ) : (
            <a href="/login">Login</a>
          )}
          <a href="/contact">Contact</a>
        </div>
      </nav>
 <div className="menu-side-copy">
        <span className="side-copy-line1">Which slice</span>
        <span className="side-copy-line2">is calling your name?</span>
       
      </div>
      <div className="menu-content">
       

        <div className="menu-grid">
          {MENU_ITEMS.map((pizza) => {
            const price = calculatePizzaPrice(pizza);
            return (
              <div key={pizza.name} className="menu-item">
                <img className="menu-item-photo" src={pizza.photo} alt={pizza.name} />
                <h3 className="menu-item-name">{pizza.name}</h3>
                <p className="menu-item-desc">{pizza.description}</p>
                <div className="menu-item-footer">
                  <span className="menu-item-price">${price.toFixed(2)}</span>
                  <button className="btn-primary" onClick={() => handleOrderNow(pizza)}>
                    Order Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Menu;