"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

function GolfFlag() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M8 22 L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 4 Q14 5 18 7 Q14 9 8 10 Z" fill="currentColor" />
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const password = (
      form.elements.namedItem("password") as HTMLInputElement
    ).value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data: { ok: boolean; error?: string } = await res.json();

      if (data.ok) {
        const redirect = searchParams.get("redirect") ?? "/";
        // Hard redirect ensures the proxy sees the fresh cookie on the next request
        window.location.href = redirect;
      } else {
        setError(data.error ?? "Incorrect password");
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
            style={{
              color: "var(--color-gold)",
              maxWidth: "200px",
              margin: "0 auto",
            }}
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
              Members{" "}
              <span style={{ fontStyle: "italic", fontWeight: "var(--weight-bold)" }}>
                Only
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
              Enter the trip password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "var(--space-6)" }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={loading}
              />
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
              disabled={loading}
            >
              {loading ? "Checking..." : "Sign In"}
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
