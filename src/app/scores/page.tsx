"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";

type PlayerScores = {
  name: string;
  handicap: number;
  rounds: (number | null)[];
};

const INITIAL_PLAYERS: PlayerScores[] = [
  { name: "Dan", handicap: 14, rounds: [null, null, null] },
  { name: "Mike", handicap: 8, rounds: [null, null, null] },
  { name: "Chris", handicap: 18, rounds: [null, null, null] },
  { name: "Jake", handicap: 11, rounds: [null, null, null] },
  { name: "Tom", handicap: 22, rounds: [null, null, null] },
  { name: "Will", handicap: 6, rounds: [null, null, null] },
];

const ROUNDS = ["Bandon Dunes", "Pacific Dunes", "Old Macdonald"];
const STORAGE_KEY = "19th-hole-scores";

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
    return grossTotal(p) - Math.round((p.handicap * played) / 3);
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
        eyebrow="The Leaderboard"
        title="Scores"
        subtitle="Track every round. Editable \u2014 click any cell to enter scores."
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
                        {hasScores ? rank + 1 : "\u2014"}
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
                            placeholder="\u2014"
                            className="w-20 text-center py-2 px-1"
                            style={{
                              borderBottom: "1px solid var(--border-subtle)",
                              fontFamily: "var(--font-mono)",
                              fontSize: "var(--text-sm)",
                            }}
                          />
                        </td>
                      ))}
                      <td className="font-[family-name:var(--font-mono)] font-semibold">
                        {hasScores ? grossTotal(player) : "\u2014"}
                      </td>
                      <td
                        className="font-[family-name:var(--font-mono)] font-bold"
                        style={{ color: hasScores ? "var(--color-forest)" : "var(--fg-muted)" }}
                      >
                        {hasScores ? netTotal(player) : "\u2014"}
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
            Net = Gross - (Handicap \u00d7 Rounds Played / 3). Scores saved to your browser.
          </p>
        </div>
      </section>
    </>
  );
}
