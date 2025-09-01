import { supabase } from './supabase'
import { AuthError, User } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  error: AuthError | null
}

// Sign up with email and password
export async function signUp(email: string, password: string, username: string, fullName?: string) {
  try {
    console.log('Attempting sign up with direct HTTP call...')
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        data: {
          username: username,
          full_name: fullName
        }
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    console.log('Sign up HTTP response:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.log('Sign up error:', errorData)
      return { 
        user: null, 
        error: { message: errorData.error_description || errorData.error || 'Sign up failed' } 
      }
    }

    const data = await response.json()
    console.log('Sign up successful:', !!data.user)

    const user = data.user || null
    
    // Manually trigger auth state change if user is confirmed
    if (user && user.email_confirmed_at && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-state-change', { 
        detail: { user, session: data } 
      }))
    }
    
    return { user, error: null }
    
  } catch (err: any) {
    console.error('Sign up exception:', err)
    return { user: null, error: { message: err.message || 'Network error during sign up' } }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    console.log('Attempting sign in with direct HTTP call...')
    
    // Use direct HTTP call since Supabase client auth methods are hanging
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    console.log('Sign in HTTP response:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.log('Sign in error:', errorData)
      return { 
        user: null, 
        error: { message: errorData.error_description || errorData.error || 'Login failed' } 
      }
    }

    const data = await response.json()
    console.log('Sign in successful:', !!data.access_token)

    // Store the session data in local storage (for persistence)
    if (data.access_token) {
      localStorage.setItem('supabase.auth.token', JSON.stringify(data))
    }

    // Create a user object from the response
    const user = data.user || null
    
    // Manually trigger auth state change since we bypassed the Supabase client
    if (user && typeof window !== 'undefined') {
      // Dispatch custom event to notify AuthContext
      window.dispatchEvent(new CustomEvent('auth-state-change', { 
        detail: { user, session: data } 
      }))
    }
    
    return { user, error: null }
    
  } catch (err: any) {
    console.error('Sign in exception:', err)
    return { user: null, error: { message: err.message || 'Network error during sign in' } }
  }
}

// Sign out
export async function signOut() {
  try {
    console.log('Signing out...')
    
    // Clear local storage
    localStorage.removeItem('supabase.auth.token')
    
    // Manually trigger auth state change to clear user state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth-state-change', { 
        detail: { user: null, session: null } 
      }))
    }
    
    console.log('Sign out successful')
    return { error: null }
  } catch (err: any) {
    console.error('Sign out error:', err)
    return { error: { message: 'Sign out failed' } }
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    // Check if we have a stored token first
    const storedToken = localStorage.getItem('supabase.auth.token')
    if (!storedToken) {
      return { user: null, error: null }
    }

    const tokenData = JSON.parse(storedToken)
    const accessToken = tokenData.access_token

    if (!accessToken) {
      return { user: null, error: null }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (!response.ok) {
      // Token might be expired, clear it
      localStorage.removeItem('supabase.auth.token')
      return { user: null, error: { message: 'Session expired' } }
    }

    const user = await response.json()
    return { user, error: null }
    
  } catch (err: any) {
    console.error('Get current user error:', err)
    return { user: null, error: { message: err.message || 'Failed to get current user' } }
  }
}

// Get current session
export async function getSession() {
  try {
    // Get session data from localStorage
    const storedToken = localStorage.getItem('supabase.auth.token')
    if (!storedToken) {
      return { session: null, error: null }
    }

    const sessionData = JSON.parse(storedToken)
    
    // Check if token is expired
    if (sessionData.expires_at && Date.now() / 1000 >= sessionData.expires_at) {
      localStorage.removeItem('supabase.auth.token')
      return { session: null, error: { message: 'Session expired' } }
    }

    return { session: sessionData, error: null }
    
  } catch (err: any) {
    console.error('Get session error:', err)
    return { session: null, error: { message: err.message || 'Failed to get session' } }
  }
}

// Listen to auth changes - deprecated, use custom events instead
// The Supabase auth state change listener can also hang, so we rely on custom events