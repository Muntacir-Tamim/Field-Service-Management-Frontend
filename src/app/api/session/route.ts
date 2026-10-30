import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  signSession,
} from "@/lib/session-token";
import type { User } from "@/types";

const API = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: Request) {
  const { accessToken } = (await request.json().catch(() => ({}))) as {
    accessToken?: string;
  };

  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json({ message: "Missing token" }, { status: 400 });
  }

  const res = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  }).catch(() => null);

  if (!res?.ok) {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  const user = (await res.json())?.data as User | undefined;
  if (!user?.role || !user.id) {
    return NextResponse.json({ message: "Invalid session" }, { status: 401 });
  }

  const response = NextResponse.json({ role: user.role });
  response.cookies.set(SESSION_COOKIE, await signSession(user.id, user.role), {
    ...cookieBase,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return response;
}
