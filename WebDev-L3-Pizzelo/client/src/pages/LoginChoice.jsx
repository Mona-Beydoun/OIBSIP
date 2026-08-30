import { Link } from 'react-router-dom';
import '../App.css';

function LoginChoice() {
  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>
      <div className="choice-card">
        <Link to="/" className="auth-logo">
          PI<span className="logo-zz">ZZ</span>ELO
        </Link>

        <h2>Who's logging in?</h2>
        <p className="auth-subtitle">Choose how you'd like to continue.</p>

        <div className="choice-options">
          <Link to="/login/customer" className="choice-option">
        
            <span className="choice-title">Customer Login</span>
            <span className="choice-desc">Order your dream pizza and track it live.</span>
          </Link>

          <Link to="/admin/login" className="choice-option choice-option-admin">
         
            <span className="choice-title">Admin Login</span>
            <span className="choice-desc">Restricted access for Pizzelo staff.</span>
          </Link>
        </div>

        <p className="auth-footer-link">
          New here? <Link to="/register">Create a customer account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginChoice;