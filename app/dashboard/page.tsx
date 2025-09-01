'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getUserRecipes } from '@/lib/database'
import { Recipe } from '@/lib/supabase'

export default function DashboardPage() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserRecipes() {
      if (!user) return
      
      try {
        console.log('Fetching recipes for user:', user.id)
        const { recipes: userRecipes, error } = await getUserRecipes(user.id)
        
        if (error) {
          console.error('Error fetching user recipes:', error)
          setError(error.message || 'Failed to load recipes')
        } else {
          console.log('Fetched recipes:', userRecipes)
          setRecipes(userRecipes || [])
        }
      } catch (err: any) {
        console.error('Exception fetching user recipes:', err)
        setError(err.message || 'Failed to load recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRecipes()
  }, [user])
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Manage your recipes and discover new ones from the community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/upload"
                  className="block w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-center"
                >
                  Share New Recipe
                </Link>
                <Link
                  href="/"
                  className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
                >
                  Browse Recipes
                </Link>
              </div>
            </div>
            
            {/* My Recipes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">My Recipes</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading recipes...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 mb-2">Error loading recipes</p>
                  <p className="text-sm text-gray-500">{error}</p>
                </div>
              ) : recipes.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <p>No recipes yet.</p>
                  <p className="text-sm mt-2">Start by sharing your first recipe!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recipes.map((recipe) => (
                    <div key={recipe.id} className="p-3 border border-gray-200 rounded-md">
                      <h3 className="font-medium text-gray-900 truncate">{recipe.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {recipe.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(recipe.created_at).toLocaleDateString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          recipe.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {recipe.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Recipes Shared</span>
                  <span className="font-semibold">{loading ? '...' : recipes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Public Recipes</span>
                  <span className="font-semibold">
                    {loading ? '...' : recipes.filter(r => r.is_public).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Private Recipes</span>
                  <span className="font-semibold">
                    {loading ? '...' : recipes.filter(r => !r.is_public).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="text-gray-500 text-center py-8">
                  <p>No activity yet.</p>
                  <p className="text-sm mt-2">Your recipe activity will appear here.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}