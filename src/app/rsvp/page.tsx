import { PageHeader } from "../components/PageHeader";

type Attendee = {
  name: string;
  captain?: boolean;
};

const attendees: Attendee[] = [
  { name: "Dan Rackley", captain: true },
  { name: "David McClain" },
  { name: "Ryan Blake" },
  { name: "Casey Costa" },
  { name: "Ryan Roth" },
  { name: "Grant Anderson" },
  { name: "Casper Heuckroth" },
  { name: "Eric Mehrten" },
];

function GolfFlag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 22 L8 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M8 4 Q14 5 18 7 Q14 9 8 10 Z" fill="currentColor" />
      <circle cx="8" cy="3" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function RSVPPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Squad"
        title="RSVP"
        subtitle="Eight confirmed. See you in Utah."
      />

      <section className="section">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-6">
            <p className="eyebrow">Confirmed Attendees</p>
            <span className="tag tag-sage">8 / 8</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attendees.map((a) => (
              <div
                key={a.name}
                className="card flex items-center justify-between gap-4"
                style={{ padding: "var(--space-4) var(--space-5)" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>
                    <GolfFlag />
                  </span>
                  <div>
                    <p
                      className="font-[family-name:var(--font-body)] font-medium text-[length:var(--text-sm)]"
                      style={{ color: "var(--fg-primary)" }}
                    >
                      {a.name}
                    </p>
                    {a.captain && (
                      <p
                        className="font-[family-name:var(--font-eyebrow)] font-semibold uppercase text-[length:var(--text-3xs)] tracking-[0.12em]"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        Captain
                      </p>
                    )}
                  </div>
                </div>
                <span className="tag tag-sage flex-shrink-0">Confirmed</span>
              </div>
            ))}
          </div>

          <div
            className="mt-8 pt-6"
            style={{ borderTop: "0.5px solid var(--border-subtle)" }}
          >
            <p
              className="font-[family-name:var(--font-display)] italic text-[length:var(--text-lg)] text-center"
              style={{ color: "var(--fg-secondary)" }}
            >
              &ldquo;Any course. Every year.&rdquo;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
