import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import GallerySection from "@/components/GallerySection";
import ServicePackages from "@/components/ServicePackages";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactFormSection from "@/components/ContactFormSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhyChooseUs />
      <GallerySection />
      <ServicePackages />
      <TestimonialsSection />
      <ContactFormSection />
      <Footer />
    </main>
  );
}
