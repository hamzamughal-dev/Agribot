import React, { useState } from 'react';
import { predictionAPI } from '../services/api';

const Prediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Call the real API with the image file
      const response = await predictionAPI.predictDisease(selectedImage);
      
      if (response.data.success) {
        setPrediction(response.data.data);
      } else {
        setError('Failed to analyze image. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError(err.response?.data?.message || 'An error occurred while analyzing the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Glass Morphism Header */}
      <div className="relative overflow-hidden backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-teal-500/20 border border-white/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4">
                🔬 Plant Disease Detection
              </h1>
              <p className="text-lg lg:text-xl text-emerald-800/80 leading-relaxed">
                Upload a leaf image to get instant AI-powered disease diagnosis and treatment recommendations
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              🤖 AI Analysis
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              📊 Instant Results
            </div>
            <div className="px-4 py-2 backdrop-blur-md bg-white/20 border border-white/30 rounded-full text-emerald-700 text-sm font-medium">
              💊 Treatment Plans
            </div>
          </div>
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-white/10 to-emerald-50/20 border-b border-white/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent flex items-center">
            <svg className="h-6 w-6 text-emerald-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Disease Analysis
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Glass Morphism Image Upload Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-6">📤 Upload Plant Image</h3>
                <div className="border-2 border-dashed border-emerald-300/40 bg-gradient-to-br from-emerald-50/30 to-green-50/30 rounded-2xl p-8 text-center backdrop-blur-md hover:border-emerald-400/60 hover:bg-emerald-50/40 transition-all duration-300">
                  {imagePreview ? (
                    <div className="space-y-6">
                      <div className="relative group">
                        <img 
                          src={imagePreview} 
                          alt="Plant leaf preview" 
                          className="mx-auto h-56 w-56 object-cover rounded-2xl shadow-xl border-4 border-white/30 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-semibold text-green-700">Image uploaded successfully</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-emerald-600 to-green-700 rounded-2xl shadow-lg mx-auto w-20 h-20 flex items-center justify-center">
                        <svg className="h-10 w-10 text-white" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-lg font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent hover:from-emerald-900 hover:to-green-800 transition-all">Upload a leaf image</span>
                          <p className="text-emerald-700/70 mt-2"> or drag and drop</p>
                        </label>
                        <p className="text-xs text-emerald-600/60 mt-3 font-medium">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || loading}
                    className={`flex-1 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform ${
                      !selectedImage || loading
                        ? 'bg-gray-300/50 text-gray-500 cursor-not-allowed backdrop-blur-md'
                        : 'bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 shadow-xl hover:shadow-2xl hover:scale-105'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        🔬 Analyzing Plant...
                      </span>
                    ) : (
                      '🤖 Analyze Plant Disease'
                    )}
                  </button>
                  
                  {selectedImage && (
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setPrediction(null);
                        setError(null);
                      }}
                      className="px-8 py-4 backdrop-blur-md bg-white/30 border border-white/30 text-red-600 rounded-2xl hover:bg-white/40 hover:text-red-700 transition-all duration-300 font-semibold"
                    >
                      🗑️ Clear
                    </button>
                  )}
                </div>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-100/80 backdrop-blur-md border border-red-300 rounded-xl">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-red-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-800 text-sm font-medium">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">

              {prediction && (
                <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent mb-4">🔬 Disease Analysis Results</h3>
                  
                  {/* Disease Info */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-emerald-900">{prediction.disease}</h4>
                      <p className="text-sm text-emerald-700/80 mt-1">{prediction.description}</p>
                    </div>
                    
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      prediction.severity === 'Mild' ? 'bg-yellow-100 text-yellow-800' :
                      prediction.severity === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                      prediction.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {prediction.severity === 'None' ? 'Healthy Plant' : `${prediction.severity} Severity`}
                    </div>
                  </div>

                  {/* Symptoms */}
                  {prediction.symptoms.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-bold text-emerald-900 mb-2">🔍 Symptoms Detected</h5>
                      <ul className="space-y-1">
                        {prediction.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <svg className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-emerald-800">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Treatments */}
                  {prediction.treatments.length > 0 && (
                    <div className="mb-6">
                      <h5 className="font-bold text-emerald-900 mb-2">💊 Recommended Treatments</h5>
                      <ul className="space-y-1">
                        {prediction.treatments.map((treatment, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <svg className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-emerald-800">{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Pesticides */}
                  {prediction.pesticides.length > 0 && (
                    <div>
                      <h5 className="font-bold text-emerald-900 mb-2">🧪 Recommended Pesticides</h5>
                      <div className="flex flex-wrap gap-2">
                        {prediction.pesticides.map((pesticide, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                            {pesticide}
                          </span>
                        ))}
                      </div>
                      <button className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold">
                        🏪 Find Nearby Vendors
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Prediction;