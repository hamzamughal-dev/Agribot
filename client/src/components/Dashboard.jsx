import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import Home from './Home';
import About from './About';
import Prediction from './Prediction';
import AIAssistant from './AIAssistant';
import Vendors from './Vendors';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  const navigationItems = [
    { id: 'home', name: 'Home', icon: 'home' },
    { id: 'about', name: 'About', icon: 'info' },
    { id: 'prediction', name: 'Prediction', icon: 'chart' },
    { id: 'ai-assistant', name: 'AI Assistant', icon: 'robot' },
    { id: 'vendors', name: 'Vendors', icon: 'users' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authAPI.getMe();
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          // User doesn't exist in database, logout and redirect
          console.log('User not found in database, redirecting to login...');
          onLogout();
          navigate('/login');
          return;
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        // If user fetch fails (user deleted from database), logout automatically
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

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderIcon = (iconName) => {
    const iconClass = sidebarCollapsed ? "h-6 w-6" : "h-5 w-5";
    
    switch (iconName) {
      case 'home':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'info':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'robot':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'users':
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home user={user} />;
      case 'about':
        return <About />;
      case 'prediction':
        return <Prediction />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'vendors':
        return <Vendors />;
      default:
        return <Home user={user} />;
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-amber-50 overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/20 to-transparent"></div>
      </div>

      {!isDesktop && (
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 backdrop-blur-md bg-white/80 border border-white/60 rounded-xl p-2.5 shadow-lg lg:hidden"
          aria-label="Open dashboard menu"
        >
          <svg className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {isMobileSidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Fixed Glass Morphism Sidebar */}
      <div className={`${sidebarCollapsed ? 'lg:w-16 xl:w-20' : 'lg:w-56 xl:w-64'} w-72 sm:w-80 backdrop-blur-xl bg-white/20 border-r border-white/30 shadow-2xl h-screen transition-all duration-500 ease-out fixed left-0 top-0 z-50 overflow-y-auto overflow-x-hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-2 sm:p-4 lg:p-6">
          {/* Toggle Button */}
          <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm flex-shrink-0">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent truncate block">AgriBot</span>
                  <div className="text-xs text-emerald-600 font-medium truncate">Plant Disease AI</div>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`hidden lg:block backdrop-blur-md bg-white/30 hover:bg-white/40 border border-white/20 rounded-xl p-2.5 transition-all duration-300 shadow-lg hover:shadow-xl ${sidebarCollapsed ? 'mx-auto' : ''}`}
            >
              <svg 
                className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (!isDesktop) {
                    setIsMobileSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-3 py-4 mx-2' : 'space-x-4 px-4 py-3.5'} text-left rounded-xl transition-all duration-300 relative group ${
                  activeTab === item.id
                    ? sidebarCollapsed
                      ? 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-xl backdrop-blur-md border border-white/20 transform scale-105'
                      : 'bg-gradient-to-r from-emerald-100/80 to-green-100/80 text-emerald-800 border-l-4 border-emerald-600 shadow-lg backdrop-blur-md'
                    : 'text-slate-700 hover:bg-white/40 hover:text-emerald-800 hover:shadow-md backdrop-blur-sm hover:backdrop-blur-md'
                }`}
                title={sidebarCollapsed ? item.name : ''}
              >
                <div className={`${sidebarCollapsed && activeTab === item.id ? 'transform scale-110' : ''} transition-transform duration-200`}>
                  {renderIcon(item.icon)}
                </div>
                {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                
                {/* Glass Morphism Tooltip */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-4 py-2.5 backdrop-blur-xl bg-slate-900/95 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[9999] shadow-2xl border border-white/20 pointer-events-none">
                    {item.name}
                    <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-slate-900/95 rotate-45 border-l border-b border-white/20"></div>
                  </div>
                )}
              </button>
            ))}
          
          {/* Logout Button */}
          <div className="mt-auto pt-6">
            <button
              onClick={() => {
                onLogout();
                navigate('/login');
              }}
              className="group w-full flex items-center space-x-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-xl transition-all duration-300 backdrop-blur-sm border border-red-200/30 hover:border-red-300/50"
            >
              <div className={`${sidebarCollapsed && 'transform scale-110'} transition-transform duration-200`}>
                <svg className={`${sidebarCollapsed ? "h-6 w-6" : "h-5 w-5"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
              
              {/* Glass Morphism Tooltip for Logout */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-4 py-2.5 backdrop-blur-xl bg-red-900/95 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[9999] shadow-2xl border border-red-300/20 pointer-events-none">
                  Logout
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-red-900/95 rotate-45 border-l border-b border-red-300/20"></div>
                </div>
              )}
            </button>
          </div>
        </nav>
        </div>
      </div>

      {/* Main Content with Glass Background - Offset for Fixed Sidebar */}
      <div className={`min-h-screen transition-all duration-500 ease-out overflow-x-hidden ${sidebarCollapsed ? 'lg:ml-16 xl:ml-20' : 'lg:ml-56 xl:ml-64'}`}>
        <main className="p-2 pt-20 sm:p-4 md:p-6 lg:p-8 xl:p-10 lg:pt-8 w-full min-w-0">
          <div className="max-w-full overflow-x-hidden">
            <div className="w-full min-w-0">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;