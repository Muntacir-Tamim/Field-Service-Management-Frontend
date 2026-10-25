import { HOW_IT_WORKS } from "@/constants";
import { cn } from "@/lib/utils";
import { display } from "./display-font";

// প্রতিটা step কে করছে, HOW_IT_WORKS এর order এর সাথে মিলিয়ে
const ACTORS = ["You", "Our team", "Technician", "You"];

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
        <div className="space-y-3 lg:sticky lg:top-28 lg:self-start">
          <h2
            className={cn(
              display.className,
              "text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl",
            )}
          >
            How it works
          </h2>
          <p className="max-w-sm text-muted-foreground">
            From the first request to the final review, every step is tracked.
          </p>
        </div>

        <ol className="border-t">
          {HOW_IT_WORKS.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-1 border-b py-7 sm:grid-cols-[4.5rem_1fr_auto] sm:items-baseline"
            >
              <span
                className={cn(
                  display.className,
                  "row-span-2 text-4xl font-bold text-primary sm:row-span-1 sm:text-5xl",
                )}
              >
                {index + 1}
              </span>
              <h3 className="text-lg font-semibold sm:col-start-2">
                {step.title}
              </h3>
              <span className="col-start-2 text-sm font-medium text-muted-foreground sm:col-start-3 sm:row-start-1">
                {ACTORS[index]}
              </span>
              <p className="col-start-2 max-w-xl text-muted-foreground sm:col-span-2">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
