import { NextResponse, type NextRequest } from "next/server";
import { timingSafeEqual } from "crypto";

const COOKIE_NAME = "gh19_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// In-memory rate limiter — resets on server restart, sufficient for soft brute-force protection
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count++;
  }
}

function authCookieResponse(baseResponse: NextResponse): NextResponse {
  baseResponse.cookies.set(COOKIE_NAME, "valid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return baseResponse;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const sitePassword = process.env.SITE_PASSWORD;

  // Fail-soft: if env var is not set, let all traffic through with a warning
  if (!sitePassword) {
    console.warn(
      "[auth] SITE_PASSWORD is not configured — all login attempts succeed. Set the env var to enable the password gate."
    );
    return authCookieResponse(NextResponse.json({ ok: true }));
  }

  const ip = getClientIP(request);

  if (checkRateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again in 5 minutes." },
      { status: 429 }
    );
  }

  let supplied: string;
  try {
    const body = await request.json();
    supplied = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }

  // Constant-time comparison using Node.js crypto to prevent timing attacks
  let match = false;
  try {
    const a = Buffer.from(supplied);
    const b = Buffer.from(sitePassword);
    // timingSafeEqual requires equal-length buffers; length mismatch is itself not secret
    if (a.length === b.length) {
      match = timingSafeEqual(a, b);
    }
  } catch {
    match = false;
  }

  if (!match) {
    recordFailure(ip);
    return NextResponse.json(
      { ok: false, error: "Incorrect password" },
      { status: 401 }
    );
  }

  // Correct password — clear any failure record and issue the auth cookie
  attempts.delete(ip);
  return authCookieResponse(NextResponse.json({ ok: true }));
}
