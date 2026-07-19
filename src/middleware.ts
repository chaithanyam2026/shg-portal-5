import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

import { canAccessRoute } from "@/features/auth/authorization";
import { getAllowedRoles } from "@/features/auth/permissions";
import {
  isProtectedRoute,
  isPublicRoute,
} from "@/features/auth/route-config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;

  const pathname = nextUrl.pathname;

  const session = request.auth;

  const publicRoute = isPublicRoute(pathname);

  const protectedRoute = isProtectedRoute(pathname);

  if (!session && protectedRoute) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "callbackUrl",
      pathname,
    );

    return NextResponse.redirect(loginUrl);
  }

  if (session && publicRoute) {
    return NextResponse.redirect(
      new URL("/", request.url),
    );
  }

  if (session && protectedRoute) {
    const allowedRoles =
      getAllowedRoles(pathname);

    if (
      allowedRoles &&
      !canAccessRoute(session, allowedRoles)
    ) {
      return NextResponse.redirect(
        new URL("/forbidden", request.url),
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};