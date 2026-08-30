import { useAdminAuth } from '../context/AdminAuthContext';

function AdminDashboard() {
  const { admin, logoutAdmin } = useAdminAuth();

  return (
    <div style={{ color: 'white', padding: '40px' }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {admin?.name}</p>
      <button onClick={logoutAdmin} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Log Out
      </button>
    </div>
  );
}

export default AdminDashboard;