import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CompanyIntro from "@/components/CompanyIntro";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import PartnerSlider from "@/components/PartnerSlider";
import ProductsSlider from "@/components/ProductsSlider";
import MemorialSecetion from "@/components/MemorialSection";


export default function HomePage() {
  return (
    <main className="bg-var[--title-bg] text-white">
      <Navbar />
      <HeroSlider />
      <PartnerSlider />
      <ProductsSlider />
      <MemorialSecetion />
      <CompanyIntro />

      <section className="max-w-7xl mx-auto py-12 px-4">
        <SectionHeader title="Categories" buttonText="View all products" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard title="Electroplating" imgSrc="/Assets/category1.png" />
          <CategoryCard title="Metals" imgSrc="/Assets/category1.png" />
          <CategoryCard title="Specialty Chemicals" imgSrc="/Assets/category1.png" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-12 px-4">
        <SectionHeader title="Our Products" buttonText="View all products" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </section>

      <Footer />
    </main>
  );
}
