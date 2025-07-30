import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Vote, LogIn } from 'lucide-react'

const Login: React.FC = () => {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      console.log('Initiating Google sign in...')
      const result = await signInWithGoogle()
      console.log('Google sign in result:', result)
    } catch (error) {
      console.error('Error signing in:', error)
      alert(`Failed to sign in: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-600 text-white mb-6">
            <Vote className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hostel Election System
          </h2>
          <p className="text-gray-600 mb-8">
            Sign in with your university account to vote
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Only students with @adypu.edu.in email addresses can vote.
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign in with Google
                </>
              )}
            </button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to participate in the hostel election process.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login