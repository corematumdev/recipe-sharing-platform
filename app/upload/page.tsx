import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RecipeUploadForm from '@/components/recipe/RecipeUploadForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function UploadPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Share a New Recipe</h1>
            <p className="text-gray-600 mt-2">
              Share your culinary creation with the RecipeShare community!
            </p>
          </div>
          <RecipeUploadForm />
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}