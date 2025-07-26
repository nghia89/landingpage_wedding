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
import { fetchPublicSettingsServer } from "@/lib/settings";
import { PublicSettings } from "@/types/settings";

export default async function Home() {
  // Fetch settings on server side
  const settings: PublicSettings | null = await fetchPublicSettingsServer();

  return (
    <main>
      <Navbar settings={settings} />
      <PromoPopup />
      <HeroSection settings={settings} />
      <CountdownPromotion />
      <WeddingProcessTimeline />
      <WhyChooseUs />
      <DynamicServicePackages />
      <GallerySection />
      <TestimonialsSection />
      <ContactFormSection settings={settings} />
      <Footer settings={settings} />
    </main>
  );
}
