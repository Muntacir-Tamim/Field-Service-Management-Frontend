"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center font-sans">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
