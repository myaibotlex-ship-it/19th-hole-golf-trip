import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidSlug } from "@/lib/attendees";
import { computeBalances, computeSettlements, type Expense } from "@/lib/finances";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const userSlug = request.cookies.get("gh19_user")?.value;
  console.log("[expenses] GET request received, gh19_user:", userSlug ?? "(missing)");

  if (!isValidSlug(userSlug)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let data, error;
  try {
    const db = createAdminClient();
    ({ data, error } = await db
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }));
  } catch (thrown) {
    const err = thrown as Error;
    console.error("[expenses GET] thrown exception:", {
      name: err?.name,
      message: err?.message,
      stack: err?.stack,
    });
    return NextResponse.json({ ok: false, error: "Failed to fetch expenses" }, { status: 500 });
  }

  if (error) {
    // Table not yet created — return empty state rather than crashing
    if (error.code === "42P01") {
      return NextResponse.json({ ok: true, expenses: [], balances: [], settlements: [] });
    }
    console.error("[expenses GET] supabase error:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return NextResponse.json({ ok: false, error: "Failed to fetch expenses" }, { status: 500 });
  }

  const expenses = (data ?? []) as Expense[];
  const balances = computeBalances(expenses);
  const settlements = computeSettlements(balances);

  return NextResponse.json({ ok: true, expenses, balances, settlements });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const userSlug = request.cookies.get("gh19_user")?.value;
  if (!isValidSlug(userSlug)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { date, description, amount, paid_by, split_among } = body;

  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
  }
  if (typeof description !== "string" || description.trim().length === 0) {
    return NextResponse.json({ ok: false, error: "Description required" }, { status: 400 });
  }
  if (typeof amount !== "number" || amount <= 0 || !isFinite(amount)) {
    return NextResponse.json({ ok: false, error: "Amount must be a positive number" }, { status: 400 });
  }
  if (!isValidSlug(paid_by)) {
    return NextResponse.json({ ok: false, error: "Invalid paid_by" }, { status: 400 });
  }
  if (!Array.isArray(split_among) || split_among.length === 0 || !split_among.every((s) => isValidSlug(s))) {
    return NextResponse.json({ ok: false, error: "Invalid split_among" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("expenses")
    .insert({
      date,
      description: description.trim(),
      amount,
      paid_by,
      split_among,
      created_by: userSlug,
    })
    .select()
    .single();

  if (error) {
    console.error("[expenses POST]", error);
    return NextResponse.json({ ok: false, error: "Failed to add expense" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expense: data }, { status: 201 });
}
