"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const TRIP_DATE = new Date("2026-07-16T08:00:00");

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

const highlights = [
  { title: "3 Rounds", desc: "Championship courses along the coast" },
  { title: "4 Nights", desc: "Luxury lodging, two to a suite" },
  { title: "19th Hole", desc: "Nightly gatherings. Stories optional." },
  { title: "The Cup", desc: "Bragging rights for the year" },
];

export default function Home() {
  const countdown = useCountdown(TRIP_DATE);

  return (
    <>
      {/* Hero */}
      <section className="relative z-1 py-24 md:py-36 text-center">
        <div className="container-base">
          <p className="eyebrow mb-6">Est. 2026</p>
          <h1
            className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.95] tracking-[-0.025em] mb-8"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 5.5rem)",
              color: "var(--fg-primary)",
            }}
          >
            The 19th<br />
            <span className="italic font-bold">Hole</span>
          </h1>
          <div className="gold-rule-ornament mb-8" style={{ color: "var(--accent)", fontSize: "var(--text-sm)" }}>
            &#9873;
          </div>
          <p
            className="font-[family-name:var(--font-body)] text-[length:var(--text-md)] leading-[1.7] max-w-[56ch] mx-auto"
            style={{ color: "var(--fg-secondary)" }}
          >
            A tradition among friends. Stories that last a lifetime.
          </p>
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
            July 16 &ndash; 20, 2026 &middot; Bandon Dunes, Oregon
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="section">
        <div className="container-base">
          <p className="eyebrow text-center mb-4">The Trip</p>
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-2xl)] text-center mb-12 leading-[1.1]"
            style={{ color: "var(--fg-primary)" }}
          >
            Good rounds. Great company.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((h) => (
              <div key={h.title} className="card text-center">
                <div style={{ color: "var(--accent)", fontSize: "var(--text-md)", marginBottom: "var(--space-4)" }}>&#9873;</div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)] mb-3"
                  style={{ color: "var(--fg-primary)" }}
                >
                  {h.title}
                </h3>
                <p
                  className="font-[family-name:var(--font-body)] text-[length:var(--text-sm)]"
                  style={{ color: "var(--fg-secondary)" }}
                >
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tagline + CTA */}
      <section className="section">
        <div className="container-narrow text-center">
          <Image
            src="/assets/assets/logo-primary.png"
            alt="The 19th Hole primary logo"
            width={240}
            height={120}
            className="mx-auto mb-10 object-contain"
          />
          <p
            className="font-[family-name:var(--font-display)] italic text-[length:var(--text-xl)] md:text-[length:var(--text-2xl)] leading-[1.25] mb-10"
            style={{ color: "var(--fg-primary)" }}
          >
            &ldquo;Lost Balls. Found Memories.&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/rsvp" className="btn-primary no-underline">
              RSVP Now
            </Link>
            <Link href="/itinerary" className="btn-ghost no-underline">
              View Itinerary
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
