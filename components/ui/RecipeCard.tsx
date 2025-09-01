import Link from "next/link";

interface Recipe {
  id: number;
  title: string;
  author: string;
  cookTime: string;
  rating: number;
  image: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-sm">
          ⭐ {recipe.rating}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {recipe.title}
        </h3>
        <p className="text-gray-600 mb-2">by {recipe.author}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">🕒 {recipe.cookTime}</span>
          <Link
            href={`/recipe/${recipe.id}`}
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            View Recipe →
          </Link>
        </div>
      </div>
    </div>
  );
}