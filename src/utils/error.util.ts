import type { ApiErrorResponse } from "@/types";

const FALLBACK = "Something went wrong. Please try again";

// ofetch এর FetchError এ backend এর body থাকে err.data তে
export function getErrorMessage(err: unknown, fallback = FALLBACK): string {
  if (typeof err === "object" && err !== null) {
    const data = (err as { data?: Partial<ApiErrorResponse> }).data;

    // Zod validation error হলে প্রথম field message টা দেখাই
    const first = data?.errors?.[0]?.message;
    if (data?.message === "Validation failed" && first) {
      return first;
    }
    if (data?.message) {
      return data.message;
    }
    if (err instanceof Error && err.message) {
      return err.message;
    }
  }
  return fallback;
}
