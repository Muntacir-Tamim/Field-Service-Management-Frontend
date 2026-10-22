import { ofetch } from "ofetch";

const refreshClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

export function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshClient("/auth/refresh-token", { method: "POST" })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
