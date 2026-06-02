"use client";

import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
// Modal using state div

// Types
type Team = "team1" | "team2";
type RoundStatus = "locked" | "matchup_setting" | "in_play" | "final";
type MatchResult = "team1" | "team2" | "tie" | null;
type PickingTeam = Team | "mutual";

interface Player { name: string; hcp: number; team: Team; }

interface Match {
  id: number;
  team1_players: string[]; // names
  team2_players: string[];
  result: MatchResult;
  score_notes: string;
  team1_points: number;
  team2_points: number;
}

interface Round {
  number: number;
  course: string;
  format: "four-ball" | "singles";
  points_available: number;
  state: RoundStatus;
  picking_team: PickingTeam;
  matches: Match[];
  round_winner: "team1" | "team2" | "tie" | null;
  round_points_team1: number;
  round_points_team2: number;
}

interface TournamentState {
  score_team1: number;
  score_team2: number;
  winner: Team | null;
  lastPickerTeam: Team | null;
  rounds: Round[];
}

const STORAGE_KEY = "19th-hole-cup-2026-r1";

const TEAM_NAMES = { team1: "McClain", team2: "Costa" };

const PLAYERS: Record<Team, Player[]> = {
  team1: [
    { name: "David McClain", hcp: 2, team: "team1" },
    { name: "Grant Anderson", hcp: 2, team: "team1" },
    { name: "Dan Rackley", hcp: 10, team: "team1" },
    { name: "Casper Heuckroth", hcp: 18, team: "team1" },
  ],
  team2: [
    { name: "Casey Costa", hcp: 1, team: "team2" },
    { name: "Ryan Blake", hcp: 12, team: "team2" },
    { name: "Eric Mehrten", hcp: 16, team: "team2" },
    { name: "Ryan Roth", hcp: 18, team: "team2" },
  ],
};

const ROUNDS_DATA = [
  { number: 1, course: "Black Desert", format: "four-ball" as const, points_available: 2 },
  { number: 2, course: "The Ledges", format: "singles" as const, points_available: 4 },
  { number: 3, course: "The Ledges", format: "four-ball" as const, points_available: 2 },
  { number: 4, course: "Wolf Creek", format: "singles" as const, points_available: 4 },
  { number: 5, course: "Sand Hollow", format: "four-ball" as const, points_available: 2 },
  { number: 6, course: "Copper Rock", format: "singles" as const, points_available: 4 },
];

function createEmptyMatches(format: "four-ball" | "singles"): Match[] {
  const playersPerMatch = format === "four-ball" ? 2 : 1;
  const matchCount = format === "four-ball" ? 2 : 4;
  return Array.from({ length: matchCount }, (_, i) => ({
    id: i + 1,
    team1_players: Array(playersPerMatch).fill(""),
    team2_players: Array(playersPerMatch).fill(""),
    result: null,
    score_notes: "",
    team1_points: 0,
    team2_points: 0,
  }));
}

function normalizeRound(round: Round, index: number): Round {
  const base = ROUNDS_DATA[index];
  const empty = createEmptyMatches(base.format);
  const normalizedMatches = empty.map((blank, matchIndex) => {
    const existing = round?.matches?.[matchIndex];
    if (!existing) return blank;
    return {
      ...blank,
      ...existing,
      id: matchIndex + 1,
      team1_players: blank.team1_players.map((_, slot) => existing.team1_players?.[slot] ?? ""),
      team2_players: blank.team2_players.map((_, slot) => existing.team2_players?.[slot] ?? ""),
    };
  });

  return {
    ...base,
    ...round,
    matches: normalizedMatches,
    state: round?.state ?? (index === 0 ? "matchup_setting" : "locked"),
    picking_team: round?.picking_team ?? (index === 0 ? "mutual" : "team1"),
    round_winner: round?.round_winner ?? null,
    round_points_team1: round?.round_points_team1 ?? 0,
    round_points_team2: round?.round_points_team2 ?? 0,
  };
}

