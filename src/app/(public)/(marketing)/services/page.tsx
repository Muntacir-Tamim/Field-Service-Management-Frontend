import CallToAction from "@/components/modules/homepage/CallToAction";
import ServicesCatalog from "@/components/modules/homepage/ServicesCatalog";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Services",
  description: "Browse the field services our verified technicians cover.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="mb-12 max-w-2xl space-y-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Our services
          </h1>
          <p className="text-muted-foreground">
            Every service is handled by a technician whose skills have been
            reviewed and verified by our team.
          </p>
        </div>
        <ServicesCatalog />
      </section>
      <CallToAction />
    </>
  );
}
