import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import PartnerSlider from "@/components/PartnerSlider";
import ProductsSlider from "@/components/ProductsSlider";
import MemorialSection from "@/components/MemorialSection";


export default function HomePage() {
  return (
    <main className="bg-gradient-to-r from-[#16463B] via-[#317A45] to-[#4CAF50] text-white">
      <Navbar />
      <HeroSlider />
      {/* <PartnerSlider /> */}
      <ProductsSlider />
      <MemorialSection />
      <Footer />
    </main>
  );
}
