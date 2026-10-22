import { HOW_IT_WORKS } from "@/constants";

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="text-muted-foreground">
          From the first request to the final review, every step is tracked.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS.map((step, index) => (
          <li
            key={step.title}
            className="relative space-y-3 rounded-xl border bg-card p-5"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <h3 className="font-heading font-medium">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
