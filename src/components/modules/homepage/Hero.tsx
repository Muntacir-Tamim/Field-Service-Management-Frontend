import {
  CalendarCheckIcon,
  CheckIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { WORK_ORDER_STEPS } from "@/constants";
import { cn } from "@/lib/utils";
import { display } from "./display-font";

const HIGHLIGHTS = [
  { icon: ShieldCheckIcon, text: "Verified technicians" },
  { icon: CalendarCheckIcon, text: "Live job tracking" },
  { icon: CreditCardIcon, text: "Secure bKash payment" },
];

// sample job টা "On the way" step এ আছে ধরা হয়েছে
const CURRENT_STEP = 1;

const STEP_HINTS: Record<string, string> = {
  SCHEDULED: "Visit time confirmed",
  TECHNICIAN_EN_ROUTE: "Heading to you",
  ARRIVED: "At your door",
  IN_PROGRESS: "Work under way",
  COMPLETED: "Service report ready",
  VERIFIED: "You confirm the work",
};

function JobTracker() {
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn(display.className, "text-lg font-bold")}>
            Follow every visit
          </p>
          <p className="text-sm text-muted-foreground">
            Example job: AC servicing. This is what you see after booking.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-green/15 px-3 py-1 text-sm font-medium text-brand-navy">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-brand-green opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-green" />
          </span>
          Technician on the way
        </span>
      </div>

      <ol className="mt-6 flex flex-col lg:flex-row">
        {WORK_ORDER_STEPS.map((step, index) => {
          const done = index < CURRENT_STEP;
          const current = index === CURRENT_STEP;
          const last = index === WORK_ORDER_STEPS.length - 1;
          return (
            <li
              key={step.status}
              aria-current={current ? "step" : undefined}
              className="relative flex gap-3 pb-6 last:pb-0 lg:flex-1 lg:flex-col lg:pb-0"
            >
              {last ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-[15px] top-9 h-[calc(100%-2.5rem)] w-0.5 lg:left-9 lg:top-[15px] lg:h-0.5 lg:w-[calc(100%-2.5rem)]",
                    done ? "bg-brand-green" : "bg-border",
                    done &&
                      "motion-safe:animate-[fsm-reveal-y_0.7s_ease-out_both] motion-safe:lg:animate-[fsm-reveal-x_0.7s_ease-out_both]",
                  )}
                  style={
                    done ? { animationDelay: `${index * 0.35}s` } : undefined
                  }
                />
              )}

              <span
                className={cn(
                  "relative flex size-8 shrink-0 items-center justify-center rounded-full border-2",
                  done && "border-brand-green bg-brand-green text-brand-navy",
                  current && "border-primary bg-background",
                  !done && !current && "border-border bg-background",
                )}
              >
                {done ? (
                  <CheckIcon
                    className="size-4"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                ) : null}
                {current ? (
                  <>
                    <span className="absolute inset-0 rounded-full bg-primary/30 motion-safe:animate-ping" />
                    <span className="relative size-2.5 rounded-full bg-primary" />
                  </>
                ) : null}
              </span>

              <div className="min-w-0 pr-2">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    !done && !current && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {STEP_HINTS[step.status]}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="border-b bg-primary/5">
      <div className="mx-auto w-full max-w-6xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div className="space-y-7">
            <h1
              className={cn(
                display.className,
                "text-4xl leading-[1.08] font-extrabold tracking-tight text-brand-navy sm:text-5xl lg:text-[3.4rem]",
              )}
            >
              <span className="block">Book a technician.</span>
              <span className="block">Track the job.</span>
              <span className="block">Pay when it is done.</span>
            </h1>
            <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
              Send a service request in minutes, get matched with a verified
              technician and follow every step from the visit to the final
              invoice.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 px-6 text-base",
                )}
              >
                Request a service
              </Link>
              <Link
                href="/apply"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-6 text-base",
                )}
              >
                Become a technician
              </Link>
            </div>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-2">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* illustration এর উপরের লেখা বাদ দিতে নিচের অংশ crop করা হয়েছে */}
          <div className="relative aspect-[1099/700] overflow-hidden rounded-3xl border bg-background shadow-sm">
            <Image
              src="/fsm.jpg"
              alt="An FSM technician checking a new job on his phone outside a customer's home, with the company van parked behind him"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-bottom"
            />
          </div>
        </div>

        <div className="mt-10 sm:mt-14">
          <JobTracker />
        </div>
      </div>
    </section>
  );
}
