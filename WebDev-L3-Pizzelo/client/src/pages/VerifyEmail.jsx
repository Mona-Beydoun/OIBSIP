import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../services/authService';
import '../App.css';

function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const doVerify = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed.');
      }
    };
    doVerify();
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-bg-glow"></div>
      <div className="auth-card">
        <Link to="/" className="auth-logo">
          PI<span className="logo-zz">ZZ</span>ELO
        </Link>
        <h2>{status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Email Verified!' : 'Verification Failed'}</h2>
        <p className="auth-subtitle">{message}</p>
        {status === 'success' && (
          <Link to="/login" className="btn-primary auth-submit" style={{ display: 'block', textDecoration: 'none' }}>
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;