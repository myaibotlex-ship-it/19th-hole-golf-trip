import { NextResponse, type NextRequest } from "next/server";
import { getAttendee } from "@/lib/attendees";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authCookie = request.cookies.get("gh19_auth");
  if (authCookie?.value !== "valid") {
    return NextResponse.json({ ok: false, slug: null, name: null });
  }

  const slug = request.cookies.get("gh19_user")?.value;
  if (!slug) {
    return NextResponse.json({ ok: true, slug: null, name: null });
  }

  const attendee = getAttendee(slug);
  return NextResponse.json({
    ok: true,
    slug: attendee?.slug ?? null,
    name: attendee?.fullName ?? null,
    isAdmin: slug === "dan-rackley",
  });
}
