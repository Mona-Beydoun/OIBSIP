import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Home() {
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="logo-text">
            PI<span className="logo-zz">ZZ</span>ELO
          </span>
        </div>
        <div className="navbar-links">
          <a href="/">Home</a>
          <a href="#">Menu</a>
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
          <a href="#">Contact</a>
        </div>
      </nav>

      <section className="hero hero-photo">
        <div className="hero-overlay"></div>

        <div className={`hero-content hero-content-left ${loaded ? 'in' : ''}`}>
          <h1 className="stack-heading stack-heading-left">
            <span className="line-white">It's Not Just</span>
            <span className="line-orange">Pizza</span>
            <span className="line-script">It's an experience!</span>
          </h1>
          <p className="hero-p-left">WARNING: MAY CAUSE EXTREME HAPPINESS.
          </p>
          <div className="hero-actions hero-actions-left">
            <button className="btn-primary" onClick={() => navigate('/pizza-builder')}>
              Customize Your Dream Pizza
            </button>
            <button className="btn-secondary">See Menu</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;