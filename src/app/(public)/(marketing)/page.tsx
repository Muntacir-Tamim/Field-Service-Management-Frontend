import CallToAction from "@/components/modules/homepage/CallToAction";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import ServicesPreview from "@/components/modules/homepage/ServicesPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <HowItWorks />
      <CallToAction />
    </>
  );
}
