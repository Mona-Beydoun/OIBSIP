import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import '../App.css';

function AdminLogin() {
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page admin-auth-page">
      <div className="auth-bg-glow"></div>
      <div className="auth-card admin-auth-card">
       

        <Link to="/" className="auth-logo">
          PI<span className="logo-zz">ZZ</span>ELO
        </Link>

        <h2>Admin Login</h2>
        <p className="auth-subtitle">Restricted access for Pizzelo staff.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Admin Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your admin password"
              required
            />
          </label>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In as Admin'}
          </button>
        </form>

        <p className="auth-footer-link">
          Not a staff member? <Link to="/login">Customer Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;