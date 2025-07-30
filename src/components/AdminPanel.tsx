import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Download, Users, BarChart3, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Vote {
  id: string
  user_email: string
  house_number: number
  preferences: string[]
  created_at: string
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalVotes: 0,
    votesByHouse: { 1: 0, 2: 0, 3: 0, 4: 0 }
  })

  useEffect(() => {
    fetchVotes()
  }, [])

  const fetchVotes = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setVotes(data || [])
      
      // Calculate stats
      const votesByHouse = { 1: 0, 2: 0, 3: 0, 4: 0 }
      data?.forEach(vote => {
        votesByHouse[vote.house_number as keyof typeof votesByHouse]++
      })

      setStats({
        totalVotes: data?.length || 0,
        votesByHouse
      })
    } catch (error) {
      console.error('Error fetching votes:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    const headers = ['Email', 'House', 'Rank 1', 'Rank 2', 'Rank 3', 'Rank 4', 'Rank 5', 'Rank 6', 'Submitted At']
    
    const csvData = votes.map(vote => [
      vote.user_email,
      vote.house_number,
      ...Array.from({ length: 6 }, (_, i) => vote.preferences[i] || ''),
      new Date(vote.created_at).toLocaleString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `hostel_election_votes_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            Back to Home
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Election Admin Panel</h1>
            <p className="text-sm text-gray-600">Logged in as: {user?.email}</p>
          </div>
          
          <button
            onClick={downloadCSV}
            disabled={votes.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Votes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVotes}</p>
              </div>
            </div>
          </div>

          {Object.entries(stats.votesByHouse).map(([house, count]) => (
            <div key={house} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">House {house}</p>
                  <p className="text-2xl font-semibold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Votes Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Votes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    House
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferences
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {votes.map((vote) => (
                  <tr key={vote.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vote.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      House {vote.house_number}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <ol className="list-decimal list-inside space-y-1">
                        {vote.preferences.map((candidate, index) => (
                          <li key={index} className="text-xs">
                            {candidate}
                          </li>
                        ))}
                      </ol>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vote.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {votes.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-sm font-medium text-gray-900">No votes yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Votes will appear here as they are submitted.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel