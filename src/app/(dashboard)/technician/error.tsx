"use client";

import RouteError from "@/components/common/route-error";

export default function RouteErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Technician panel error"
      homeHref="/technician"
    />
  );
}
