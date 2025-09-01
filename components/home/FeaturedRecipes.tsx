import RecipeCard from "@/components/ui/RecipeCard";

const featuredRecipes = [
  {
    id: 1,
    title: "Classic Chocolate Chip Cookies",
    author: "Sarah Johnson",
    cookTime: "25 min",
    rating: 4.8,
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Mediterranean Pasta Salad",
    author: "Marco Italiano",
    cookTime: "15 min",
    rating: 4.6,
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Homemade Sourdough Bread",
    author: "Emily Baker",
    cookTime: "4 hours",
    rating: 4.9,
    image: "/api/placeholder/300/200"
  }
];

export default function FeaturedRecipes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Recipes
          </h2>
          <p className="text-gray-600">
            Handpicked recipes from our amazing community
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}