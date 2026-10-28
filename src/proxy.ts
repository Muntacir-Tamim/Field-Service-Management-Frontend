import { type NextRequest, NextResponse } from "next/server";
import { getDashboardPath } from "@/lib/auth-redirect";
import { SESSION_COOKIE, verifySession } from "@/lib/session-token";
import type { UserRole } from "@/types";

/**
 * Route protection (Next.js 16 `proxy`, formerly `middleware`).
 * Each dashboard area is only reachable by its own role.
 */
const PROTECTED_AREAS: { prefix: string; role: UserRole }[] = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/technician", role: "TECHNICIAN" },
  { prefix: "/dashboard", role: "CUSTOMER" },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const area = PROTECTED_AREAS.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!area) {
    return NextResponse.next();
  }

  // Signed + httpOnly cookie issued by /api/session: cannot be forged client-side
  const cookieRole = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  // Not signed in (or tampered/expired cookie) -> login
  if (!cookieRole) {
    return NextResponse.redirect(new URL("/login?reauth=1", request.url));
  }

  // Signed in with the wrong role -> send them to their own dashboard
  if (cookieRole !== area.role) {
    return NextResponse.redirect(
      new URL(getDashboardPath(cookieRole), request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/technician/:path*", "/dashboard/:path*"],
};
