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
      <Footer />
    </main>
  );
}
