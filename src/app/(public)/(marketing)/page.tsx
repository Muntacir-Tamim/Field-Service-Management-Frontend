import CallToAction from "@/components/modules/homepage/CallToAction";
import Hero from "@/components/modules/homepage/Hero";
import HowItWorks from "@/components/modules/homepage/HowItWorks";
import ServicesPreview from "@/components/modules/homepage/ServicesPreview";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Home",
  description:
    "Book trusted technicians, track every job and pay securely with bKash.",
  path: "/",
});

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
