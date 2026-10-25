import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { display } from "./display-font";

export default function CallToAction() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-10">
          <div className="space-y-3">
            <h2
              className={cn(
                display.className,
                "text-2xl font-bold tracking-tight sm:text-3xl",
              )}
            >
              Ready to get your problem fixed?
            </h2>
            <p className="max-w-md text-primary-foreground/85">
              Create a free account and send your first service request today.
            </p>
          </div>
          <Link
            href="/register"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-white px-6 text-base text-primary hover:bg-white/90",
            )}
          >
            Create an account
          </Link>
        </div>

        <div className="flex flex-col items-start gap-6 rounded-3xl bg-brand-navy p-8 text-white sm:p-10">
          <div className="space-y-3">
            <h2
              className={cn(
                display.className,
                "text-2xl font-bold tracking-tight sm:text-3xl",
              )}
            >
              Have a trade? Work with us.
            </h2>
            <p className="max-w-md text-white/80">
              Apply with your experience and documents. Our team reviews every
              application before you take your first job.
            </p>
          </div>
          <Link
            href="/apply"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 bg-brand-green px-6 text-base text-brand-navy hover:bg-brand-green/90",
            )}
          >
            Become a technician
          </Link>
        </div>
      </div>
    </section>
  );
}
