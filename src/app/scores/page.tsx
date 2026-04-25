"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";

type PlayerScores = {
  name: string;
  handicap: number;
  rounds: (number | null)[];
};

const ROUND_COUNT = 6;

const INITIAL_PLAYERS: PlayerScores[] = [
  { name: "Dan Rackley", handicap: 14, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "David McClain", handicap: 12, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Ryan Blake", handicap: 10, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Casey Costa", handicap: 16, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Ryan Roth", handicap: 18, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Grant Anderson", handicap: 8, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Casper Heuckroth", handicap: 20, rounds: Array(ROUND_COUNT).fill(null) },
  { name: "Eric Mehrten", handicap: 15, rounds: Array(ROUND_COUNT).fill(null) },
];

const ROUNDS = [
  "Black Desert",
  "The Ledges",
  "Coral Canyon",
  "Wolf Creek",
  "Sand Hollow",
  "Copper Rock",
];

const STORAGE_KEY = "19th-hole-scores-utah";

export default function ScoresPage() {
  const [players, setPlayers] = useState<PlayerScores[]>(INITIAL_PLAYERS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPlayers(JSON.parse(stored));
      } catch {}
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    }
  }, [players, loaded]);

  const updateScore = (playerIdx: number, roundIdx: number, value: string) => {
    const num = value === "" ? null : parseInt(value, 10);
    if (value !== "" && isNaN(num as number)) return;
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === playerIdx
          ? { ...p, rounds: p.rounds.map((r, j) => (j === roundIdx ? num : r)) }
          : p
      )
    );
  };

  const grossTotal = (p: PlayerScores) =>
    p.rounds.reduce<number>((sum, r) => sum + (r ?? 0), 0);

  const netTotal = (p: PlayerScores) => {
    const played = p.rounds.filter((r) => r !== null).length;
    if (played === 0) return 0;
    return grossTotal(p) - Math.round((p.handicap * played) / ROUND_COUNT);
  };

  const sorted = [...players].sort((a, b) => {
    const aPlayed = a.rounds.some((r) => r !== null);
    const bPlayed = b.rounds.some((r) => r !== null);
    if (!aPlayed && !bPlayed) return 0;
    if (!aPlayed) return 1;
    if (!bPlayed) return -1;
    return netTotal(a) - netTotal(b);
  });

  const resetScores = () => {
    setPlayers(INITIAL_PLAYERS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      <PageHeader
        eyebrow="June 3–7, 2026 · Utah"
        title="Scores"
        subtitle="Track every round. Editable — click any cell to enter scores."
      />

      <section className="section">
        <div className="container-base">
          <div className="flex justify-between items-center mb-6">
            <p className="eyebrow">Scorecard</p>
            <button onClick={resetScores} className="btn-ghost text-[length:var(--text-3xs)]">
              Reset All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="brand-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Player</th>
                  <th>HCP</th>
                  {ROUNDS.map((r) => (
                    <th key={r}>{r}</th>
                  ))}
                  <th>Gross</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((player, rank) => {
                  const origIdx = players.indexOf(player);
                  const hasScores = player.rounds.some((r) => r !== null);
                  return (
                    <tr key={player.name}>
                      <td
                        className="font-[family-name:var(--font-display)] font-bold text-[length:var(--text-lg)]"
                        style={{ color: rank === 0 && hasScores ? "var(--color-gold)" : "var(--fg-muted)" }}
                      >
                        {hasScores ? rank + 1 : "—"}
                      </td>
                      <td className="font-semibold whitespace-nowrap">{player.name}</td>
                      <td>
                        <span className="tag tag-sage">{player.handicap}</span>
                      </td>
                      {player.rounds.map((score, rIdx) => (
                        <td key={rIdx} className="p-0">
                          <input
                            type="number"
                            min={60}
                            max={150}
                            value={score ?? ""}
                            onChange={(e) => updateScore(origIdx, rIdx, e.target.value)}
                            placeholder="—"
                            className="w-20 text-center py-2 px-1"
                            style={{
                              borderBottom: "0.5px solid var(--border-subtle)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "var(--text-sm)",
                            }}
                          />
                        </td>
                      ))}
                      <td className="font-[family-name:var(--font-mono)] font-semibold">
                        {hasScores ? grossTotal(player) : "—"}
                      </td>
                      <td
                        className="font-[family-name:var(--font-mono)] font-bold"
                        style={{ color: hasScores ? "var(--color-forest)" : "var(--fg-muted)" }}
                      >
                        {hasScores ? netTotal(player) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p
            className="mt-6 text-[length:var(--text-xs)] italic"
            style={{ color: "var(--fg-muted)" }}
          >
            Net = Gross &minus; (Handicap &times; Rounds Played / {ROUND_COUNT}). Scores saved to your browser.
          </p>
        </div>
      </section>
    </>
  );
}
