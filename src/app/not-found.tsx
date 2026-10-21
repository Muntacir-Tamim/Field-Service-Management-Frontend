import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href="/" className={buttonVariants()}>
        Back to home
      </Link>
    </div>
  );
}
