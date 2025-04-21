import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthenticated = !!session;

  const path = request.nextUrl.pathname;
  const publicRoutes = ["/", "/login", "/register", "/about"];

  if (isAuthenticated && path === "/")
    return NextResponse.redirect(new URL("/boards", request.url));

  if (!isAuthenticated && !publicRoutes.includes(path))
    return NextResponse.redirect(new URL("/login", request.url));

  if (publicRoutes.includes(path)) return NextResponse.next();

  return NextResponse.next();
}

// Configure middleware to run only on specified routes
export const config = {
  matcher: [
    // Match all routes except static files, api routes, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
