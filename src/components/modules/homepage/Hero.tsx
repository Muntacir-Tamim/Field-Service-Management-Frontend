import {
  CalendarCheckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HIGHLIGHTS = [
  { icon: ShieldCheckIcon, text: "Verified technicians" },
  { icon: CalendarCheckIcon, text: "Live job tracking" },
  { icon: CreditCardIcon, text: "Secure bKash payment" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          Field service, made simple
        </span>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Book a technician. Track the job. Pay when it is done.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground text-balance sm:text-lg">
          Send a service request in minutes, get matched with a verified
          technician and follow every step from the visit to the final invoice.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
          >
            Request a service
          </Link>
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 px-5",
            )}
          >
            Become a technician
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="inline-flex items-center gap-2">
              <Icon className="size-4 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
