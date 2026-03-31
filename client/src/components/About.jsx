import React from 'react';

const About = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4 pb-4">
                🤖 About AgriBot
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Advanced AI-powered plant disease detection system for modern agriculture
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🌿 AI Technology
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📊 Machine Learning
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🌱 Agriculture
            </div>
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">
            🚀 Our Technology
          </h2>
        </div>
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-lg text-emerald-800/90 mb-6">
              AgriBot is an advanced plant disease detection system that leverages cutting-edge AI and machine learning 
              technologies to help farmers, agricultural professionals, and gardeners quickly identify plant diseases 
              through simple image analysis.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4">🎯 Our Mission</h3>
                <p className="text-emerald-800">
                  To revolutionize agriculture by providing accessible, accurate, and instant plant disease 
                  diagnosis through AI-powered image recognition, helping farmers protect their crops and 
                  increase yield with timely interventions.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-emerald-900 mb-4">🔭 Our Vision</h3>
                <p className="text-emerald-800">
                  To become the leading agricultural technology platform that empowers farmers worldwide 
                  with intelligent disease detection tools, connecting them with treatment solutions and 
                  expert guidance for sustainable farming practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">🔑 Key Features</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Image Recognition</h4>
                <p className="text-emerald-700">Advanced AI-powered image analysis to identify plant diseases from leaf photos.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2h-4l-4 4v-4z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">AI Chatbot Assistant</h4>
                <p className="text-emerald-700">Interactive AI chatbot to answer your farming questions and provide expert guidance.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Treatment Recommendations</h4>
                <p className="text-emerald-700">Get instant treatment suggestions and preventive measures for detected diseases.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Pesticide Vendors</h4>
                <p className="text-emerald-700">Find nearby pesticide suppliers and agricultural vendors in your area.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Secure & Private</h4>
                <p className="text-emerald-700">Your plant images and data are processed securely with privacy protection.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">Fast Analysis</h4>
                <p className="text-emerald-700">Get instant disease detection results within seconds of image upload.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">🛠️ Technology Stack</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-emerald-900 mb-4">🤖 AI & Machine Learning</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-700">TensorFlow & Keras</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-700">Convolutional Neural Networks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-700">Computer Vision</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-emerald-700">Python & OpenCV</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-emerald-900 mb-4">🌐 Web Technologies</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-emerald-700">React.js Frontend</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-emerald-700">Node.js Backend</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-emerald-700">MongoDB Database</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  <span className="text-emerald-700">RESTful APIs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">🌾 Start Protecting Your Crops Today</h3>
          <p className="text-xl opacity-90 mb-6">
            Join thousands of farmers who are already using AgriBot to detect and prevent plant diseases early.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;