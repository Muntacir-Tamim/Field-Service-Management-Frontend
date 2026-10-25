"use client";

import { CheckIcon, PhoneIcon, WrenchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Request received", detail: "Today, 9:12 AM" },
  { label: "Technician assigned", detail: "Rahim A. accepted the job" },
  { label: "On the way", detail: "Arriving in about 15 minutes" },
  { label: "Work in progress", detail: "You will see it here" },
  { label: "Completed and paid", detail: "Report and invoice are saved" },
] as const;

// card এখানে এসে থামে: technician রওনা দিয়েছে
const FINAL_STEP = 2;

// hero র একমাত্র animation: page load এ status দুই ধাপ এগোয়, তারপর থামে
export default function JobTracker() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(FINAL_STEP);
      return;
    }
    const timers = [1, 2].map((step) =>
      setTimeout(() => setActive(step), 900 + step * 1100),
    );
    return () => {
      for (const timer of timers) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div className="rounded-3xl border bg-muted/40 p-3 sm:p-4">
      <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Service request</p>
            <h3 className="font-heading text-lg font-semibold tracking-tight">
              Kitchen sink is leaking
            </h3>
          </div>
          <span
            aria-live="polite"
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors duration-500",
              active >= FINAL_STEP
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-primary/10 text-primary",
            )}
          >
            {STEPS[active].label}
          </span>
        </div>

        <ol className="mt-6 space-y-0">
          {STEPS.map((step, index) => {
            const done = index < active;
            const current = index === active;
            const isLast = index === STEPS.length - 1;
            return (
              <li
                key={step.label}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {isLast ? null : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 left-[11px] h-[calc(100%-1.5rem)] w-0.5 transition-colors duration-500",
                      done ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 bg-card transition-colors duration-500",
                    done && "border-primary bg-primary text-primary-foreground",
                    current && "border-primary",
                    !(done || current) && "border-border",
                  )}
                >
                  {done ? (
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  ) : null}
                  {current ? (
                    <>
                      <span className="size-2 rounded-full bg-primary" />
                      <span className="absolute inset-0 rounded-full border-2 border-primary motion-safe:animate-ping" />
                    </>
                  ) : null}
                </span>
                <div
                  className={cn(
                    "min-w-0 transition-opacity duration-500",
                    done || current ? "opacity-100" : "opacity-45",
                  )}
                >
                  <p className="text-sm leading-6 font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          className={cn(
            "mt-6 flex items-center gap-3 rounded-xl border bg-muted/50 p-3 transition-opacity duration-500",
            active >= 1 ? "opacity-100" : "opacity-40",
          )}
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            RA
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Rahim A.</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <WrenchIcon className="size-3" aria-hidden="true" />
              Plumbing, verified technician
            </p>
          </div>
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full border bg-background text-muted-foreground"
          >
            <PhoneIcon className="size-4" />
          </span>
        </div>
      </div>
      <p className="px-2 pt-3 text-center text-xs text-muted-foreground">
        Example job. Your own requests update like this in real time.
      </p>
    </div>
  );
}
