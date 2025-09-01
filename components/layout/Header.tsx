'use client'

import Link from "next/link";
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, profile, loading, signOut } = useAuth();
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              RecipeShare
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-gray-700 hover:text-orange-600 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-600 transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              // Authenticated user menu
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  My Recipes
                </Link>
                <Link
                  href="/upload"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Upload Recipe
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    Hi, {profile?.username || user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              // Guest user menu
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}