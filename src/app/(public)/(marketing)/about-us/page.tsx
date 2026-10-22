import {
  ClipboardCheckIcon,
  HandshakeIcon,
  ShieldCheckIcon,
} from "lucide-react";
import type { Metadata } from "next";
import CallToAction from "@/components/modules/homepage/CallToAction";
import { SITE } from "@/constants";

export const metadata: Metadata = {
  title: "About us | FSM",
  description: "Why we built a simpler way to book and track field service.",
};

const VALUES = [
  {
    icon: ShieldCheckIcon,
    title: "Verified people",
    text: "Every technician applies with their experience and documents, and is reviewed by our team before taking any job.",
  },
  {
    icon: ClipboardCheckIcon,
    title: "Nothing is hidden",
    text: "Status updates, service reports, parts used and invoices are all visible to you in one place.",
  },
  {
    icon: HandshakeIcon,
    title: "Fair for both sides",
    text: "Customers get honest pricing and secure payment. Technicians get clear jobs and are rated on their real work.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="space-y-4">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            About {SITE.fullName}
          </h1>
          <p className="text-lg text-muted-foreground">
            Getting a repair or installation done should not mean chasing phone
            calls and guessing when someone will turn up. We built {SITE.name}{" "}
            to connect customers with skilled technicians and keep everyone
            informed from the first request to the final payment.
          </p>
          <p className="text-muted-foreground">
            You describe the problem. Our team reviews it and assigns the right
            technician. You follow the visit as it happens, pay online and share
            feedback so the quality keeps improving.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="space-y-3 rounded-xl border bg-card p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-heading font-medium">{title}</h2>
              <p className="text-sm text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
      <CallToAction />
    </>
  );
}
