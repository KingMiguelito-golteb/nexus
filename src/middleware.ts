// src/middleware.ts
export { auth as middleware } from "@/lib/auth"

export const config = {
  matcher: [
    // Protect all dashboard routes
    "/dashboard/:path*",
    "/projects/:path*",
    "/finances/:path*",
    "/activity/:path*",
    "/settings/:path*",
  ],
}