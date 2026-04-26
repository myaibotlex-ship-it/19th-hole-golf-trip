import { NextResponse, type NextRequest } from "next/server";
import { isValidSlug } from "@/lib/attendees";

const COOKIE_NAME = "gh19_user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Require site-password cookie — must pass the gate before identifying
  const auth = request.cookies.get("gh19_auth");
  if (auth?.value !== "valid") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let slug: unknown;
  let redirect: unknown;
  try {
    const body = await request.json();
    slug = body.slug;
    redirect = body.redirect;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  if (!isValidSlug(slug)) {
    return NextResponse.json({ ok: false, error: "Invalid attendee" }, { status: 400 });
  }

  // Validate redirect to prevent open-redirect attacks (client handles the actual navigation)
  if (
    typeof redirect === "string" &&
    redirect.length > 0 &&
    (!redirect.startsWith("/") || redirect.startsWith("//"))
  ) {
    return NextResponse.json({ ok: false, error: "Invalid redirect" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, slug, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return response;
}
