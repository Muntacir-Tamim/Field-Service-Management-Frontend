import { type FetchOptions, ofetch } from "ofetch";
import { refreshAccessToken } from "./refresh-token";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const rawClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
});

// এই endpoint গুলোতে 401 মানে ভুল credential/OTP; refresh করার মানে নেই
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
  "/auth/google",
  "/auth/refresh-token",
  "/auth/logout",
  "/auth/forgot-password",
  "/auth/reset-password",
];

function shouldRefresh(err: unknown, url: string) {
  const status = (err as { status?: number; statusCode?: number })?.status;
  return status === 401 && !NO_REFRESH_PATHS.some((p) => url.startsWith(p));
}

async function apiClient<T = unknown>(
  url: string,
  options?: FetchOptions<"json">,
): Promise<T> {
  try {
    return await rawClient<T>(url, options);
  } catch (err) {
    if (shouldRefresh(err, url) && (await refreshAccessToken())) {
      // refresh সফল হলে original request টা একবার retry
      return rawClient<T>(url, options);
    }
    throw err;
  }
}

export default apiClient;
