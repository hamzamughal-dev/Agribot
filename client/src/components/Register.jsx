import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '../services/api';
import OTPVerification from './OTPVerification';

const Register = ({ onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { username, email, password, confirmPassword } = formData;

  // Agriculture/Growth themed images for register page
  const slideshowImages = [
    {
      url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&h=800&fit=crop',
      title: 'Start Your Journey',
      subtitle: 'Join thousands of smart farmers',
      icon: '🌱'
    },
    {
      url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&h=800&fit=crop',
      title: 'Grow with Technology',
      subtitle: 'Harness AI for better yields',
      icon: '🚀'
    },
    {
      url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=800&fit=crop',
      title: 'Track Your Progress',
      subtitle: 'Monitor crops in real-time',
      icon: '📈'
    },
    {
      url: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=800&fit=crop',
      title: 'Connect & Learn',
      subtitle: 'Join our farming community',
      icon: '🤝'
    },
    {
      url: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=1200&h=800&fit=crop',
      title: 'Transform Agriculture',
      subtitle: 'Be part of the revolution',
      icon: '✨'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % slideshowImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await authAPI.register({
        username,
        email,
        password
      });

      if (res.data.success) {
        setRegisteredEmail(email);
        setShowOTPVerification(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (message) => {
    // Show success message briefly then proceed to dashboard
    setTimeout(() => {
      onAuthSuccess();
    }, 1500);
  };

  const handleBackToRegister = () => {
    setShowOTPVerification(false);
    setRegisteredEmail('');
    setError('');
  };

  // Show OTP verification if registration was successful
  if (showOTPVerification) {
    return (
      <OTPVerification 
        email={registeredEmail}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToRegister={handleBackToRegister}
      />
    );
  }

  return (
    <div className="min-h-screen flex overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 pt-20">
      {/* Left Side - Registration Form */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-white via-gray-50 to-emerald-50 relative overflow-hidden"
      >
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-green-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-green-200/30 to-emerald-300/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-md w-full relative z-10">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center mb-6">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 bg-clip-text text-transparent mb-3"
              >
                Join AgriBot! 🚀
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-base sm:text-lg mb-6"
              >
                Create your account and start growing
              </motion.p>
              
              {/* Progress Steps */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="hidden sm:flex justify-center mb-6"
              >
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-xl px-5 py-3 shadow-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                    <span className="ml-2 text-emerald-700 font-semibold text-sm">Register</span>
                  </div>
                  <div className="w-6 border-t-2 border-emerald-300"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white text-emerald-400 rounded-full flex items-center justify-center text-sm font-bold border-2 border-emerald-200">2</div>
                    <span className="ml-2 text-emerald-400 font-semibold text-sm">Verify</span>
                  </div>
                  <div className="w-6 border-t-2 border-emerald-300"></div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white text-emerald-400 rounded-full flex items-center justify-center text-sm font-bold border-2 border-emerald-200">3</div>
                    <span className="ml-2 text-emerald-400 font-semibold text-sm">Start</span>
                  </div>
                </div>
              </motion.div>
              <p className="sm:hidden text-sm font-semibold text-emerald-700">Step 1 of 3: Register your account</p>
            </div>

            <motion.form 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-5" 
              onSubmit={onSubmit}
            >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-red-50 border-2 border-red-400 text-red-800 px-5 py-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-4">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={onChange}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Username"
              />
            </motion.div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
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
              transition={{ delay: 0.9 }}
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
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-emerald-500 group-focus-within:text-emerald-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={onChange}
                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Confirm Password"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
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
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </span>
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account 🌱'
              )}
            </motion.button>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center pt-4"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-semibold text-emerald-700 hover:text-emerald-900 transition-colors">
                Sign in here
              </a>
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span>1000+ Users</span>
              </div>
            </div>
          </motion.div>
        </motion.form>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Image Slideshow */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden bg-black"
      >
        {/* Image Slideshow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0"
          >
            <img
              src={slideshowImages[currentImageIndex].url}
              alt={slideshowImages[currentImageIndex].title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-transparent to-green-900/60"></div>
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 xl:px-20 py-16 text-white text-center">
          {/* Slideshow Content with Icon */}
          <div className="space-y-8 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-8xl"
                >
                  {slideshowImages[currentImageIndex].icon}
                </motion.div>

                <h1 className="text-6xl xl:text-7xl font-bold leading-tight">
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
            <div className="flex justify-center space-x-3 pt-8">
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

            {/* Feature Badges */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-4 pt-8"
            >
              {['AI-Powered', 'Real-time Monitoring', 'Expert Support', 'Free to Start'].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring" }}
                  className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm font-semibold"
                >
                  {badge}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-emerald-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -40, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Register;