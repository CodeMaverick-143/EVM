import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Home, LogOut, CheckCircle } from 'lucide-react'

const houses = [
  { number: 1, name: 'House 1', color: 'bg-red-500' },
  { number: 2, name: 'House 2', color: 'bg-blue-500' },
  { number: 3, name: 'House 3', color: 'bg-green-500' },
  { number: 4, name: 'House 4', color: 'bg-purple-500' }
]

const HouseSelection: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [checkingVote, setCheckingVote] = useState(true)

  useEffect(() => {
    console.log('HouseSelection mounted, user:', user?.email)
    checkIfUserHasVoted()
  }, [user])

  const checkIfUserHasVoted = async () => {
    if (!user?.email) {
      console.log('No user email found')
      return
    }

    console.log('Checking if user has voted:', user.email)
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('user_email', user.email)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking vote status:', error)
      } else if (data) {
        console.log('User has already voted:', data)
        setHasVoted(true)
      } else {
        console.log('User has not voted yet')
      }
    } catch (error) {
      console.error('Error checking vote status:', error)
    } finally {
      setCheckingVote(false)
    }
  }

  const handleHouseSelect = async (houseNumber: number) => {
    if (hasVoted) return
    
    setLoading(true)
    navigate(`/vote/${houseNumber}`)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (checkingVote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vote Already Submitted
            </h2>
            
            <p className="text-gray-600 mb-6">
              You have already submitted your vote. Thank you for participating in the hostel election!
            </p>
            
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hostel Election</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>

        {/* House Selection */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select Your House
            </h2>
            <p className="text-lg text-gray-600">
              Choose your house to view candidates and cast your vote
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {houses.map((house) => (
              <button
                key={house.number}
                onClick={() => handleHouseSelect(house.number)}
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`h-2 ${house.color}`}></div>
                
                <div className="p-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`h-16 w-16 rounded-full ${house.color} flex items-center justify-center text-white text-2xl font-bold`}>
                      {house.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {house.name}
                  </h3>
                  
                  <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                    View Candidates
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HouseSelection
