import { AccordionComponent } from "@/components/homepage/accordion-component";
import HeroSection from "@/components/homepage/hero-section";
import Features from "@/components/homepage/marketing-cards";
import Pricing from "@/components/homepage/pricing";
import SideBySide from "@/components/homepage/side-by-side";
import HowItWorks from "@/components/homepage/how-it-works";
import TestimonialCarousel from "@/components/homepage/testimonial-carousel";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center w-full mt-[1rem] p-3">
        <HeroSection />
      </div>
      <SideBySide />
      <Features />
      <HowItWorks />
      <TestimonialCarousel />
      <Pricing />
      <AccordionComponent />
    </PageWrapper>
  );
}
