'use client'

import { useEffect, useState } from 'react'

export default function TestNetwork() {
  const [results, setResults] = useState<string[]>([])

  const addResult = (message: string) => {
    console.log(message)
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    async function testNetwork() {
      addResult('Starting network connectivity tests...')
      
      // Test 1: Direct HTTP request to Supabase
      try {
        addResult('Testing direct HTTP connection to Supabase...')
        const response = await fetch('https://hqduvpsqbgeorbpwtuit.supabase.co/rest/v1/', {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        addResult(`HTTP Response: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          addResult('✅ Direct HTTP connection successful!')
        } else {
          addResult(`❌ HTTP Error: ${response.status}`)
        }
      } catch (error: any) {
        addResult(`❌ HTTP Connection failed: ${error.message}`)
      }

      // Test 2: Test auth endpoint specifically
      try {
        addResult('Testing Supabase Auth endpoint...')
        const response = await fetch('https://hqduvpsqbgeorbpwtuit.supabase.co/auth/v1/settings', {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        })
        
        addResult(`Auth endpoint: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          const data = await response.text()
          addResult(`✅ Auth endpoint accessible! Response: ${data.substring(0, 100)}...`)
        }
      } catch (error: any) {
        addResult(`❌ Auth endpoint failed: ${error.message}`)
      }

      // Test 3: Test database endpoint
      try {
        addResult('Testing database query endpoint...')
        const response = await fetch('https://hqduvpsqbgeorbpwtuit.supabase.co/rest/v1/profiles?select=count&limit=0', {
          method: 'GET',
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          },
          signal: AbortSignal.timeout(5000)
        })
        
        addResult(`Database query: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          addResult(`✅ Database query successful!`)
        } else {
          const errorText = await response.text()
          addResult(`❌ Database error: ${errorText}`)
        }
      } catch (error: any) {
        addResult(`❌ Database query failed: ${error.message}`)
      }

      addResult('Network tests completed.')
    }

    testNetwork()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Network Connectivity Test</h1>
          
          <div className="space-y-2">
            {results.map((result, index) => (
              <div key={index} className="font-mono text-sm p-2 bg-gray-100 rounded">
                {result}
              </div>
            ))}
          </div>
          
          {results.length === 0 && (
            <div className="text-center text-gray-500">Running tests...</div>
          )}
        </div>
      </div>
    </div>
  )
}