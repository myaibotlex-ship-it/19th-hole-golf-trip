"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";

type Task = {
  id: string;
  text: string;
  assignee: string;
  category: string;
  note: string;
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    text: "Book Coral Canyon tee time",
    assignee: "Dan",
    category: "Golf",
    note: "Booking window opens Mar 4, 2026",
    done: false,
  },
  {
    id: "2",
    text: "Book Copper Rock tee time — Sat Jun 6 afternoon",
    assignee: "Dan",
    category: "Golf",
    note: "Not yet available",
    done: false,
  },
  {
    id: "3",
    text: "Collect remaining payments",
    assignee: "Dan",
    category: "Budget",
    note: "Pending final course bookings",
    done: false,
  },
];

const STORAGE_KEY = "19th-hole-tasks-v2";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [loaded, setLoaded] = useState(false);

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

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Get It Done"
        title="Open Tasks"
        subtitle="Three items standing between now and tee time."
      />

      <section className="section">
        <div className="container-narrow">
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
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: progress === 100 ? "var(--status-success)" : "var(--color-gold)",
                  transition: "width 0.4s var(--ease-standard)",
                }}
              />
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((task) => (
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
                    className="font-[family-name:var(--font-body)] text-[length:var(--text-base)] font-medium"
                    style={{
                      color: "var(--fg-primary)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 items-center">
                    <span
                      className="font-[family-name:var(--font-eyebrow)] text-[length:var(--text-3xs)] uppercase tracking-[0.12em]"
                      style={{ color: "var(--fg-muted)" }}
                    >
                      {task.assignee}
                    </span>
                    <span className="tag tag-gold text-[length:var(--text-3xs)] py-0">
                      {task.category}
                    </span>
                    {task.note && (
                      <span
                        className="font-[family-name:var(--font-body)] text-[length:var(--text-xs)] italic"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {task.note}
                      </span>
                    )}
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
