'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requiredAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requiredAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requiredAuth && !user) {
        router.push(redirectTo)
      } else if (!requiredAuth && user) {
        router.push('/')
      }
    }
  }, [user, loading, router, redirectTo, requiredAuth])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (requiredAuth && !user) {
    return null // Will redirect
  }

  if (!requiredAuth && user) {
    return null // Will redirect
  }

  return <>{children}</>
}