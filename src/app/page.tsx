import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientOnlyPromoPopup from "@/components/ClientOnlyPromoPopup";
import { fetchPublicSettingsServer } from "@/lib/settings";
import { PublicSettings } from "@/types/settings";

// Dynamic imports cho các component không critical
const CountdownPromotion = dynamic(() => import("@/components/CountdownPromotion"), {
  loading: () => <div className="h-24 bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse" />
});

const WeddingProcessTimeline = dynamic(() => import("@/components/WeddingProcessTimeline"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />
});

const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const DynamicServicePackages = dynamic(() => import("@/components/DynamicServicePackages"), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const GallerySection = dynamic(() => import("@/components/GallerySection"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse" />
});

const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  loading: () => <div className="h-96 bg-gray-50 animate-pulse" />
});

const ContactFormSection = dynamic(() => import("@/components/ContactFormSection"), {
  loading: () => <div className="h-96 bg-white animate-pulse" />
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-64 bg-gray-900 animate-pulse" />
});

export default async function Home() {
  // Fetch settings on server side
  const settings: PublicSettings | null = await fetchPublicSettingsServer();

  return (
    <main>
      <Navbar settings={settings} />
      <HeroSection settings={settings} />

      <Suspense fallback={<div className="h-24 bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse" />}>
        <ClientOnlyPromoPopup />
      </Suspense>

      <Suspense fallback={<div className="h-24 bg-gradient-to-r from-rose-500 to-pink-500 animate-pulse" />}>
        <CountdownPromotion />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <WeddingProcessTimeline />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <DynamicServicePackages />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <GallerySection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-white animate-pulse" />}>
        <ContactFormSection settings={settings} />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-gray-900 animate-pulse" />}>
        <Footer settings={settings} />
      </Suspense>
    </main>
  );
}
