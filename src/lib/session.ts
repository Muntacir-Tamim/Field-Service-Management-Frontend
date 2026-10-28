import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

/** Keep the Zustand store in sync with the signed-in user. */
export function startSession(user: User) {
  useAuthStore.getState().setUser(user);
}

export async function createServerSession(accessToken: string) {
  await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
    credentials: "same-origin",
  });
}

export async function endSession() {
  useAuthStore.getState().clear();
  try {
    await fetch("/api/session", {
      method: "DELETE",
      credentials: "same-origin",
    });
  } catch {}
}
