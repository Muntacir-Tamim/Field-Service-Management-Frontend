import {
  BellIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardListIcon,
    title: "Request in minutes",
    description:
      "Describe the problem, attach up to 5 photos or PDFs and pick a date that suits you. No calls, no waiting on hold.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Technicians you can trust",
    description:
      "Every technician applies with their skills, verifies their email and is reviewed by our team before they take a job.",
  },
  {
    icon: MapPinIcon,
    title: "Live job tracking",
    description:
      "See when your technician is on the way, has arrived and has finished. You always know what is happening.",
  },
  {
    icon: FileTextIcon,
    title: "A report for every job",
    description:
      "When the work is done you get a service report of what was fixed, saved next to your invoice for later.",
  },
  {
    icon: CreditCardIcon,
    title: "Pay with bKash",
    description:
      "Pay the invoice online after the job. Your payment history stays in your account.",
  },
  {
    icon: BellIcon,
    title: "Updates and reviews",
    description:
      "Get a notification at every step, then rate the job so good technicians are easy to spot.",
  },
] as const;

export default function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Everything about the job, in one place
          </h2>
          <p className="max-w-md text-muted-foreground">
            Finding someone reliable, knowing when they will arrive, paying
            fairly: FSM takes care of the parts that usually cause the
            headaches.
          </p>
        </div>

        <ul className="divide-y border-y">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex gap-5 py-6 first:pt-6">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <h3 className="font-heading text-lg font-medium">{title}</h3>
                <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
