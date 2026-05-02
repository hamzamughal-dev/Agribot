import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import DashboardNavbar from './DashboardNavbar';
import { UserProvider } from '../context/UserContext';

const DashboardLayout = ({ children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          console.log('User not found in database, redirecting to login...');
          onLogout();
          navigate('/login');
          return;
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        if (err.response?.status === 401 || err.response?.status === 404) {
          console.log('User authentication failed, redirecting to login...');
          onLogout();
          navigate('/login');
          return;
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [onLogout, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/20 to-transparent"></div>
      </div>

      <DashboardNavbar onLogout={onLogout} user={user} />

      {/* Main Content */}
      <main className="relative z-10 min-h-[calc(100vh-80px)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProvider user={user}>
            {children}
          </UserProvider>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
