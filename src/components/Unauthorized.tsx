import React from 'react'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Unauthorized: React.FC = () => {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          
          <p className="text-gray-600 mb-6">
            Only students with @adypu.edu.in email addresses can access the voting system.
          </p>
          
          <button
            onClick={signOut}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized