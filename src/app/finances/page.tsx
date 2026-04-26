import { cookies } from "next/headers";
import { getAttendee, isAdmin } from "@/lib/attendees";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeBalances, computeSettlements, type Expense } from "@/lib/finances";
import { FinancesClient } from "./FinancesClient";

export default async function FinancesPage() {
  const cookieStore = await cookies();
  const userSlug = cookieStore.get("gh19_user")?.value ?? "";
  const admin = isAdmin(userSlug);

  let expenses: Expense[] = [];
  let loadError = false;

  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("expenses")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code !== "42P01") {
        loadError = true;
      }
      // 42P01 = table does not exist yet → empty state, not an error
    } else {
      expenses = (data ?? []) as Expense[];
    }
  } catch {
    loadError = true;
  }

  const balances = loadError ? [] : computeBalances(expenses);
  const settlements = loadError ? [] : computeSettlements(balances);

  return (
    <FinancesClient
      initialExpenses={expenses}
      initialBalances={balances}
      initialSettlements={settlements}
      currentSlug={userSlug}
      currentFirstName={getAttendee(userSlug)?.firstName ?? ""}
      isAdmin={admin}
      loadError={loadError}
    />
  );
}
