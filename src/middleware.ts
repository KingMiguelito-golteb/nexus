// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for the session token cookie
  const token =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token") ||
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token")

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register")

  // If no token and trying to access protected route → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has token and trying to access auth pages → redirect to dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/finances/:path*",
    "/activity/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}