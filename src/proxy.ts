import { NextResponse, type NextRequest } from "next/server";
import { isValidSlug } from "./lib/attendees";

const AUTH_COOKIE = "gh19_auth";
const USER_COOKIE = "gh19_user";

// These paths bypass ALL checks — no cookies required
const AUTH_FREE_PATHS = ["/login", "/api/login", "/api/logout"];

// These paths require gh19_auth but NOT gh19_user
const USER_FREE_PATHS = ["/identify", "/api/identify", "/api/identify/clear"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through paths that need no authentication at all
  if (AUTH_FREE_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check site-password gate
  const auth = request.cookies.get(AUTH_COOKIE);
  if (auth?.value !== "valid") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Pass through identity paths — gh19_auth is enough, gh19_user not required
  if (USER_FREE_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check identity cookie — redirect to /identify if missing or unrecognised
  const userSlug = request.cookies.get(USER_COOKIE)?.value;
  if (!isValidSlug(userSlug)) {
    const identifyUrl = new URL("/identify", request.url);
    identifyUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(identifyUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Exclude static assets, images, and api routes from proxy
  // Note: _next/data is always intercepted by Next.js 16 proxy regardless of matcher
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|favicon-.*\\.png|apple-touch-icon\\.png|android-chrome-.*\\.png|icon\\.png|apple-icon\\.png|robots\\.txt|images/|assets/|api/).*)",
  ],
};
