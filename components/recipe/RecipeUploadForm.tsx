'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createRecipe } from '@/lib/database'

interface Ingredient {
  id: string
  amount: string
  unit: string
  name: string
}

interface Instruction {
  id: string
  step: number
  description: string
}

interface RecipeFormData {
  title: string
  description: string
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  difficulty: 'easy' | 'medium' | 'hard' | ''
  cuisine: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert' | ''
  dietary_restrictions: string[]
  ingredients: Ingredient[]
  instructions: Instruction[]
  is_public: boolean
}

export default function RecipeUploadForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    prep_time: null,
    cook_time: null,
    servings: null,
    difficulty: '',
    cuisine: '',
    meal_type: '',
    dietary_restrictions: [],
    ingredients: [{ id: '1', amount: '', unit: '', name: '' }],
    instructions: [{ id: '1', step: 1, description: '' }],
    is_public: true
  })

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return 'Recipe title is required'
    }
    
    if (formData.ingredients.length === 0) {
      return 'At least one ingredient is required'
    }
    
    const hasEmptyIngredient = formData.ingredients.some(ing => !ing.name.trim())
    if (hasEmptyIngredient) {
      return 'All ingredients must have a name'
    }
    
    if (formData.instructions.length === 0) {
      return 'At least one instruction is required'
    }
    
    const hasEmptyInstruction = formData.instructions.some(inst => !inst.description.trim())
    if (hasEmptyInstruction) {
      return 'All instruction steps must have a description'
    }
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be signed in to create a recipe')
      return
    }
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Prepare recipe data for database
      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        prep_time: formData.prep_time,
        cook_time: formData.cook_time,
        servings: formData.servings,
        difficulty: formData.difficulty || null,
        cuisine: formData.cuisine.trim() || null,
        meal_type: formData.meal_type || null,
        dietary_restrictions: formData.dietary_restrictions,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        is_public: formData.is_public,
        user_id: user.id
      }
      
      console.log('Creating recipe with data:', recipeData)
      
      const { recipe, error } = await createRecipe(recipeData)
      
      if (error) {
        console.error('Recipe creation error:', error)
        setError(error.message || 'Failed to create recipe')
        return
      }
      
      if (recipe) {
        console.log('Recipe created successfully:', recipe.id)
        // Redirect to the created recipe or dashboard
        router.push('/dashboard')
      }
      
    } catch (err: any) {
      console.error('Recipe submission error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Basic Information Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recipe Details</h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your recipe title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell us about your recipe..."
              />
            </div>
          </div>
        </div>

        {/* Recipe Metadata Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recipe Info</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Prep Time */}
            <div>
              <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                id="prep_time"
                min="0"
                value={formData.prep_time || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, prep_time: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="15"
              />
            </div>

            {/* Cook Time */}
            <div>
              <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                id="cook_time"
                min="0"
                value={formData.cook_time || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, cook_time: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="30"
              />
            </div>

            {/* Servings */}
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                Servings
              </label>
              <input
                type="number"
                id="servings"
                min="1"
                value={formData.servings || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: e.target.value ? parseInt(e.target.value) : null }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="4"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Cuisine */}
            <div>
              <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine
              </label>
              <input
                type="text"
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Italian, Mexican, etc."
              />
            </div>

            {/* Meal Type */}
            <div>
              <label htmlFor="meal_type" className="block text-sm font-medium text-gray-700 mb-2">
                Meal Type
              </label>
              <select
                id="meal_type"
                value={formData.meal_type}
                onChange={(e) => setFormData(prev => ({ ...prev, meal_type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select meal type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dietary Restrictions
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Carb', 'Keto', 'Paleo'].map((restriction) => (
                <label key={restriction} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.dietary_restrictions.includes(restriction)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          dietary_restrictions: [...prev.dietary_restrictions, restriction]
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          dietary_restrictions: prev.dietary_restrictions.filter(r => r !== restriction)
                        }))
                      }
                    }}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{restriction}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Make this recipe public (others can see and search for it)
              </span>
            </label>
          </div>
        </div>

        {/* Ingredients Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Ingredients</h2>
          
          <div className="space-y-4">
            {formData.ingredients.map((ingredient, index) => (
              <div key={ingredient.id} className="flex items-center space-x-3">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Amount */}
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => {
                      const updatedIngredients = [...formData.ingredients]
                      updatedIngredients[index] = { ...ingredient, amount: e.target.value }
                      setFormData(prev => ({ ...prev, ingredients: updatedIngredients }))
                    }}
                    placeholder="1"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  
                  {/* Unit */}
                  <select
                    value={ingredient.unit}
                    onChange={(e) => {
                      const updatedIngredients = [...formData.ingredients]
                      updatedIngredients[index] = { ...ingredient, unit: e.target.value }
                      setFormData(prev => ({ ...prev, ingredients: updatedIngredients }))
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Unit</option>
                    <option value="cup">cup</option>
                    <option value="cups">cups</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="piece">piece</option>
                    <option value="pieces">pieces</option>
                    <option value="slice">slice</option>
                    <option value="slices">slices</option>
                    <option value="clove">clove</option>
                    <option value="cloves">cloves</option>
                  </select>
                  
                  {/* Ingredient Name */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => {
                        const updatedIngredients = [...formData.ingredients]
                        updatedIngredients[index] = { ...ingredient, name: e.target.value }
                        setFormData(prev => ({ ...prev, ingredients: updatedIngredients }))
                      }}
                      placeholder="Ingredient name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Remove Button */}
                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index)
                      setFormData(prev => ({ ...prev, ingredients: updatedIngredients }))
                    }}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Remove ingredient"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Add Ingredient Button */}
          <button
            type="button"
            onClick={() => {
              const newIngredient: Ingredient = {
                id: Date.now().toString(),
                amount: '',
                unit: '',
                name: ''
              }
              setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, newIngredient] }))
            }}
            className="mt-4 px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Instructions</h2>
          
          <div className="space-y-4">
            {formData.instructions.map((instruction, index) => (
              <div key={instruction.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {instruction.step}
                </div>
                
                <div className="flex-1">
                  <textarea
                    value={instruction.description}
                    onChange={(e) => {
                      const updatedInstructions = [...formData.instructions]
                      updatedInstructions[index] = { ...instruction, description: e.target.value }
                      setFormData(prev => ({ ...prev, instructions: updatedInstructions }))
                    }}
                    placeholder={`Step ${instruction.step} instructions...`}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                {/* Remove Button */}
                {formData.instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const updatedInstructions = formData.instructions
                        .filter((_, i) => i !== index)
                        .map((inst, i) => ({ ...inst, step: i + 1 }))
                      setFormData(prev => ({ ...prev, instructions: updatedInstructions }))
                    }}
                    className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Remove instruction"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {/* Add Instruction Button */}
          <button
            type="button"
            onClick={() => {
              const newInstruction: Instruction = {
                id: Date.now().toString(),
                step: formData.instructions.length + 1,
                description: ''
              }
              setFormData(prev => ({ ...prev, instructions: [...prev.instructions, newInstruction] }))
            }}
            className="mt-4 px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
          >
            + Add Step
          </button>
        </div>

        {/* Temporary Save Button for Testing */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !user}
            className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}