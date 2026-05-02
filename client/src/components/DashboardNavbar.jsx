import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardNavbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'home', name: 'Home', path: '/dashboard/home' },
    { id: 'prediction', name: 'Prediction', path: '/dashboard/prediction' },
    { id: 'ai-assistant', name: 'AI Assistant', path: '/dashboard/ai-assistant' },
    { id: 'vendors', name: 'Vendors', path: '/dashboard/vendors' },
    { id: 'about', name: 'About', path: '/dashboard/about' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-amber-500/10 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">AgriBot</span>
              <div className="text-xs text-emerald-600 font-medium">Plant Disease AI</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 overflow-hidden ${
                    isActive(item.path)
                      ? 'text-white shadow-lg'
                      : 'text-slate-700 hover:text-emerald-800'
                  }`}
                >
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  <motion.span
                    animate={{ x: isActive(item.path) ? 2 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.name}
                  </motion.span>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* User & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-800">{user?.username}</p>
                <p className="text-xs text-emerald-600">{user?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onLogout();
                navigate('/login');
              }}
              className="hidden sm:flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all duration-300 border border-red-200/30 hover:border-red-300/50 font-medium"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg backdrop-blur-md bg-white/30 hover:bg-white/40 border border-white/20"
            >
              <motion.svg
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
                className="h-6 w-6 text-emerald-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden pb-4 backdrop-blur-xl bg-white/10 border-t border-white/30"
            >
              <div className="space-y-2 pt-4 px-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all relative overflow-hidden backdrop-blur-md border ${
                        isActive(item.path)
                          ? 'text-white shadow-lg border-emerald-300/50'
                          : 'text-slate-700 hover:text-emerald-800 bg-white/30 border-white/30 hover:bg-white/40'
                      }`}
                    >
                      {isActive(item.path) && (
                        <motion.div
                          layoutId="activeMobileNav"
                          className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                        />
                      )}
                      <motion.span
                        animate={{ x: isActive(item.path) ? 3 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    </motion.button>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigationItems.length * 0.05, duration: 0.2 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onLogout();
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 rounded-lg transition-all border border-red-300/40 font-medium backdrop-blur-md bg-red-50/20 hover:bg-red-50/40"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
