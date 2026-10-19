import { ofetch } from "ofetch";

// apiClient কে import করা যাবে না (circular হবে), তাই আলাদা plain client
const refreshClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

/**
 * 401 পেলে /auth/refresh-token call করে নতুন cookie নেয়।
 * একসাথে অনেক request 401 পেলেও refresh call হবে একবারই।
 * সফল হলে true, ব্যর্থ হলে false।
 */
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
