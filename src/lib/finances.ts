import { ATTENDEES } from "@/lib/attendees";

export type Expense = {
  id: string;
  created_at: string;
  updated_at: string;
  date: string;
  description: string;
  amount: number;
  paid_by: string;
  split_among: string[];
  created_by: string;
};

export type Balance = {
  slug: string;
  fullName: string;
  net: number;
};

export type Settlement = {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
};

export function computeBalances(expenses: Expense[]): Balance[] {
  const nets = new Map<string, number>(ATTENDEES.map((a) => [a.slug, 0]));

  for (const expense of expenses) {
    const amount = Number(expense.amount);
    const share = amount / expense.split_among.length;
    nets.set(expense.paid_by, (nets.get(expense.paid_by) ?? 0) + amount);
    for (const slug of expense.split_among) {
      nets.set(slug, (nets.get(slug) ?? 0) - share);
    }
  }

  return ATTENDEES.map((a) => ({
    slug: a.slug,
    fullName: a.fullName,
    net: Math.round((nets.get(a.slug) ?? 0) * 100) / 100,
  }));
}

export function computeSettlements(balances: Balance[]): Settlement[] {
  const creditors = balances
    .filter((b) => b.net > 0.005)
    .map((b) => ({ slug: b.slug, fullName: b.fullName, amount: b.net }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = balances
    .filter((b) => b.net < -0.005)
    .map((b) => ({ slug: b.slug, fullName: b.fullName, amount: -b.net }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let ci = 0;
  let di = 0;

  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const transfer = Math.min(creditor.amount, debtor.amount);

    settlements.push({
      from: debtor.slug,
      fromName: debtor.fullName,
      to: creditor.slug,
      toName: creditor.fullName,
      amount: Math.round(transfer * 100) / 100,
    });

    creditor.amount -= transfer;
    debtor.amount -= transfer;

    if (creditor.amount < 0.005) ci++;
    if (debtor.amount < 0.005) di++;
  }

  return settlements;
}
