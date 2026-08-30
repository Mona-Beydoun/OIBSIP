import { useEffect, useState } from 'react';
import '../App.css';

function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
          <a href="/login">Login</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg-glow"></div>

        <div className="hero-visual">
          <img src="/images/hero-pizza.jpg" alt="pizza" className={`float-pizza p1 slice-hover ${loaded ? 'in' : ''}`} />
          <img src="/images/pizza-1.jpg" alt="pizza" className={`float-pizza p2 slice-hover ${loaded ? 'in' : ''}`} />
          <img src="/images/pizza-2.jpg" alt="pizza" className={`float-pizza p3 slice-hover ${loaded ? 'in' : ''}`} />
          <img src="/images/pizza-3.jpg" alt="pizza" className={`float-pizza p4 slice-hover ${loaded ? 'in' : ''}`} />
          <img src="/images/pizza-4.jpg" alt="pizza" className={`float-pizza p5 slice-hover ${loaded ? 'in' : ''}`} />
          <img src="/images/pizza-5.jpg" alt="pizza" className={`float-pizza p6 slice-hover ${loaded ? 'in' : ''}`} />
        </div>

        <div className={`hero-content ${loaded ? 'in' : ''}`}>
          <h1 className="stack-heading">
            <span className="line-white">It's Not Just</span>
            <span className="line-orange">Pizza</span>
            <span className="line-script">It's an experience!</span>
          </h1>
          <p>
            WARNING: MAY CAUSE EXTREME HAPPINESS.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Customize Your Dream Pizza</button>
            <button className="btn-secondary">See Menu</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;