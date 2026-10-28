import { jwtVerify, SignJWT } from "jose";
import type { UserRole } from "@/types";

export const SESSION_COOKIE = "fsm_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const VALID_ROLES: UserRole[] = ["ADMIN", "TECHNICIAN", "CUSTOMER"];

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production");
    }
    return new TextEncoder().encode(
      "dev-only-insecure-session-secret-change-me",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(userId: string, role: UserRole) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getKey());
}

export async function verifySession(token?: string): Promise<UserRole | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    const role = payload.role as UserRole;
    return VALID_ROLES.includes(role) ? role : null;
  } catch {
    return null;
  }
}
