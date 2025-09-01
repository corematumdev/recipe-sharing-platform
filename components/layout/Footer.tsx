import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RecipeShare</h3>
            <p className="text-gray-400">
              A community-driven platform for food lovers to discover and share amazing recipes.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/browse" className="hover:text-white">Browse Recipes</Link></li>
              <li><Link href="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link href="/trending" className="hover:text-white">Trending</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/upload" className="hover:text-white">Share Recipe</Link></li>
              <li><Link href="/chefs" className="hover:text-white">Top Chefs</Link></li>
              <li><Link href="/collections" className="hover:text-white">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RecipeShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}