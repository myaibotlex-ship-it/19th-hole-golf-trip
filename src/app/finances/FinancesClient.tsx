"use client";

import { useState, type FormEvent } from "react";
import { PageHeader } from "../components/PageHeader";
import { ATTENDEES } from "@/lib/attendees";
import type { Expense, Balance, Settlement } from "@/lib/finances";

type Props = {
  initialExpenses: Expense[];
  initialBalances: Balance[];
  initialSettlements: Settlement[];
  currentSlug: string;
  currentFirstName: string;
  isAdmin: boolean;
  loadError: boolean;
};

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function formatAmount(amount: number | string): string {
  return `$${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFullName(slug: string): string {
  return ATTENDEES.find((a) => a.slug === slug)?.fullName ?? slug;
}

function SplitSummary({ slugs }: { slugs: string[] }) {
  if (slugs.length === ATTENDEES.length) return <>All</>;
  return <>{slugs.map((s) => ATTENDEES.find((a) => a.slug === s)?.firstName ?? s).join(", ")}</>;
}

function CheckboxGrid({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (slugs: string[]) => void;
}) {
  function toggle(slug: string) {
    onChange(
      selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]
    );
  }

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(4, 1fr)", marginTop: "var(--space-3)" }}
    >
      {ATTENDEES.map((a) => (
        <label
          key={a.slug}
          className="flex items-center gap-2"
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--fg-secondary)",
            cursor: "pointer",
            letterSpacing: "normal",
            textTransform: "none",
            fontFamily: "var(--font-body)",
            fontWeight: "normal",
          }}
        >
          <input
            type="checkbox"
            style={{ width: "auto" }}
            checked={selected.includes(a.slug)}
            onChange={() => toggle(a.slug)}
          />
          {a.firstName}
        </label>
      ))}
    </div>
  );
}

export function FinancesClient({
  initialExpenses,
  initialBalances,
  initialSettlements,
  currentSlug,
  isAdmin,
  loadError,
}: Props) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [balances, setBalances] = useState(initialBalances);
  const [settlements, setSettlements] = useState(initialSettlements);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Add form
  const [formDate, setFormDate] = useState(todayISO);
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formPaidBy, setFormPaidBy] = useState(currentSlug);
  const [formSplit, setFormSplit] = useState<string[]>(ATTENDEES.map((a) => a.slug));

  // Edit form
  const [editId, setEditId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editPaidBy, setEditPaidBy] = useState("");
  const [editSplit, setEditSplit] = useState<string[]>([]);

  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  async function refetch() {
    const res = await fetch("/api/expenses");
    if (!res.ok) return;
    const data = await res.json();
    if (data.ok) {
      setExpenses(data.expenses);
      setBalances(data.balances);
      setSettlements(data.settlements);
    }
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    if (formSplit.length === 0) {
      setSubmitError("Select at least one person to split with.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formDate,
          description: formDesc,
          amount: parseFloat(formAmount),
          paid_by: formPaidBy,
          split_among: formSplit,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error ?? "Failed to add expense.");
      } else {
        setFormDate(todayISO());
        setFormDesc("");
        setFormAmount("");
        setFormPaidBy(currentSlug);
        setFormSplit(ATTENDEES.map((a) => a.slug));
        await refetch();
      }
    } catch {
      setSubmitError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(expense: Expense) {
    setEditId(expense.id);
    setEditDate(expense.date);
    setEditDesc(expense.description);
    setEditAmount(Number(expense.amount).toFixed(2));
    setEditPaidBy(expense.paid_by);
    setEditSplit([...expense.split_among]);
    setSubmitError("");
    setDeleteConfirmId(null);
  }

  function cancelEdit() {
    setEditId(null);
    setSubmitError("");
  }

  async function handleSaveEdit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editId) return;
    setSubmitError("");
    if (editSplit.length === 0) {
      setSubmitError("Select at least one person to split with.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editDate,
          description: editDesc,
          amount: parseFloat(editAmount),
          paid_by: editPaidBy,
          split_among: editSplit,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error ?? "Failed to update expense.");
      } else {
        setEditId(null);
        await refetch();
      }
    } catch {
      setSubmitError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) {
        setSubmitError(data.error ?? "Failed to delete expense.");
      } else {
        setDeleteConfirmId(null);
        if (editId === id) setEditId(null);
        await refetch();
      }
    } catch {
      setSubmitError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (loadError) {
    return (
      <div>
        <PageHeader
          eyebrow="The Ledger"
          title="Finances"
          subtitle="Who paid what. What everyone owes."
        />
        <div className="section">
          <div className="container-base">
            <div
              className="card text-center"
              style={{ padding: "var(--space-8)", color: "var(--fg-muted)", fontSize: "var(--text-sm)" }}
            >
              Finances coming soon — the database is being set up.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formSection = (
    <div className="section">
      <div className="container-base">
        <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>
          {editId ? "Edit Expense" : "Add Expense"}
        </p>
        <div className="card" style={{ maxWidth: "640px" }}>
          {editId ? (
            <form onSubmit={handleSaveEdit}>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "var(--space-5)" }}
              >
                <div>
                  <label htmlFor="edit-date">Date</label>
                  <input
                    id="edit-date"
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="edit-amount">Amount ($)</label>
                  <input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label htmlFor="edit-desc">Description</label>
                <input
                  id="edit-desc"
                  type="text"
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label htmlFor="edit-paid-by">Paid By</label>
                <select
                  id="edit-paid-by"
                  value={editPaidBy}
                  onChange={(e) => setEditPaidBy(e.target.value)}
                >
                  {ATTENDEES.map((a) => (
                    <option key={a.slug} value={a.slug}>{a.fullName}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <label>Split Among</label>
                <CheckboxGrid selected={editSplit} onChange={setEditSplit} />
              </div>
              {submitError && (
                <p style={{ color: "var(--status-error)", fontSize: "var(--text-xs)", marginBottom: "var(--space-4)" }}>
                  {submitError}
                </p>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn-gold" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-ghost" onClick={cancelEdit} disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdd}>
              <div
                className="grid gap-5"
                style={{ gridTemplateColumns: "1fr 1fr", marginBottom: "var(--space-5)" }}
              >
                <div>
                  <label htmlFor="add-date">Date</label>
                  <input
                    id="add-date"
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="add-amount">Amount ($)</label>
                  <input
                    id="add-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label htmlFor="add-desc">Description</label>
                <input
                  id="add-desc"
                  type="text"
                  required
                  placeholder="What was this for?"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: "var(--space-5)" }}>
                <label htmlFor="add-paid-by">Paid By</label>
                <select
                  id="add-paid-by"
                  value={formPaidBy}
                  onChange={(e) => setFormPaidBy(e.target.value)}
                >
                  {ATTENDEES.map((a) => (
                    <option key={a.slug} value={a.slug}>{a.fullName}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "var(--space-6)" }}>
                <label>Split Among</label>
                <CheckboxGrid selected={formSplit} onChange={setFormSplit} />
              </div>
              {submitError && (
                <p style={{ color: "var(--status-error)", fontSize: "var(--text-xs)", marginBottom: "var(--space-4)" }}>
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                className="btn-gold"
                disabled={loading || !formDesc.trim() || !formAmount}
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        eyebrow="The Ledger"
        title="Finances"
        subtitle="Who paid what. What everyone owes."
      />

      {formSection}

      <div className="section">
        <div className="container-base">
          <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>Potentially Owed to Dan</p>
          <div className="card" style={{ padding: "var(--space-5)" }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)] leading-tight mb-1"
                  style={{ color: "var(--fg-primary)" }}
                >
                  The Ledges Replay Placeholder
                </h3>
                <p
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)]"
                  style={{ color: "var(--fg-muted)" }}
                >
                  $649.04 total divided by 8 guys
                </p>
              </div>
              <div className="text-right">
                <p
                  className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase"
                  style={{ color: "var(--accent)", fontSize: "var(--text-md)", letterSpacing: "var(--tracking-wide)" }}
                >
                  $81.13 each
                </p>
                <p
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-xs)] italic mt-1"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Only if the backup tee times are used
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses table */}
      <div className="section">
        <div className="container-base">
          <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>Expenses</p>
          {expenses.length === 0 ? (
            <div
              className="card text-center"
              style={{ padding: "var(--space-8)", color: "var(--fg-muted)", fontSize: "var(--text-sm)" }}
            >
              No expenses yet — add the first one above.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="brand-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Paid By</th>
                    <th>Split</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                    {isAdmin && <th style={{ width: "90px" }} />}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      style={
                        editId === expense.id
                          ? { background: "var(--accent-soft)" }
                          : undefined
                      }
                    >
                      <td style={{ whiteSpace: "nowrap", color: "var(--fg-muted)" }}>
                        {formatDate(expense.date)}
                      </td>
                      <td>{expense.description}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{getFullName(expense.paid_by)}</td>
                      <td style={{ color: "var(--fg-muted)" }}>
                        <SplitSummary slugs={expense.split_among} />
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontVariantNumeric: "tabular-nums",
                          whiteSpace: "nowrap",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {formatAmount(expense.amount)}
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => startEdit(expense)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--fg-muted)",
                                padding: "var(--space-1)",
                                lineHeight: 0,
                              }}
                              aria-label="Edit expense"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>

                            {deleteConfirmId === expense.id ? (
                              <>
                                <button
                                  onClick={() => handleDelete(expense.id)}
                                  disabled={loading}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--status-error)",
                                    padding: "var(--space-1)",
                                    fontSize: "var(--text-3xs)",
                                    fontFamily: "var(--font-eyebrow)",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "var(--tracking-wider)",
                                  }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--fg-muted)",
                                    padding: "var(--space-1)",
                                    fontSize: "var(--text-3xs)",
                                    fontFamily: "var(--font-eyebrow)",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "var(--tracking-wider)",
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(expense.id)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  color: "var(--fg-muted)",
                                  padding: "var(--space-1)",
                                  lineHeight: 0,
                                }}
                                aria-label="Delete expense"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Balances */}
      <div className="section">
        <div className="container-base">
          <p className="eyebrow" style={{ marginBottom: "var(--space-6)" }}>Balances</p>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
          >
            {balances.map((balance) => (
              <div key={balance.slug} className="card" style={{ padding: "var(--space-5)" }}>
                <div
                  className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase"
                  style={{
                    fontSize: "var(--text-3xs)",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--fg-muted)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  {balance.fullName}
                </div>
                {balance.net > 0.005 ? (
                  <span className="tag tag-sage">Owed {formatAmount(balance.net)}</span>
                ) : balance.net < -0.005 ? (
                  <span className="tag tag-gold">Owes {formatAmount(-balance.net)}</span>
                ) : (
                  <span className="tag tag-sand">Settled</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settle Up */}
      <div className="section">
        <div className="container-base">
          <p className="eyebrow" style={{ marginBottom: "var(--space-2)" }}>Settle Up</p>
          <p
            className="font-[family-name:var(--font-eyebrow)] uppercase"
            style={{
              fontSize: "var(--text-3xs)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--fg-muted)",
              marginBottom: "var(--space-6)",
            }}
          >
            Minimum Transactions
          </p>
          {settlements.length === 0 ? (
            <div
              className="card text-center"
              style={{ padding: "var(--space-7)", color: "var(--fg-muted)", fontSize: "var(--text-sm)" }}
            >
              All square — no one owes anything.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {settlements.map((s, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    padding: "var(--space-4) var(--space-5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    className="font-[family-name:var(--font-body)]"
                    style={{ fontSize: "var(--text-sm)", color: "var(--fg-secondary)" }}
                  >
                    {s.fromName}{" "}
                    <span style={{ color: "var(--fg-muted)", fontStyle: "normal" }}>→</span>{" "}
                    {s.toName}
                  </span>
                  <span
                    className="font-[family-name:var(--font-eyebrow)] font-semibold"
                    style={{ fontSize: "var(--text-sm)", color: "var(--color-gold)" }}
                  >
                    {formatAmount(s.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
