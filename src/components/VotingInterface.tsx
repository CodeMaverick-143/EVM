import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, ArrowUp, ArrowDown, Vote, CheckCircle } from 'lucide-react'

const candidatesByHouse = {
  1: ['Ayush Shukla', 'Sanket Jha', 'Abhijeet', 'Atharv Paharia', 'Gopi Raman Thakur', 'Shubh Arya'],
  2: ['Ankit Singh', 'Ashu Choudhary', 'Pushkar Sharma', 'Siddharth Pareek'],
  3: ['Devansh Saini', 'Divyansh Choudhary'],
  4: ['Giddalur Jaya Geethika', 'Isha Singh', 'Neha Sharma', 'Nitya Jain']
}

const VotingInterface: React.FC = () => {
  const { houseNumber } = useParams<{ houseNumber: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [preferences, setPreferences] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const house = parseInt(houseNumber || '1')
  const candidates = candidatesByHouse[house as keyof typeof candidatesByHouse] || []

  useEffect(() => {
    // Initialize with empty preferences array
    setPreferences(new Array(candidates.length).fill(''))
  }, [candidates.length])

  const moveCandidate = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= preferences.length) return

    const newPreferences = [...preferences]
    const [movedCandidate] = newPreferences.splice(fromIndex, 1)
    newPreferences.splice(toIndex, 0, movedCandidate)
    setPreferences(newPreferences)
  }

  const setPreference = (candidate: string, position: number) => {
    const newPreferences = [...preferences]
    
    // Remove candidate from current position if exists
    const currentIndex = newPreferences.indexOf(candidate)
    if (currentIndex !== -1) {
      newPreferences[currentIndex] = ''
    }
    
    // Set candidate at new position
    newPreferences[position] = candidate
    setPreferences(newPreferences)
  }

  const submitVote = async () => {
    if (!user?.email) return

    // Filter out empty preferences and maintain order
    const validPreferences = preferences.filter(p => p !== '')
    
    if (validPreferences.length === 0) {
      alert('Please rank at least one candidate')
      return
    }

    setLoading(true)

    try {
      // Check if user has already voted
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('user_email', user.email)
        .single()

      if (existingVote) {
        alert('You have already submitted your vote!')
        navigate('/')
        return
      }

      // Submit vote
      const { error } = await supabase
        .from('votes')
        .insert({
          user_email: user.email,
          house_number: house,
          preferences: validPreferences
        })

      if (error) throw error

      setShowSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)

    } catch (error) {
      console.error('Error submitting vote:', error)
      alert('Failed to submit vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vote Submitted Successfully!
            </h2>
            
            <p className="text-gray-600 mb-6">
              Thank you for participating in the hostel election. Your vote has been recorded.
            </p>
            
            <div className="text-sm text-gray-500">
              Redirecting to home page...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Houses
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">House {house} Voting</h1>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">How to Vote:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Click on candidates to rank them in order of preference</li>
              <li>2. Your first choice gets rank 1, second choice gets rank 2, etc.</li>
              <li>3. You can rearrange using the arrow buttons</li>
              <li>4. Click Submit when you're satisfied with your rankings</li>
            </ol>
          </div>

          {/* Voting Interface */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Rank Candidates (House {house})
              </h2>
            </div>

            <div className="p-6">
              {/* Ranked Preferences */}
              <div className="mb-8">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Your Rankings:</h3>
                <div className="space-y-2">
                  {preferences.map((candidate, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        candidate 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-gray-50 border-gray-200 border-dashed'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className={candidate ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                          {candidate || 'Click a candidate below to rank them here'}
                        </span>
                      </div>
                      
                      {candidate && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => moveCandidate(index, index - 1)}
                            disabled={index === 0}
                            className="p-1 rounded text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => moveCandidate(index, index + 1)}
                            disabled={index === preferences.length - 1}
                            className="p-1 rounded text-gray-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Candidates */}
              <div className="mb-8">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Available Candidates:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {candidates.map((candidate) => {
                    const isRanked = preferences.includes(candidate)
                    const rank = preferences.indexOf(candidate) + 1
                    
                    return (
                      <button
                        key={candidate}
                        onClick={() => {
                          if (isRanked) {
                            // Remove from preferences
                            const newPreferences = preferences.map(p => p === candidate ? '' : p)
                            setPreferences(newPreferences)
                          } else {
                            // Add to first empty slot
                            const emptyIndex = preferences.findIndex(p => p === '')
                            if (emptyIndex !== -1) {
                              setPreference(candidate, emptyIndex)
                            }
                          }
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isRanked
                            ? 'bg-blue-100 border-blue-300 text-blue-900'
                            : 'bg-white border-gray-300 text-gray-900 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{candidate}</span>
                          {isRanked && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              #{rank}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  onClick={submitVote}
                  disabled={loading || preferences.filter(p => p !== '').length === 0}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Vote className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Submitting Vote...' : 'Submit Vote'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VotingInterface