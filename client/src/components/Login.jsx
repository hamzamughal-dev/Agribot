import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';

const Login = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { email, password } = formData;

  // Farming images for slideshow
  const slideshowImages = [
    {
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop',
      title: 'Smart Farming Solutions',
      subtitle: 'Revolutionizing agriculture with AI'
    },
    {
      url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop',
      title: 'Precision Agriculture',
      subtitle: 'Data-driven crop management'
    },
    {
      url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1200&h=800&fit=crop',
      title: 'Sustainable Practices',
      subtitle: 'Growing a greener future'
    },
    {
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=800&fit=crop',
      title: 'Advanced Analytics',
      subtitle: 'Real-time crop monitoring'
    },
    {
      url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop',
      title: 'Modern Farming',
      subtitle: 'Technology meets tradition'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % slideshowImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      const res = await authAPI.login({
        email,
        password
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.user.token);
        onAuthSuccess();
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.needsVerification) {
        setNeedsVerification(true);
        setError('Your email is not verified. Please verify your email to continue.');
      } else {
        setError(errorData?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setLoading(true);
      // Request new OTP
      const res = await authAPI.resendOTP(email);
      if (res.data.success) {
        setShowOTPVerification(true);
        setNeedsVerification(false);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (message) => {
    setShowOTPVerification(false);
    alert(message || 'Email verified successfully!');
    onAuthSuccess();
  };

  const handleBackToLogin = () => {
    setShowOTPVerification(false);
    setNeedsVerification(false);
    setError('');
  };

  // Show OTP verification if user needs to verify email
  if (showOTPVerification) {
    return (
      <OTPVerification 
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToRegister={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 pt-20">
      {/* Left Side - Image Slideshow */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-black"
      >
        {/* Image Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={slideshowImages[currentImageIndex].url}
              alt={slideshowImages[currentImageIndex].title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-green-900/60"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between px-12 xl:px-20 py-16 text-white">
          {/* Logo and Brand */}
          {/* <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl shadow-2xl"
            >
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </motion.div>
          </motion.div> */}

          {/* Slideshow Text Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-300 bg-clip-text text-transparent">
                    {slideshowImages[currentImageIndex].title}
                  </span>
                </h1>
                
                <p className="text-2xl xl:text-3xl text-gray-200 leading-relaxed">
                  {slideshowImages[currentImageIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slideshow Indicators */}
            <div className="flex space-x-3 pt-6">
              {slideshowImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentImageIndex 
                      ? 'w-12 bg-gradient-to-r from-emerald-400 to-green-500' 
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Brand Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold">
              Welcome to <span className="text-emerald-400">AgriBot</span>
            </h2>
            <p className="text-lg text-gray-300">
              Empowering farmers with intelligent solutions for sustainable agriculture
            </p>
          </motion.div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-white via-gray-50 to-emerald-50 relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-300/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-md w-full relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Mobile Logo */}
            {/* <div className="lg:hidden flex justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </motion.div>
            </div> */}

            <div className="text-center mb-8">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-3"
              >
                Welcome Back! 🌱
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-base sm:text-lg"
              >
                Sign in to continue to your account
              </motion.p>
            </div>

            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-6" 
              onSubmit={onSubmit}
            >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`backdrop-blur-md border px-5 py-4 rounded-xl shadow-lg ${
              needsVerification 
                ? 'bg-yellow-50 border-yellow-400 text-yellow-800'
                : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              <div className="flex items-center">
                {needsVerification ? (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{error}</span>
              </div>
              {needsVerification && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={loading}
                  className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending verification email...
                    </div>
                  ) : (
                    'Send verification email'
                  )}
                </motion.button>
              )}
            </motion.div>
          )}
          
          <div className="space-y-5">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={onChange}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Email address"
              />
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={onChange}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Password"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent font-bold rounded-xl text-white bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl text-lg"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in 🚀'
              )}
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4"
          >
            <Link
              to="/forgot-password"
              className="group font-semibold text-emerald-700 hover:text-emerald-900 transition-all duration-300 flex items-center space-x-1"
            >
              <span>Forgot password?</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              to="/register"
              className="group font-semibold text-emerald-700 hover:text-emerald-900 transition-all duration-300 flex items-center space-x-1"
            >
              <span>Create account</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.form>

        {/* Trust Indicators */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 pt-8 border-t border-gray-200"
        >
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Email Verified</span>
            </div>
          </div>
        </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

