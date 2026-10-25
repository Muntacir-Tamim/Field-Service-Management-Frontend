import type { UserRole } from "@/types";

/**
 * Lightweight, frontend-owned cookie that mirrors the signed-in user's role.
 *
 * The real auth tokens are httpOnly cookies set by the API (possibly on another
 * domain), so `proxy.ts` cannot read them. This cookie is a routing hint only:
 * it lets the proxy block/redirect before any dashboard HTML is sent.
 * The API still enforces real authorization on every request.
 */
export const ROLE_COOKIE = "fsm_role";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function setRoleCookie(role: UserRole) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ROLE_COOKIE}=${role}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
