import React, { useState, useEffect } from 'react';
import { predictionAPI } from '../services/api';

const Home = ({ user, onTabChange }) => {
  const [scansToday, setScansToday] = useState(0);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    const fetchScansCount = async () => {
      try {
        const response = await predictionAPI.getScansTodayCount();
        if (response?.data?.success && response.data.data) {
          setScansToday(response.data.data.scansToday || 0);
        }
      } catch (error) {
        console.error('Error fetching scans count:', error);
      } finally {
        setLoadingScans(false);
      }
    };

    if (user?._id) {
      fetchScansCount();
      // Refresh every 5 seconds to show latest count
      const interval = setInterval(fetchScansCount, 5000);
      return () => clearInterval(interval);
    }
  }, [user?._id]);
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Hero Card */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-amber-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4 pb-4">
                Welcome to AgriBot, {user?.username}! 🌱
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Your intelligent plant disease detection system. Upload leaf images and get instant disease diagnosis with treatment recommendations.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🔬 AI-Powered Analysis
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📱 Mobile Friendly
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🌿 Real-time Results
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="group backdrop-blur-xl bg-white/20 border border-white/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-emerald-600/80 font-medium">AI System Status</p>
              <p className="text-xl font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">Online & Ready</p>
            </div>
          </div>
        </div>

        <div className="group backdrop-blur-xl bg-white/20 border border-white/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-blue-600/80 font-medium">Member Since</p>
              <p className="text-xl font-bold text-blue-800 group-hover:text-blue-900 transition-colors">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="group backdrop-blur-xl bg-white/20 border border-white/30 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-amber-600/80 font-medium">Scans Today</p>
              <p className="text-xl font-bold text-amber-800 group-hover:text-amber-900 transition-colors">
                {loadingScans ? '...' : scansToday}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism Recent Activity */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12L8 10l1.4-1.4L10 9.2l2.6-2.6L14 8l-4 4z"/>
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-emerald-800">System initialized successfully</p>
                <p className="text-xs text-emerald-600/70">Just now • AI models loaded</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-blue-800">Ready to analyze plant images</p>
                <p className="text-xs text-blue-600/70">Today at 2:00 PM • Upload and scan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glass Morphism Quick Actions */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => onTabChange('prediction')}
              className="group flex flex-col items-center p-5 backdrop-blur-md bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-2 border-emerald-200/30 rounded-2xl hover:border-emerald-400/50 hover:bg-gradient-to-br hover:from-emerald-500/20 hover:to-green-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="mt-3 text-sm font-bold text-emerald-800 group-hover:text-emerald-900">Scan Plant</span>
            </button>
            
            <button 
              onClick={() => onTabChange('ai-assistant')}
              className="group flex flex-col items-center p-5 backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-2 border-blue-200/30 rounded-2xl hover:border-blue-400/50 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-indigo-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-4l-4 4v-4z" />
                </svg>
              </div>
              <span className="mt-3 text-sm font-bold text-blue-800 group-hover:text-blue-900">AI Assistant</span>
            </button>
            
            <button 
              onClick={() => onTabChange('vendors')}
              className="group flex flex-col items-center p-5 backdrop-blur-md bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-2 border-amber-200/30 rounded-2xl hover:border-amber-400/50 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-orange-600/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="mt-3 text-sm font-bold text-amber-800 group-hover:text-amber-900">Find Vendors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;