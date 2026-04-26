"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/itinerary", label: "Itinerary" },
  { href: "/scores", label: "Scores" },
  { href: "/rsvp", label: "RSVP" },
  { href: "/finances", label: "Finances" },
  { href: "/tasks", label: "Tasks" },
  { href: "/merch", label: "Merch" },
  { href: "/gallery", label: "Gallery" },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { resolved, toggle } = useTheme();

  return (
    <header
      className="relative z-10 border-b"
      style={{ borderColor: "var(--border-subtle)", background: "var(--bg-page)", borderBottomWidth: "0.5px" }}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between" style={{ height: "68px" }}>
          {/* Compact monogram + wordmark */}
          <Link href="/" className="flex items-center gap-3 no-underline" style={{ padding: "var(--space-2) 0" }}>
            <Image
              src="/assets/assets/logo-monogram.png"
              alt="The 19th Hole"
              width={36}
              height={36}
              className="object-contain flex-shrink-0"
              priority
            />
            <span
              className="font-[family-name:var(--font-display)] font-bold uppercase hidden sm:block"
              style={{
                fontSize: "var(--text-sm)",
                letterSpacing: "0.06em",
                color: "var(--fg-primary)",
                lineHeight: 1,
              }}
            >
              The 19th Hole
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline font-[family-name:var(--font-eyebrow)] uppercase tracking-[0.16em] text-[length:var(--text-3xs)] font-semibold transition-colors"
                style={{
                  color: pathname === link.href ? "var(--color-forest)" : "var(--fg-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={toggle}
              className="ml-2 p-2 rounded-md transition-colors cursor-pointer"
              style={{ color: "var(--fg-muted)", background: "transparent", border: "none" }}
              aria-label={`Switch to ${resolved === "light" ? "dark" : "light"} mode`}
            >
              {resolved === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggle}
              className="p-2 cursor-pointer"
              style={{ color: "var(--fg-muted)", background: "transparent", border: "none" }}
              aria-label={`Switch to ${resolved === "light" ? "dark" : "light"} mode`}
            >
              {resolved === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              )}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 cursor-pointer"
              style={{ color: "var(--fg-primary)", background: "transparent", border: "none" }}
              aria-label="Toggle menu"
            >
              {open ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav
          className="md:hidden border-t py-4"
          style={{ borderColor: "var(--border-subtle)", background: "var(--bg-page)" }}
        >
          <div className="container-wide flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="no-underline font-[family-name:var(--font-eyebrow)] uppercase tracking-[0.16em] text-[length:var(--text-2xs)] font-semibold py-2 transition-colors"
                style={{
                  color: pathname === link.href ? "var(--color-forest)" : "var(--fg-muted)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
