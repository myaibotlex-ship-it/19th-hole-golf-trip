"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Jun 3, 2026 1:12 PM PDT (UTC−7) = 20:12 UTC
const TRIP_DATE = new Date("2026-06-03T20:12:00Z");

function useCountdown(target: Date) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const diff = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-[family-name:var(--font-display)] font-black text-[length:var(--text-4xl)] md:text-[length:var(--text-5xl)] leading-none"
        style={{ color: "var(--fg-primary)" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  );
}

function GolfFlag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M8 22 L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 4 Q14 5 18 7 Q14 9 8 10 Z" fill="currentColor" />
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

const tripStats = [
  { number: "6", eyebrow: "ROUNDS", caption: "Across 4 days of desert golf" },
  { number: "8", eyebrow: "DUDES", caption: "Captain: Dan Rackley" },
  { number: "4", eyebrow: "NIGHTS", caption: "Black Desert Resort + private house" },
  { number: "$0", eyebrow: "OUTSTANDING", caption: "Group settled in advance" },
];

export default function Home() {
  const countdown = useCountdown(TRIP_DATE);

  return (
    <>
      {/* Hero — photo-led */}
      <section
        className="relative overflow-hidden"
        style={{ height: "clamp(480px, 70vh, 720px)" }}
      >
        <Image
          src="/images/hero-black-desert.jpg"
          alt="Black Desert Golf Course, Utah"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(31,61,46,0.45) 0%, rgba(31,61,46,0.15) 100%)",
          }}
        />

        {/* Hero content */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ padding: "0 var(--space-5)", zIndex: 1 }}
        >
          <p
            className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase"
            style={{
              fontSize: "var(--text-2xs)",
              letterSpacing: "var(--tracking-wider)",
              color: "var(--color-gold)",
              marginBottom: "var(--space-4)",
            }}
          >
            EST. 2026 &middot; ST. GEORGE, UT
          </p>

          <h1
            className="font-[family-name:var(--font-display)] font-black uppercase"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 4.768rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              color: "var(--color-ivory)",
              marginBottom: "var(--space-5)",
            }}
          >
            THE 19TH{" "}
            <span style={{ fontStyle: "italic", fontWeight: "var(--weight-bold)" }}>
              HOLE
            </span>
          </h1>

          {/* Gold flag-and-rule divider */}
          <div
            className="gold-rule-ornament"
            style={{
              color: "var(--color-gold)",
              maxWidth: "320px",
              width: "100%",
              marginBottom: "var(--space-5)",
            }}
          >
            <GolfFlag />
          </div>

          <p
            className="font-[family-name:var(--font-body)] italic"
            style={{
              fontSize: "var(--text-md)",
              color: "var(--color-ivory)",
              maxWidth: "46ch",
              marginBottom: "var(--space-7)",
            }}
          >
            A tradition among friends. Stories that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/rsvp" className="btn-gold no-underline">
              RSVP NOW
            </Link>
            <Link href="/itinerary" className="btn-ghost-light no-underline">
              VIEW ITINERARY
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute animate-bounce"
          style={{
            bottom: "var(--space-5)",
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--color-gold)",
            zIndex: 1,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* Trip Facts */}
      <section className="section">
        <div className="container-base">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {tripStats.map((s) => (
              <div key={s.eyebrow} className="text-center py-4">
                <p
                  className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase"
                  style={{
                    fontSize: "var(--text-2xs)",
                    letterSpacing: "var(--tracking-wider)",
                    color: "var(--accent)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {s.eyebrow}
                </p>
                <div
                  className="font-[family-name:var(--font-display)] font-black leading-none"
                  style={{
                    fontSize: "var(--text-4xl)",
                    color: "var(--fg-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {s.number}
                </div>
                <p
                  className="font-[family-name:var(--font-body)]"
                  style={{ fontSize: "var(--text-xs)", color: "var(--fg-muted)" }}
                >
                  {s.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown */}
      <section className="section">
        <div className="container-base">
          <p className="eyebrow text-center mb-6">Tee Time Countdown</p>
          <div className="flex justify-center gap-8 md:gap-16 mb-8">
            <CountdownUnit value={countdown.days} label="Days" />
            <CountdownUnit value={countdown.hours} label="Hours" />
            <CountdownUnit value={countdown.minutes} label="Min" />
            <CountdownUnit value={countdown.seconds} label="Sec" />
          </div>
          <p
            className="text-center font-[family-name:var(--font-eyebrow)] text-[length:var(--text-2xs)] uppercase tracking-[0.16em]"
            style={{ color: "var(--fg-muted)" }}
          >
            June 3&ndash;7, 2026 &middot; St. George, Utah
          </p>
        </div>
      </section>
    </>
  );
}
