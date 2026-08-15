import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

import { getAllowedApiRoles, isApiRoute, isPublicApiRoute } from "@/features/auth/api-permissions";
import { canAccessRoute } from "@/features/auth/authorization";
import { getAllowedRoles } from "@/features/auth/permissions";
import { isProtectedRoute, isPublicRoute } from "@/features/auth/route-config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const session = request.auth;

  if (isApiRoute(pathname)) {
    if (isPublicApiRoute(pathname)) {
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const allowedApiRoles = getAllowedApiRoles(pathname);

    if (allowedApiRoles && !canAccessRoute(session, allowedApiRoles)) {
      return NextResponse.json({ message: "Forbidden." }, { status: 403 });
    }

    return NextResponse.next();
  }

  const publicRoute = isPublicRoute(pathname);
  const protectedRoute = isProtectedRoute(pathname);

  if (!session && protectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && publicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session && protectedRoute) {
    const allowedRoles = getAllowedRoles(pathname);

    if (allowedRoles && !canAccessRoute(session, allowedRoles)) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|serwist/|icons/|manifest\\.webmanifest|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|map|txt|xml|webmanifest)$).*)",
  ],
};
