import { create } from "zustand";
import type { User, UserRole } from "@/types";

interface AuthState {
  user: User | null;
  role: UserRole | null;
  setUser: (user: User) => void;
  clear: () => void;
}

/** Global client auth state (Zustand). Server data stays in TanStack Query. */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user, role: user.role }),
  clear: () => set({ user: null, role: null }),
}));
