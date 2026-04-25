"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";

type Task = {
  id: string;
  text: string;
  assignee: string;
  category: string;
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  { id: "1", text: "Book flights to OTH", assignee: "Everyone", category: "Travel", done: false },
  { id: "2", text: "Reserve lodge rooms (2 per suite)", assignee: "Dan", category: "Lodging", done: false },
  { id: "3", text: "Arrange airport shuttle", assignee: "Mike", category: "Travel", done: false },
  { id: "4", text: "Book tee times \u2014 Bandon Dunes", assignee: "Dan", category: "Golf", done: false },
  { id: "5", text: "Book tee times \u2014 Pacific Dunes", assignee: "Dan", category: "Golf", done: false },
  { id: "6", text: "Book tee times \u2014 Old Macdonald", assignee: "Dan", category: "Golf", done: false },
  { id: "7", text: "Dinner reservations \u2014 welcome night", assignee: "Chris", category: "Dining", done: false },
  { id: "8", text: "Dinner reservations \u2014 steak night", assignee: "Chris", category: "Dining", done: false },
  { id: "9", text: "Dinner reservations \u2014 closing dinner", assignee: "Chris", category: "Dining", done: false },
  { id: "10", text: "Order trophy / cup for winner", assignee: "Jake", category: "Swag", done: false },
  { id: "11", text: "Print scorecards", assignee: "Tom", category: "Golf", done: false },
  { id: "12", text: "Design & order trip t-shirts", assignee: "Will", category: "Swag", done: false },
  { id: "13", text: "Create shared photo album", assignee: "Mike", category: "Memories", done: false },
  { id: "14", text: "Pack sunscreen, rain gear, flask", assignee: "Everyone", category: "Packing", done: false },
  { id: "15", text: "Collect Venmo deposits ($500 each)", assignee: "Dan", category: "Budget", done: false },
  { id: "16", text: "Set up group chat for trip", assignee: "Jake", category: "Comms", done: false },
];

const STORAGE_KEY = "19th-hole-tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [loaded, setLoaded] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setTasks(JSON.parse(stored)); } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, loaded]);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const categories = ["All", ...Array.from(new Set(INITIAL_TASKS.map((t) => t.category)))];
  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.category === filter);
  const doneCount = tasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Get It Done"
        title="Trip Tasks"
        subtitle="The checklist that makes the trip happen. Check items off as you go."
      />

      <section className="section">
        <div className="container-base">
          {/* Progress */}
          <div className="card mb-8">
            <div className="flex justify-between items-center mb-3">
              <p className="eyebrow">Progress</p>
              <span
                className="font-[family-name:var(--font-mono)] text-[length:var(--text-sm)] font-semibold"
                style={{ color: "var(--fg-primary)" }}
              >
                {doneCount}/{tasks.length}
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "var(--border-subtle)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background: progress === 100 ? "var(--status-success)" : "var(--color-gold)",
                  transition: "width 0.4s var(--ease-standard)",
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`tag cursor-pointer ${filter === cat ? "tag-sage" : "tag-gold"}`}
                style={{ border: filter === cat ? "none" : undefined }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tasks */}
          <div className="space-y-2">
            {filtered.map((task) => (
              <label
                key={task.id}
                className="card flex items-start gap-4 cursor-pointer"
                style={{ opacity: task.done ? 0.6 : 1 }}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-5 h-5 accent-[var(--color-forest)] cursor-pointer flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)] font-medium"
                    style={{
                      color: "var(--fg-primary)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </p>
                  <div className="flex gap-3 mt-1">
                    <span
                      className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-3xs)] uppercase tracking-[0.12em]"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {task.assignee}
                    </span>
                    <span className="tag tag-gold text-[length:var(--text-3xs)] py-0">
                      {task.category}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
