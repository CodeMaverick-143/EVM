import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Unauthorized from './components/Unauthorized'
import HouseSelection from './components/HouseSelection'
import VotingInterface from './components/VotingInterface'
import AdminPanel from './components/AdminPanel'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HouseSelection />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/vote/:houseNumber" 
            element={
              <ProtectedRoute>
                <VotingInterface />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireValidEmail={false}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App