import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import ContactForm from "@/components/modules/homepage/ContactForm";
import { SITE } from "@/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact us",
  description: "Questions about a service or an account? Get in touch.",
  path: "/contact-us",
});

const DETAILS = [
  {
    icon: MailIcon,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: PhoneIcon,
    label: "Phone",
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/[^+\d]/g, "")}`,
  },
  { icon: MapPinIcon, label: "Address", value: SITE.address },
  { icon: ClockIcon, label: "Support hours", value: SITE.hours },
];

export default function ContactPage() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-8">
        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Contact us
          </h1>
          <p className="text-muted-foreground">
            Have a question about a service, your account or becoming a
            technician? Write to us and we will get back to you.
          </p>
        </div>

        <ul className="space-y-5">
          {DETAILS.map(({ icon: Icon, label, value, ...rest }) => (
            <li key={label} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                </p>
                {"href" in rest ? (
                  <a href={rest.href} className="text-sm hover:underline">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <ContactForm />
      </div>
    </section>
  );
}
