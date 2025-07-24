import Navbar from "@/components/Navbar";
import PromoPopup from "@/components/PromoPopup";
import HeroSection from "@/components/HeroSection";
import CountdownPromotion from "@/components/CountdownPromotion";
import WeddingProcessTimeline from "@/components/WeddingProcessTimeline";
import WhyChooseUs from "@/components/WhyChooseUs";
import GallerySection from "@/components/GallerySection";
import ServicePackages from "@/components/ServicePackages";
import DynamicServicePackages from "@/components/DynamicServicePackages";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactFormSection from "@/components/ContactFormSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <PromoPopup />
      <HeroSection />
      <CountdownPromotion />
      <WeddingProcessTimeline />
      <WhyChooseUs />
      <GallerySection />
      <DynamicServicePackages />
      <TestimonialsSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
}
