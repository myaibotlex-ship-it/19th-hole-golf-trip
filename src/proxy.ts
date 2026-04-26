import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "gh19_auth";

// Paths that are always accessible without authentication
const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through public auth paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for valid auth cookie
  const auth = request.cookies.get(COOKIE_NAME);
  if (auth?.value === "valid") {
    return NextResponse.next();
  }

  // No valid session — redirect to login, preserving intended destination
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Exclude static assets, images, and api routes from proxy
  // Note: _next/data is always intercepted by Next.js 16 proxy regardless of matcher
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|images/|assets/|api/).*)",
  ],
};
