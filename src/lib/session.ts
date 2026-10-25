import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";
import { clearRoleCookie, setRoleCookie } from "./session-cookie";

/** Single place that keeps the store + routing cookie in sync with the session. */
export function startSession(user: User) {
  useAuthStore.getState().setUser(user);
  setRoleCookie(user.role);
}

export function endSession() {
  useAuthStore.getState().clear();
  clearRoleCookie();
}
