import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import DashboardLayout from './components/DashboardLayout'
import Navbar from './components/Navbar'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import DashboardHome from './pages/DashboardHome'
import DashboardAbout from './pages/DashboardAbout'
import DashboardPrediction from './pages/DashboardPrediction'
import AIAssistantPage from './pages/AIAssistantPage'
import VendorsPage from './pages/VendorsPage'
import { authAPI } from './services/api'

function AppContent({ isAuthenticated, onAuthSuccess, onLogout }) {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="App">
      {/* Hide Navbar on Dashboard routes since DashboardLayout has its own navigation */}
      {!isDashboardRoute && (
        <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Login onAuthSuccess={onAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Register onAuthSuccess={onAuthSuccess} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <ForgotPassword />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <ResetPassword />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={onLogout}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                  <Route path="home" element={<DashboardHome />} />
                  <Route path="about" element={<DashboardAbout />} />
                  <Route path="prediction" element={<DashboardPrediction />} />
                  <Route path="ai-assistant" element={<AIAssistantPage />} />
                  <Route path="vendors" element={<VendorsPage />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/dashboard/home" : "/login"} replace />
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Verify if the user still exists in database
          const res = await authAPI.getMe();
          if (res.data.success) {
            setIsAuthenticated(true)
          } else {
            // User doesn't exist, remove invalid token
            localStorage.removeItem('token')
            setIsAuthenticated(false)
          }
        } catch (err) {
          // Token is invalid or user was deleted from database
          console.log('Token validation failed, logging out...')
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    validateToken()
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated} 
        onAuthSuccess={handleAuthSuccess} 
        onLogout={handleLogout} 
      />
    </Router>
  )
}

export default App
