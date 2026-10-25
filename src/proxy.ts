import { type NextRequest, NextResponse } from "next/server";
import { getDashboardPath } from "@/lib/auth-redirect";
import { ROLE_COOKIE } from "@/lib/session-cookie";
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

const VALID_ROLES: UserRole[] = ["ADMIN", "TECHNICIAN", "CUSTOMER"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const area = PROTECTED_AREAS.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!area) {
    return NextResponse.next();
  }

  const cookieRole = request.cookies.get(ROLE_COOKIE)?.value as
    | UserRole
    | undefined;

  // Not signed in -> login
  if (!cookieRole || !VALID_ROLES.includes(cookieRole)) {
    return NextResponse.redirect(new URL("/login", request.url));
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
