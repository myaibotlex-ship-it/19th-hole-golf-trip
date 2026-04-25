import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scores — The 19th Hole",
};

const players = [
  { name: "Mike Sullivan", handicap: 12, r1: 84, r2: "3 & 2", scramble: -2, standing: 1 },
  { name: "Dan Rackley", handicap: 8, r1: 79, r2: "1 up", scramble: -4, standing: 2 },
  { name: "Jake Morrison", handicap: 15, r1: 88, r2: "2 & 1", scramble: -2, standing: 3 },
  { name: "Chris Hartley", handicap: 10, r1: 82, r2: "Dormie", scramble: -3, standing: 4 },
  { name: "Tom Brennan", handicap: 18, r1: 92, r2: "A/S", scramble: -1, standing: 5 },
  { name: "Pete Nowak", handicap: 14, r1: 87, r2: "2 down", scramble: -3, standing: 6 },
];

export default function ScoresPage() {
  return (
    <>
      <section style={{ padding: "var(--space-8) 0 var(--space-4)", textAlign: "center" }}>
        <div className="container-narrow">
          <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>
            Leaderboard
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
            The Scores
          </h1>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--fg-muted)", fontSize: "var(--text-base)" }}>
            Where legends are made and excuses are born.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-base">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "var(--space-5)",
            }}
          >
            {players.map((player) => (
              <div
                key={player.name}
                className="card"
                style={{
                  borderTop: player.standing === 1 ? "3px solid var(--accent)" : "1px solid var(--border-subtle)",
                  position: "relative",
                }}
              >
                {player.standing <= 3 && (
                  <span
                    className="tag"
                    style={{
                      position: "absolute",
                      top: "var(--space-3)",
                      right: "var(--space-3)",
                      background: player.standing === 1 ? "var(--accent)" : "transparent",
                      color: player.standing === 1 ? "var(--fg-on-gold)" : "var(--accent)",
                      border: player.standing === 1 ? "none" : "1px solid var(--accent)",
                    }}
                  >
                    #{player.standing}
                  </span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "var(--text-lg)",
                    color: "var(--fg-primary)",
                    marginBottom: "var(--space-1)",
                  }}
                >
                  {player.name}
                </h3>
                <p className="eyebrow" style={{ marginBottom: "var(--space-4)", color: "var(--fg-muted)", fontSize: "var(--text-3xs)" }}>
                  Handicap: {player.handicap}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                    <span style={{ fontFamily: "var(--font-eyebrow)", fontSize: "var(--text-3xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--fg-muted)" }}>
                      Rd 1 — Stroke
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--fg-primary)" }}>{player.r1}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--space-2)" }}>
                    <span style={{ fontFamily: "var(--font-eyebrow)", fontSize: "var(--text-3xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--fg-muted)" }}>
                      Rd 2 — Match
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--fg-primary)" }}>{player.r2}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-eyebrow)", fontSize: "var(--text-3xs)", textTransform: "uppercase", letterSpacing: "var(--tracking-wider)", color: "var(--fg-muted)" }}>
                      Scramble
                    </span>
                    <span style={{ fontWeight: 600, color: "var(--fg-primary)" }}>{player.scramble}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
