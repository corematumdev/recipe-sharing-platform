export default function SearchSection() {
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Next Favorite Recipe
          </h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for recipes, ingredients, or cuisines..."
            className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors">
            Search
          </button>
        </div>
      </div>
    </section>
  );
}