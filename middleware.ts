import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Get the pathname of the next request
  const path = request.nextUrl.pathname;

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/about"];

  // If it's a public route, allow access
  if (publicRoutes.includes(path)) return NextResponse.next();

  // If no session and trying to access protected route, redirect to login
  if (!session && !publicRoutes.includes(path))
    return NextResponse.redirect(new URL("/login", request.url));

  // Allow access to protected routes for authenticated users
  return NextResponse.next();
}

// Configure middleware to run only on specified routes
export const config = {
  matcher: [
    // Match all routes except static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
