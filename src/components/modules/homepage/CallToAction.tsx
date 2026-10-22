import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to get your problem fixed?
        </h2>
        <p className="max-w-xl text-sm text-primary-foreground/80 sm:text-base">
          Create a free account and send your first service request today.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/register"
            className={cn(
              buttonVariants({ variant: "secondary", size: "lg" }),
              "h-10 px-5",
            )}
          >
            Create an account
          </Link>
          <Link
            href="/apply"
            className="inline-flex h-10 items-center rounded-lg px-5 text-sm font-medium text-primary-foreground underline-offset-4 hover:underline"
          >
            Or become a technician
          </Link>
        </div>
      </div>
    </section>
  );
}
