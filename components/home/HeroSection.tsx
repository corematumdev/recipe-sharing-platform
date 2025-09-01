import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover & Share
            <span className="text-orange-600 block">Amazing Recipes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of food lovers. Share your favorite recipes, discover new dishes, and connect with fellow cooking enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-orange-700 transition-colors"
            >
              Explore Recipes
            </Link>
            <Link
              href="/upload"
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-orange-50 transition-colors"
            >
              Share Your Recipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}