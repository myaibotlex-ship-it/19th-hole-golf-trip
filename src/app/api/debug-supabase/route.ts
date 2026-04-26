import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, isValidSlug } from "@/lib/attendees";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authCookie = request.cookies.get("gh19_auth")?.value;
  const userSlug = request.cookies.get("gh19_user")?.value;

  if (authCookie !== "valid" || !isValidSlug(userSlug) || !isAdmin(userSlug)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const env = {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    hasServiceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  let queryResult: unknown = null;
  let queryError: unknown = null;

  try {
    const db = createAdminClient();
    const { data, error } = await db.from("expenses").select("count", { count: "exact", head: true });
    if (error) {
      queryError = { message: error.message, code: error.code, details: error.details, hint: error.hint };
    } else {
      queryResult = data;
    }
  } catch (thrown) {
    const err = thrown as Error;
    queryError = { thrown: true, name: err?.name, message: err?.message, stack: err?.stack };
  }

  return NextResponse.json({
    ok: queryError === null,
    env,
    queryResult,
    queryError,
  });
}