function normalizeState(state: TournamentState): TournamentState {
  return {
    ...state,
    rounds: ROUNDS_DATA.map((_, index) => normalizeRound(state.rounds?.[index] as Round, index)),
  };
}

function initialState(): TournamentState {
  const rounds = ROUNDS_DATA.map((data, index) => {
    const matches = createEmptyMatches(data.format);
    // Day 1 (Round 1) matchups set by captains
    if (index === 0) {
      matches[0].team1_players = ["David McClain", "Grant Anderson"];
      matches[0].team2_players = ["Casey Costa", "Eric Mehrten"];
      matches[1].team1_players = ["Dan Rackley", "Casper Heuckroth"];
      matches[1].team2_players = ["Ryan Blake", "Ryan Roth"];
    }
    return {
      ...data,
      state: (index === 0 ? "in_play" : "locked") as RoundStatus,
      picking_team: (index === 0 ? "mutual" : "team1") as PickingTeam,
      matches,
      round_winner: null,
      round_points_team1: 0,
      round_points_team2: 0,
    };
  });
  return {
    score_team1: 0,
    score_team2: 0,
    winner: null,
    lastPickerTeam: null,
    rounds,
  };
}

function getStrokesGiven(hcp1: number, hcp2: number): number {
  return Math.max(0, hcp2 - hcp1);
}

function validateMatchups(round: Round, _playersUsed: Record<Team, Set<string>>): boolean {
  const { format, matches } = round;
  const team1Used = new Set<string>();
  const team2Used = new Set<string>();

  for (const match of matches) {
    if (format === "four-ball") {
      if (match.team1_players.length !== 2 || match.team2_players.length !== 2) return false;
      for (const p of match.team1_players) team1Used.add(p);
      for (const p of match.team2_players) team2Used.add(p);
    } else {
      if (match.team1_players.length !== 1 || match.team2_players.length !== 1) return false;
      team1Used.add(match.team1_players[0]);
      team2Used.add(match.team2_players[0]);
    }
  }

  if (team1Used.size !== 4 || team2Used.size !== 4) return false;

  const allTeam1 = PLAYERS.team1.map(p => p.name);
  const allTeam2 = PLAYERS.team2.map(p => p.name);

  for (const name of team1Used) if (!allTeam1.includes(name)) return false;
  for (const name of team2Used) if (!allTeam2.includes(name)) return false;

  return true;
}

function determineNextPickingTeam(currentState: TournamentState, roundIndex: number): PickingTeam {
  if (roundIndex === 0) return "mutual";
  const prevRound = currentState.rounds[roundIndex - 1];
  if (prevRound.round_winner === "tie") {
    // team currently trailing picks
    if (currentState.score_team1 < currentState.score_team2) return "team1";
    if (currentState.score_team2 < currentState.score_team1) return "team2";
    // if tied, team that picked least recently - but for simplicity, alternate or something
    return currentState.lastPickerTeam === "team1" ? "team2" : "team1";
  }
  const loser = prevRound.round_winner === "team1" ? "team2" : "team1";
  return loser;
}

function calculateRoundPoints(matches: Match[]): { team1: number; team2: number; winner: "team1" | "team2" | "tie" | null } {
  let team1Pts = 0;
  let team2Pts = 0;
  for (const match of matches) {
    if (match.result === "team1") team1Pts += 1;
    else if (match.result === "team2") team2Pts += 1;
    else if (match.result === "tie") {
      team1Pts += 0.5;
      team2Pts += 0.5;
    }
  }
  const total = team1Pts + team2Pts;
  let winner: "team1" | "team2" | "tie" | null = null;
  if (team1Pts > team2Pts) winner = "team1";
  else if (team2Pts > team1Pts) winner = "team2";
  else if (total > 0) winner = "tie";
  return { team1: team1Pts, team2: team2Pts, winner };
}

