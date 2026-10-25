"use client";

import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  homeHref?: string;
}

/** Shared UI for every `error.tsx` route boundary. */
export default function RouteError({
  error,
  reset,
  title = "Something went wrong",
  homeHref = "/",
}: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center"
    >
      <AlertTriangleIcon className="size-8 text-destructive" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        An unexpected error occurred. You can try again or go back.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" render={<Link href={homeHref} />}>
          Go back
        </Button>
      </div>
    </div>
  );
}
