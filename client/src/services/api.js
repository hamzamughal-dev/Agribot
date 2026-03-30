import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password })
};

// Prediction API calls
export const predictionAPI = {
  predictDisease: (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post('/prediction/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  getModelInfo: () => api.get('/prediction/model-info'),
  getScansTodayCount: () => api.get('/prediction/scans-today')
};

export default api;