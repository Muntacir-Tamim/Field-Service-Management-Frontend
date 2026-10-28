import { ofetch } from "ofetch";
import { createServerSession } from "./session";

const refreshClient = ofetch.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
});

let refreshPromise: Promise<boolean> | null = null;

export function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = refreshClient<{ data?: { accessToken?: string } }>(
      "/auth/refresh-token",
      { method: "POST" },
    )
      .then(async (res) => {
        if (res?.data?.accessToken) {
          await createServerSession(res.data.accessToken);
        }
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}