function finalizeRound(state: TournamentState, roundIndex: number): TournamentState {
  const round = { ...state.rounds[roundIndex] };
  const points = calculateRoundPoints(round.matches);
  round.round_points_team1 = points.team1;
  round.round_points_team2 = points.team2;
  round.round_winner = points.winner;
  round.state = "final";

  const newTotal1 = state.score_team1 + points.team1;
  const newTotal2 = state.score_team2 + points.team2;
  let newWinner: Team | null = null;
  if (newTotal1 >= 9.5) newWinner = "team1";
  else if (newTotal2 >= 9.5) newWinner = "team2";

  const updatedRounds = [...state.rounds];
  updatedRounds[roundIndex] = round;

  let nextPicking = state.lastPickerTeam;
  if (roundIndex < 5) {
    nextPicking = determineNextPickingTeam({ ...state, rounds: updatedRounds }, roundIndex + 1) as Team;
    updatedRounds[roundIndex + 1].picking_team = nextPicking;
    updatedRounds[roundIndex + 1].state = "matchup_setting";
  }

  return {
    ...state,
    score_team1: newTotal1,
    score_team2: newTotal2,
    winner: newWinner,
    lastPickerTeam: nextPicking,
    rounds: updatedRounds,
  };
}

export default function CupPage() {
  const [tournamentState, setTournamentState] = useState<TournamentState>(initialState());
  const [captainMode, setCaptainMode] = useState(false);
  const [showCaptainPrompt, setShowCaptainPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedRoundMatch, setSelectedRoundMatch] = useState<{ round: number; match: number } | null>(null);
  const [availablePlayers, setAvailablePlayers] = useState<Record<Team, string[]>>(() => ({
    team1: PLAYERS.team1.map(p => p.name),
    team2: PLAYERS.team2.map(p => p.name),
  }));

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTournamentState(normalizeState(parsed));
      } catch (e) {
        console.error("Invalid stored state");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournamentState));
  }, [tournamentState]);

  const toggleCaptainMode = () => {
    if (captainMode) {
      setCaptainMode(false);
    } else {
      setShowCaptainPrompt(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "boyz2026") {
      setCaptainMode(true);
      setShowCaptainPrompt(false);
      setPassword("");
    } else {
      alert("Incorrect password");
    }
  };

  const getAvailablePlayersForRound = (roundIndex: number) => {
    const round = tournamentState.rounds[roundIndex];
    const usedTeam1 = new Set<string>();
    const usedTeam2 = new Set<string>();
    round.matches.forEach(match => {
      match.team1_players.filter(Boolean).forEach(p => usedTeam1.add(p));
      match.team2_players.filter(Boolean).forEach(p => usedTeam2.add(p));
    });
    return {
      team1: PLAYERS.team1.map(p => p.name).filter(name => !usedTeam1.has(name)),
      team2: PLAYERS.team2.map(p => p.name).filter(name => !usedTeam2.has(name)),
    };
  };

  const getPlayerOptions = (roundIndex: number, team: Team, currentName: string) => {
    const available = getAvailablePlayersForRound(roundIndex)[team];
    return PLAYERS[team]
      .map((p) => p.name)
      .filter((name) => name === currentName || available.includes(name));
  };

  const setMatchupPlayer = (
    roundIndex: number,
    matchId: number,
    team: Team,
    playerIndex: number,
    playerName: string
  ) => {
    setTournamentState(prev => {
      const newRounds = [...prev.rounds];
      const round = { ...newRounds[roundIndex] };
      const match = round.matches.find(m => m.id === matchId);
      if (!match) return prev;
      const players = [...(team === "team1" ? match.team1_players : match.team2_players)];
      players[playerIndex] = playerName;
      if (team === "team1") match.team1_players = players;
      else match.team2_players = players;
      newRounds[roundIndex] = round;
      return { ...prev, rounds: newRounds };
    });
  };

  const lockMatchups = (roundIndex: number) => {
    const round = tournamentState.rounds[roundIndex];
    const used = {
      team1: new Set(round.matches.flatMap(m => m.team1_players)),
      team2: new Set(round.matches.flatMap(m => m.team2_players)),
    };
    if (used.team1.size !== 4 || used.team2.size !== 4) {
      alert("Invalid matchups: All players must play exactly once.");
      return;
    }
    setTournamentState(prev => {
      const newRounds = [...prev.rounds];
      newRounds[roundIndex].state = "in_play";
      return { ...prev, rounds: newRounds };
    });
  };

  const setMatchResult = (roundIndex: number, matchId: number, result: MatchResult, notes: string) => {
    setTournamentState(prev => {
      const newRounds = [...prev.rounds];
      const match = newRounds[roundIndex].matches.find(m => m.id === matchId);
      if (match) {
        match.result = result;
        match.score_notes = notes;
        const points = calculateRoundPoints(newRounds[roundIndex].matches);
                // Per match points
        if (match.result === "team1") {
          match.team1_points = 1;
          match.team2_points = 0;
        } else if (match.result === "team2") {
          match.team1_points = 0;
          match.team2_points = 1;
        } else if (match.result === "tie") {
          match.team1_points = 0.5;
          match.team2_points = 0.5;
        }
      }
      return { ...prev, rounds: newRounds };
    });
  };

  const canFinalizeRound = (roundIndex: number) => {
    const round = tournamentState.rounds[roundIndex];
    return round.state === "in_play" && round.matches.every(m => m.result !== null);
  };

  const finalizeCurrentRound = (roundIndex: number) => {
    if (!canFinalizeRound(roundIndex)) return;
    setTournamentState(finalizeRound(tournamentState, roundIndex));
  };

  const resetTournament = () => {
    if (confirm("Reset the entire tournament?")) {
      localStorage.removeItem(STORAGE_KEY);
      setTournamentState(initialState());
      setCaptainMode(false);
    }
  };

  const currentPickingOrder = tournamentState.rounds.map((r, i) => {
    if (r.picking_team === "mutual") {
      return "Mutual";
    }
    return `Team ${TEAM_NAMES[r.picking_team as Team]}`;
    if (r.state === "final") {
      const winner = r.round_winner;
      const nextPicker = determineNextPickingTeam(tournamentState, i + 1);
      return `TBD (after ${winner ? `Team ${TEAM_NAMES[winner as Team]} wins` : "tie"})`;
    }
    return "TBD";
  });

  const pointsRemaining = 18 - (tournamentState.score_team1 + tournamentState.score_team2);

  return (
    <>
      <PageHeader
        eyebrow="EST. 2026 · ST. GEORGE, UT"
        title="The Cup"
        subtitle="loser picks. winner sweats."
      />

      {/* Live Scoreboard */}
      <section className="sticky top-[68px] z-10 bg-[var(--bg-page)] border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="container-base py-4">
          <div className="text-center">
            <div className="flex justify-center items-center gap-8 mb-2">
              <span className="font-[family-name:var(--font-display)] text-3xl" style={{ color: "var(--color-gold)" }}>TEAM McCLAIN</span>
              <span className="text-4xl font-bold" style={{ color: "var(--fg-primary)" }}>{tournamentState.score_team1} — {tournamentState.score_team2}</span>
              <span className="font-[family-name:var(--font-display)] text-3xl" style={{ color: "var(--color-gold)" }}>TEAM COSTA</span>
            </div>
            {tournamentState.winner ? (
              <div className="text-2xl font-bold mb-2 animate-pulse" style={{ color: "var(--color-gold)" }}>
                🏆 TEAM {TEAM_NAMES[tournamentState.winner as Team].toUpperCase()} WINS THE CUP
              </div>
            ) : (
              <div className="eyebrow mb-1" style={{ color: "var(--color-gold)" }}>FIRST TO 9.5 WINS THE CUP</div>
            )}
            <div className="text-sm" style={{ color: "var(--fg-muted)" }}>{pointsRemaining} points remaining</div>
          </div>
          <button onClick={toggleCaptainMode} className="btn-gold mt-4 ml-auto block">
            {captainMode ? "Exit Captain Mode" : "Captain Mode"}
          </button>
        </div>
      </section>

      {/* Picking Order Tracker */}
      <section className="section">
        <div className="container-base">
          <p className="eyebrow mb-4">Picking Order</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {currentPickingOrder.map((picker, i) => (
              <div key={i} className="tag tag-forest px-4 py-2">
                R{i+1}: {picker}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Round Cards */}
      <section className="section">
        <div className="container-base space-y-6">
          {tournamentState.rounds.map((round, index) => (
            <div key={round.number} className={`card ${round.state === "matchup_setting" ? "border-gold" : round.state === "final" ? "border-forest" : ""}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl">Round {round.number}: {round.course}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`tag ${round.format === "four-ball" ? "tag-sage" : "tag-navy"}`}>{round.format.toUpperCase()}</span>
                    <span className="tag tag-gold">{round.points_available} PTS</span>
                  </div>
                </div>
                <div className="text-right">
                  {round.state === "final" && round.round_winner && (
                    <div className="font-bold text-lg" style={{ color: "var(--color-gold)" }}>
                      {round.round_winner === "team1" ? "TEAM McCLAIN WINS" : "TEAM COSTA WINS"}
                    </div>
                  )}
                  {round.state === "final" && (
                    <div className="text-sm" style={{ color: "var(--fg-muted)" }}>
                      {round.round_points_team1} — {round.round_points_team2}
                    </div>
                  )}
                </div>
              </div>

              {round.state === "locked" && (
                <p className="text-center py-8 italic" style={{ color: "var(--fg-muted)" }}>Awaiting Round {round.number - 1} result</p>
              )}

              {round.state === "matchup_setting" && (
                <div>
                  <p className="eyebrow mb-4 text-center">
                    {round.picking_team === "mutual" ? "Mutual" : `Team ${TEAM_NAMES[round.picking_team]} is setting matchups`}
                  </p>
                  {round.matches.map(match => (
                    <div key={match.id} className="border-b py-4 last:border-b-0">
                      <h4 className="font-semibold mb-2">Match {match.id}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label>Team McClain ({round.format === "four-ball" ? "2 players" : "1 player"})</label>
                          {Array(round.format === "four-ball" ? 2 : 1).fill(0).map((_, pIdx) => (
                            <select
                              key={pIdx}
                              value={match.team1_players[pIdx] || ""}
                              onChange={(e) => setMatchupPlayer(index, match.id, "team1", pIdx, e.target.value)}
                              className="w-full mt-1 p-2 border rounded"
                              disabled={!captainMode}
                            >
                              <option value="">Select player</option>
                              {getPlayerOptions(index, "team1", match.team1_players[pIdx] || "").map(name => (
                                <option key={name} value={name}>{name} (HCP {PLAYERS.team1.find(p => p.name === name)?.hcp})</option>
                              ))}
                            </select>
                          ))}
                        </div>
                        <div>
                          <label>Team Costa ({round.format === "four-ball" ? "2 players" : "1 player"})</label>
                          {Array(round.format === "four-ball" ? 2 : 1).fill(0).map((_, pIdx) => (
                            <select
                              key={pIdx}
                              value={match.team2_players[pIdx] || ""}
                              onChange={(e) => setMatchupPlayer(index, match.id, "team2", pIdx, e.target.value)}
                              className="w-full mt-1 p-2 border rounded"
                              disabled={!captainMode}
                            >
                              <option value="">Select player</option>
                              {getPlayerOptions(index, "team2", match.team2_players[pIdx] || "").map(name => (
                                <option key={name} value={name}>{name} (HCP {PLAYERS.team2.find(p => p.name === name)?.hcp})</option>
                              ))}
                            </select>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  {captainMode && (
                    <button onClick={() => lockMatchups(index)} className="btn-primary w-full mt-4" disabled={!(() => {
      const r = tournamentState.rounds[index];
      const used = {
        team1: new Set(r.matches.flatMap(m => m.team1_players)),
        team2: new Set(r.matches.flatMap(m => m.team2_players)),
      };
      return validateMatchups(r, used);
    })()}>
                      Lock Matchups
                    </button>
                  )}
                </div>
              )}

              {round.state === "in_play" && (
                <div>
                  <p className="eyebrow mb-4 text-center">Round in Play</p>
                  {round.matches.map(match => (
                    <div key={match.id} className="border-b py-4 last:border-b-0 cursor-pointer" onClick={() => setSelectedRoundMatch({round: round.number, match: match.id})}>
                      <h4 className="font-semibold mb-2">Match {match.id}: {match.team1_players.join(" & ")} vs {match.team2_players.join(" & ")}</h4>
                      <select 
                        value={match.result || ""}
                        onChange={(e) => setMatchResult(index, match.id, e.target.value as MatchResult || null, match.score_notes)}
                        className="mr-2"
                      >
                        <option value="">Set Result</option>
                        <option value="team1">Team McClain Wins</option>
                        <option value="team2">Team Costa Wins</option>
                        <option value="tie">Tie</option>
                      </select>
                      <input
                        type="text"
                        value={match.score_notes}
                        onChange={(e) => setMatchResult(index, match.id, match.result, e.target.value)}
                        placeholder="e.g. 2&1"
                        className="ml-2 p-1 border rounded"
                      />
                    </div>
                  ))}
                  {canFinalizeRound(index) && (
                    <button onClick={() => finalizeCurrentRound(index)} className="btn-gold w-full mt-4">
                      Finalize Round
                    </button>
                  )}
                </div>
              )}

              {round.state === "final" && (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold" style={{ color: "var(--fg-primary)" }}>
                    {round.round_points_team1} — {round.round_points_team2}
                  </p>
                  {round.matches.map(match => (
                    <div key={match.id} className="text-sm mt-1" style={{ color: "var(--fg-muted)" }}>
                      Match {match.id}: {match.team1_players.join(" & ")} vs {match.team2_players.join(" & ")} ({match.score_notes}) - {match.result === "team1" ? "McClain" : match.result === "team2" ? "Costa" : "Tie"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Match Detail Modal */}
      {selectedRoundMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Match Details</h3>
            <p>Round {selectedRoundMatch.round}, Match {selectedRoundMatch.match}</p>
            <button onClick={() => setSelectedRoundMatch(null)} className="mt-4 btn-primary w-full">Close</button>
          </div>
        </div>
      )}

      {/* Captain Password Prompt */}
      {showCaptainPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3>Captain Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded mt-2"
                placeholder="Enter password"
              />
              <button type="submit" className="btn-primary w-full mt-2">Unlock</button>
              <button type="button" onClick={() => setShowCaptainPrompt(false)} className="btn-ghost w-full mt-1">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Rules Accordion - assume a simple section */}
      <section className="section">
        <div className="container-narrow">
          <details className="mb-8">
            <summary className="cursor-pointer font-semibold mb-2" style={{ color: "var(--color-gold)" }}>Tournament Rules</summary>
            <div className="mt-4 space-y-2 text-sm" style={{ color: "var(--fg-primary)" }}>
              <p><strong>Points:</strong> 1 pt per match win, 0.5 for tie. Total 18 pts, 9.5 to win.</p>
              <p><strong>Loser Picks:</strong> Losing team picks all matchups for next round. Ties follow overall score or recency.</p>
              <p>Round 1 mutual. 9-9 overall tie retains cup for defending champion.</p>
              <ul className="list-disc pl-5">
                <li>Four-Ball: 2 matches, 2v2, all play once</li>
                <li>Singles: 4 matches, 1v1, all play once</li>
              </ul>
            </div>
          </details>
          <button onClick={resetTournament} className="btn-ghost">Reset Tournament</button>
        </div>
      </section>

      {captainMode && <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded">Captain Mode Active</div>}
    </>
  );
}