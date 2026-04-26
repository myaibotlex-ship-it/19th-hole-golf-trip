import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin, isValidSlug } from "@/lib/attendees";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const userSlug = request.cookies.get("gh19_user")?.value;
  if (!isAdmin(userSlug)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  const { date, description, amount, paid_by, split_among } = body;

  if (date !== undefined) {
    if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ ok: false, error: "Invalid date" }, { status: 400 });
    }
    updates.date = date;
  }
  if (description !== undefined) {
    if (typeof description !== "string" || description.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Description required" }, { status: 400 });
    }
    updates.description = description.trim();
  }
  if (amount !== undefined) {
    if (typeof amount !== "number" || amount <= 0 || !isFinite(amount)) {
      return NextResponse.json({ ok: false, error: "Amount must be positive" }, { status: 400 });
    }
    updates.amount = amount;
  }
  if (paid_by !== undefined) {
    if (!isValidSlug(paid_by)) {
      return NextResponse.json({ ok: false, error: "Invalid paid_by" }, { status: 400 });
    }
    updates.paid_by = paid_by;
  }
  if (split_among !== undefined) {
    if (!Array.isArray(split_among) || split_among.length === 0 || !split_among.every((s) => isValidSlug(s))) {
      return NextResponse.json({ ok: false, error: "Invalid split_among" }, { status: 400 });
    }
    updates.split_among = split_among;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("expenses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[expenses PATCH]", error);
    return NextResponse.json({ ok: false, error: "Failed to update expense" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, expense: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const userSlug = request.cookies.get("gh19_user")?.value;
  if (!isAdmin(userSlug)) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const db = createAdminClient();
  const { error } = await db.from("expenses").delete().eq("id", id);

  if (error) {
    console.error("[expenses DELETE]", error);
    return NextResponse.json({ ok: false, error: "Failed to delete expense" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
