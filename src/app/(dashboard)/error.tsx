"use client";

// this is dashboard error boundary
export default function DashboardError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <button onClick={reset}>this is dashboard error</button>;
}
