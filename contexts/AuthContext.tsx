'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { getProfile, createProfile } from '@/lib/database'
import { Profile } from '@/lib/supabase'
import { signOut as authSignOut } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (!user) return
    
    const { profile: userProfile, error } = await getProfile(user.id)
    if (userProfile) {
      setProfile(userProfile)
    }
  }

  const signOut = async () => {
    console.log('AuthContext signOut called')
    await authSignOut()
    setUser(null)
    setProfile(null)
    setSession(null)
    console.log('AuthContext signOut completed')
  }

  useEffect(() => {
    // Restore auth state from localStorage on page load
    console.log('Checking for existing auth state in localStorage...')
    
    const restoreAuthState = async () => {
      try {
        const storedToken = localStorage.getItem('supabase.auth.token')
        if (storedToken) {
          console.log('Found stored token, restoring auth state')
          const sessionData = JSON.parse(storedToken)
          
          // Check if token is expired
          if (sessionData.expires_at && Date.now() / 1000 >= sessionData.expires_at) {
            console.log('Token expired, clearing storage')
            localStorage.removeItem('supabase.auth.token')
            setSession(null)
            setUser(null)
            setLoading(false)
            return
          }
          
          const user = sessionData.user
          if (user) {
            console.log('Restoring user session for:', user.email)
            setSession(sessionData)
            setUser(user)
            
            // Try to get or create profile
            const { profile: existingProfile, error } = await getProfile(user.id)
            
            if (existingProfile) {
              setProfile(existingProfile)
            } else if (!error || error.code === 'PGRST116') {
              // Profile doesn't exist, create one
              const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user'
              const { profile: newProfile } = await createProfile(
                user.id,
                username,
                user.user_metadata?.full_name
              )
              if (newProfile) {
                setProfile(newProfile)
              }
            }
          } else {
            console.log('No user in stored token')
            setSession(null)
            setUser(null)
          }
        } else {
          console.log('No stored token found')
          setSession(null)
          setUser(null)
        }
      } catch (error) {
        console.error('Error restoring auth state:', error)
        localStorage.removeItem('supabase.auth.token')
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    
    restoreAuthState()

    // Listen for custom auth events from our direct HTTP auth
    const handleCustomAuthChange = async (event: CustomEvent) => {
      console.log('Custom auth state change:', event.detail)
      const { user, session } = event.detail
      
      setSession(session)
      setUser(user)
      
      if (user) {
        // Try to get or create profile
        const { profile: existingProfile, error } = await getProfile(user.id)
        
        if (existingProfile) {
          setProfile(existingProfile)
        } else if (!error || error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const username = user.user_metadata?.username || user.email?.split('@')[0] || 'user'
          const { profile: newProfile } = await createProfile(
            user.id,
            username,
            user.user_metadata?.full_name
          )
          if (newProfile) {
            setProfile(newProfile)
          }
        }
      } else {
        setProfile(null)
      }
    }

    window.addEventListener('auth-state-change', handleCustomAuthChange as EventListener)

    // Also listen for regular Supabase auth changes (in case they start working)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (session?.user) {
          // Try to get existing profile
          const { profile: existingProfile, error } = await getProfile(session.user.id)
          
          if (existingProfile) {
            setProfile(existingProfile)
          } else if (!error || error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            const username = session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user'
            const { profile: newProfile } = await createProfile(
              session.user.id,
              username,
              session.user.user_metadata?.full_name
            )
            if (newProfile) {
              setProfile(newProfile)
            }
          }
        } else {
          setProfile(null)
        }
      }
    )

    // Cleanup
    return () => {
      subscription.unsubscribe()
      window.removeEventListener('auth-state-change', handleCustomAuthChange as EventListener)
    }
  }, [])

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}