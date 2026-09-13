import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendContactMessage } from '../services/contactService';
import '../App.css';

function Contact() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    setSubmitting(true);
    try {
      await sendContactMessage(formData);
      setStatus({ type: 'success', text: "Thanks! We'll get back to you soon." });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="menu-page contact-page-fit">
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

      <div className="menu-content contact-content-fit">
        <div className="menu-header contact-header-fit">
          <h1 className="menu-title">Get In Touch</h1>
          <p className="menu-subtitle">Questions, feedback, or just want to say hi? We'd love to hear from you.</p>
        </div>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            {status.text && (
              <p className={status.type === 'success' ? 'auth-success' : 'auth-error'}>
                {status.text}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-info-item">
              <h4>Address</h4>
              <p>Beirut, Hamra Street</p>
            </div>
            <div className="contact-info-item">
              <h4>Phone</h4>
              <p>+961 1 234 567</p>
            </div>
            <div className="contact-info-item">
              <h4>Hours</h4>
              <p>Mon – Sun: 11:00 AM – 11:00 PM</p>
            </div>
            <div className="contact-info-item">
              <h4>Email</h4>
              <p>pizzelo@pizzelo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;