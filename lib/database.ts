import { supabase, Profile, Recipe } from './supabase'

// Helper to get access token from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  
  try {
    const storedToken = localStorage.getItem('supabase.auth.token')
    if (!storedToken) return null
    
    const tokenData = JSON.parse(storedToken)
    return tokenData.access_token || null
  } catch {
    return null
  }
}

// HTTP-based recipe creation as backup for hanging Supabase client
async function createRecipeHttp(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const accessToken = getAccessToken()
    if (!accessToken) {
      return { recipe: null, error: { message: 'No access token available' } }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/recipes?select=*,profile:profiles(*)`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(recipe),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP recipe creation error:', errorData)
      return { recipe: null, error: { message: errorData } }
    }

    const data = await response.json()
    return { recipe: Array.isArray(data) ? data[0] : data, error: null }
  } catch (err: any) {
    console.error('HTTP recipe creation exception:', err)
    return { recipe: null, error: { message: err.message } }
  }
}

// Profile operations with HTTP fallback
export async function createProfile(userId: string, username: string, fullName?: string) {
  console.log('Creating profile with HTTP method (bypassing hanging Supabase client)...')
  
  try {
    const accessToken = getAccessToken()
    if (!accessToken) {
      return { profile: null, error: { message: 'No access token available' } }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?select=*`, {
      method: 'POST',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: userId,
        username,
        full_name: fullName
      }),
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP profile creation error:', errorData)
      return { profile: null, error: { message: errorData } }
    }

    const data = await response.json()
    return { profile: Array.isArray(data) ? data[0] : data, error: null }
  } catch (err: any) {
    console.error('HTTP profile creation exception:', err)
    return { profile: null, error: { message: err.message } }
  }
}

export async function getProfile(userId: string) {
  console.log('Getting profile with HTTP method (bypassing hanging Supabase client)...')
  
  try {
    const accessToken = getAccessToken()
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP profile get error:', errorData)
      return { profile: null, error: { message: errorData, code: response.status === 404 ? 'PGRST116' : undefined } }
    }

    const data = await response.json()
    return { profile: data[0] || null, error: null }
  } catch (err: any) {
    console.error('HTTP profile get exception:', err)
    return { profile: null, error: { message: err.message } }
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { profile: data, error }
}

// Recipe operations
export async function createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>) {
  console.log('Creating recipe with HTTP method (bypassing hanging Supabase client)...')
  
  // Skip Supabase client entirely since it's hanging, use HTTP directly
  return await createRecipeHttp(recipe)
}

export async function getRecipe(recipeId: string) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('id', recipeId)
    .single()
  
  return { recipe: data, error }
}

export async function getRecipes(limit = 10, offset = 0) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  
  return { recipes: data, error }
}

export async function getUserRecipes(userId: string) {
  console.log('Getting user recipes with HTTP method (bypassing hanging Supabase client)...')
  
  try {
    const accessToken = getAccessToken()
    if (!accessToken) {
      return { recipes: null, error: { message: 'No access token available' } }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/recipes?user_id=eq.${userId}&select=*,profile:profiles(*)&order=created_at.desc`,
      {
        method: 'GET',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(10000)
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error('HTTP getUserRecipes error:', errorData)
      return { recipes: null, error: { message: errorData } }
    }

    const data = await response.json()
    console.log('Successfully fetched user recipes:', data.length, 'recipes')
    return { recipes: data, error: null }
  } catch (err: any) {
    console.error('HTTP getUserRecipes exception:', err)
    return { recipes: null, error: { message: err.message } }
  }
}

export async function updateRecipe(recipeId: string, updates: Partial<Recipe>) {
  const { data, error } = await supabase
    .from('recipes')
    .update(updates)
    .eq('id', recipeId)
    .select(`
      *,
      profile:profiles(*)
    `)
    .single()
  
  return { recipe: data, error }
}

export async function deleteRecipe(recipeId: string) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', recipeId)
  
  return { error }
}

export async function searchRecipes(query: string, limit = 10) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('is_public', true)
    .textSearch('title', query)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  return { recipes: data, error }
}