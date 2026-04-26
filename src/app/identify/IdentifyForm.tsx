"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { ATTENDEES } from "@/lib/attendees";

function GolfFlag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M8 22 L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 4 Q14 5 18 7 Q14 9 8 10 Z" fill="currentColor" />
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Form({ currentSlug }: { currentSlug: string | null }) {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState(currentSlug ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") ?? "/";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      setError("Please choose your name.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selected, redirect }),
      });

      const data: { ok: boolean; error?: string } = await res.json();

      if (data.ok) {
        // Hard redirect ensures the proxy sees the fresh cookie on the next request
        window.location.href = redirect;
      } else {
        setError(data.error ?? "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "var(--space-9) var(--space-5)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Monogram + divider */}
        <div className="text-center" style={{ marginBottom: "var(--space-7)" }}>
          <Image
            src="/assets/assets/logo-monogram.png"
            alt="The 19th Hole"
            width={64}
            height={64}
            className="object-contain mx-auto"
            style={{ marginBottom: "var(--space-4)" }}
          />
          <div
            className="gold-rule-ornament"
            style={{ color: "var(--color-gold)", maxWidth: "200px", margin: "0 auto" }}
          >
            <GolfFlag />
          </div>
        </div>

        {/* Card */}
        <div className="card">
          <div className="text-center" style={{ marginBottom: "var(--space-7)" }}>
            <h1
              className="font-[family-name:var(--font-display)] font-black uppercase"
              style={{
                fontSize: "var(--text-2xl)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--fg-primary)",
                marginBottom: "var(--space-3)",
              }}
            >
              Who&apos;s{" "}
              <span style={{ fontStyle: "italic", fontWeight: "var(--weight-bold)" }}>
                Playing?
              </span>
            </h1>
            <p
              className="font-[family-name:var(--font-body)]"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--fg-muted)",
                lineHeight: "var(--leading-normal)",
              }}
            >
              Pick your name so the group knows it&apos;s you.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "var(--space-6)" }}>
              <label htmlFor="slug">Your Name</label>
              <select
                id="slug"
                name="slug"
                required
                disabled={loading}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="" disabled>
                  Select your name…
                </option>
                {ATTENDEES.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.fullName}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p
                className="font-[family-name:var(--font-body)]"
                style={{
                  color: "var(--status-error)",
                  fontSize: "var(--text-xs)",
                  marginBottom: "var(--space-4)",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%" }}
              disabled={loading || !selected}
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>

        <p
          className="text-center font-[family-name:var(--font-eyebrow)] font-semibold uppercase"
          style={{
            fontSize: "var(--text-3xs)",
            letterSpacing: "var(--tracking-wider)",
            color: "var(--fg-muted)",
            marginTop: "var(--space-5)",
          }}
        >
          The 19th Hole &middot; Est. 2026
        </p>
      </div>
    </div>
  );
}

export function IdentifyForm({ currentSlug }: { currentSlug: string | null }) {
  return (
    <Suspense>
      <Form currentSlug={currentSlug} />
    </Suspense>
  );
}
