import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SearchSection from "@/components/home/SearchSection";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import CategoriesSection from "@/components/home/CategoriesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SearchSection />
      <FeaturedRecipes />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
