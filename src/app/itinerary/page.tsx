import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Itinerary — The 19th Hole",
};

const days = [
  {
    day: "Day 1 — Thursday, June 18",
    events: [
      { time: "10:00 AM", activity: "Arrival & Check-in", location: "Pinehurst Resort", notes: "Cottages assigned at front desk" },
      { time: "12:30 PM", activity: "Practice Round", location: "Course No. 4", notes: "Walking only, caddies optional" },
      { time: "5:00 PM", activity: "Welcome Reception", location: "The Deuce Lounge", notes: "Dress: smart casual" },
      { time: "7:30 PM", activity: "Kick-off Dinner", location: "The Carolina Dining Room", notes: "Toasts & pairings draw" },
    ],
  },
  {
    day: "Day 2 — Friday, June 19",
    events: [
      { time: "7:00 AM", activity: "Breakfast", location: "The Carolina", notes: "Full buffet" },
      { time: "8:30 AM", activity: "Round 1 — Stroke Play", location: "Course No. 2", notes: "Shotgun start, riding carts" },
      { time: "1:30 PM", activity: "Lunch & Scorecards", location: "The Deuce Lounge", notes: "Closest-to-pin prizes" },
      { time: "3:00 PM", activity: "Free Time", location: "Resort grounds", notes: "Pool, spa, putting green" },
      { time: "7:00 PM", activity: "BBQ & Awards", location: "Clubhouse Patio", notes: "Day 1 leader announced" },
    ],
  },
  {
    day: "Day 3 — Saturday, June 20",
    events: [
      { time: "7:00 AM", activity: "Breakfast", location: "The Carolina", notes: "" },
      { time: "8:30 AM", activity: "Round 2 — Match Play", location: "Course No. 8", notes: "Pairings per draw" },
      { time: "1:00 PM", activity: "Lunch", location: "The Deuce Lounge", notes: "Results & standings" },
      { time: "3:00 PM", activity: "Fun Round — Scramble", location: "The Cradle (Par 3)", notes: "Teams of 4" },
      { time: "7:30 PM", activity: "Champions Dinner", location: "1895 Grille", notes: "Trophy, roasts, toasts" },
    ],
  },
  {
    day: "Day 4 — Sunday, June 21",
    events: [
      { time: "8:00 AM", activity: "Farewell Breakfast", location: "The Carolina", notes: "Recap & next-year vote" },
      { time: "10:00 AM", activity: "Check-out & Departure", location: "Pinehurst Resort", notes: "Until next year" },
    ],
  },
];

export default function ItineraryPage() {
  return (
    <>
      <section style={{ padding: "var(--space-8) 0 var(--space-4)", textAlign: "center" }}>
        <div className="container-narrow">
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            June 18–21, 2026
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "var(--text-3xl)",
              color: "var(--fg-primary)",
              marginBottom: "var(--space-3)",
            }}
          >
            The Itinerary
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)", fontSize: "var(--text-base)" }}>
            Four days. Three rounds. One tradition.
          </p>
        </div>
      </section>

      {days.map((day, i) => (
        <section key={i} className="section">
          <div className="container-base">
            {i > 0 && (
              <div className="gold-rule-ornament" style={{ marginBottom: "var(--space-7)" }}>
                <span style={{ color: "var(--accent)", fontSize: "var(--text-sm)" }}>⚑</span>
              </div>
            )}
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "var(--text-xl)",
                color: "var(--fg-primary)",
                marginBottom: "var(--space-5)",
              }}
            >
              {day.day}
            </h2>
            <table className="brand-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Activity</th>
                  <th>Location</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {day.events.map((event, j) => (
                  <tr key={j}>
                    <td style={{ whiteSpace: "nowrap", fontFamily: "var(--font-eyebrow)", fontWeight: 500, fontSize: "var(--text-xs)" }}>
                      {event.time}
                    </td>
                    <td style={{ fontWeight: 500 }}>{event.activity}</td>
                    <td style={{ color: "var(--fg-muted)" }}>{event.location}</td>
                    <td style={{ color: "var(--fg-muted)", fontStyle: "italic", fontSize: "var(--text-xs)" }}>
                      {event.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
