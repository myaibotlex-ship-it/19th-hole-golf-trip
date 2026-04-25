import type { Metadata } from "next";
import { PageHeader } from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Tasks — The 19th Hole",
};

const tasks = [
  { task: "Book resort cottages", owner: "Dan", status: "done", priority: "high" },
  { task: "Reserve tee times (3 rounds)", owner: "Mike", status: "done", priority: "high" },
  { task: "Coordinate airport shuttles", owner: "Jake", status: "in-progress", priority: "medium" },
  { task: "Order trip merch (shirts & hats)", owner: "Chris", status: "in-progress", priority: "medium" },
  { task: "Collect RSVP confirmations", owner: "Dan", status: "in-progress", priority: "high" },
  { task: "Plan welcome dinner menu", owner: "Tom", status: "todo", priority: "medium" },
  { task: "Set up scoring spreadsheet", owner: "Pete", status: "done", priority: "low" },
  { task: "Buy closest-to-pin prizes", owner: "Mike", status: "todo", priority: "low" },
  { task: "Arrange champions trophy", owner: "Jake", status: "todo", priority: "medium" },
  { task: "Create pairings draw", owner: "Dan", status: "todo", priority: "low" },
  { task: "Book farewell breakfast venue", owner: "Tom", status: "done", priority: "medium" },
  { task: "Compile photo slideshow from last year", owner: "Chris", status: "in-progress", priority: "low" },
];

const statusConfig: Record<string, { label: string; className: string; style: React.CSSProperties }> = {
  done: {
    label: "Done",
    className: "tag",
    style: { background: "var(--status-success)", color: "white" },
  },
  "in-progress": {
    label: "In Progress",
    className: "tag",
    style: { background: "var(--accent)", color: "var(--fg-on-gold)" },
  },
  todo: {
    label: "To Do",
    className: "tag",
    style: { background: "transparent", border: "1px solid var(--border-strong)", color: "var(--fg-muted)" },
  },
};

const priorityConfig: Record<string, { label: string; style: React.CSSProperties }> = {
  high: { label: "High", style: { background: "transparent", border: "1px solid var(--status-error)", color: "var(--status-error)" } },
  medium: { label: "Med", style: { background: "transparent", border: "1px solid var(--accent)", color: "var(--accent)" } },
  low: { label: "Low", style: { background: "transparent", border: "1px solid var(--color-sage)", color: "var(--color-sage)" } },
};

export default function TasksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Trip Planning"
        title="The Tasks"
        subtitle="Every great trip starts with a plan. Here's ours."
      />

      <section className="section">
        <div className="container-base">
          <table className="brand-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => {
                const status = statusConfig[t.status];
                const priority = priorityConfig[t.priority];
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: "var(--fg-primary)" }}>
                      {t.task}
                    </td>
                    <td>{t.owner}</td>
                    <td>
                      <span className="tag" style={priority.style}>
                        {priority.label}
                      </span>
                    </td>
                    <td>
                      <span className={status.className} style={status.style}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
