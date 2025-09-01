import Link from "next/link";

const categories = [
  "Breakfast", "Lunch", "Dinner", "Desserts", 
  "Vegetarian", "Quick Meals", "Italian", "Mexican"
];

export default function CategoriesSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="text-3xl mb-3">🍽️</div>
              <h3 className="font-semibold text-gray-900">{category}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}