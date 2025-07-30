import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireValidEmail?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireValidEmail = true 
}) => {
  const { user, loading } = useAuth()

  // Debug logging
  console.log('ProtectedRoute - Loading:', loading, 'User:', user?.email)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('No user found, redirecting to login')
    return <Navigate to="/login" replace />
  }

  const isValidEmail = user.email?.endsWith('@adypu.edu.in')
  console.log('Email validation:', user.email, 'Valid:', isValidEmail)
  
  if (requireValidEmail && !isValidEmail) {
    console.log('Invalid email domain, redirecting to unauthorized')
    return <Navigate to="/unauthorized" replace />
  }

  console.log('User authenticated successfully, rendering protected content')
  return <>{children}</>
}

export default ProtectedRoute