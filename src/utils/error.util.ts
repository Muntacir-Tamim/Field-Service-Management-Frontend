import type { ApiErrorResponse } from "@/types";

const FALLBACK = "Something went wrong. Please try again";

export function getErrorMessage(err: unknown, fallback = FALLBACK): string {
  if (typeof err === "object" && err !== null) {
    const data = (err as { data?: Partial<ApiErrorResponse> }).data;

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
