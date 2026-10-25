import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CUSTOMER_POINTS = [
  "Free to join, you only pay for the job",
  "Follow your technician from assignment to completion",
  "Cancel any time while the request is pending or under review",
  "Invoices, reports and reviews stay in your account",
];

const TECHNICIAN_POINTS = [
  "Apply with the skills you actually have",
  "Get jobs that match your skills, assigned by our team",
  "Update each job from your phone as you go",
  "Build a record of customer reviews",
];

function Points({ items, inverted }: { items: string[]; inverted?: boolean }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed">
          <CheckIcon
            className={cn(
              "mt-0.5 size-4 shrink-0",
              inverted ? "text-emerald-300" : "text-emerald-600",
            )}
            aria-hidden="true"
          />
          <span className={inverted ? "text-primary-foreground/90" : undefined}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function AudienceSplit() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl space-y-3">
        <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Made for both sides of the job
        </h2>
        <p className="text-muted-foreground">
          Whether you need something fixed or you are the one fixing it, FSM
          keeps the work organised.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between gap-8 rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10">
          <div className="space-y-6">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">
              Need something fixed?
            </h3>
            <Points items={CUSTOMER_POINTS} inverted />
          </div>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-11 w-fit px-6 text-sm",
            )}
          >
            Create a free account
          </Link>
        </div>

        <div className="flex flex-col justify-between gap-8 rounded-3xl border p-7 sm:p-10">
          <div className="space-y-6">
            <h3 className="font-heading text-2xl font-semibold tracking-tight">
              Do this work for a living?
            </h3>
            <Points items={TECHNICIAN_POINTS} />
          </div>
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-fit px-6 text-sm",
            )}
          >
            Apply as a technician
          </Link>
        </div>
      </div>
    </section>
  );
}
