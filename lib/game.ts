import { BUG_TYPES, BugType } from "@/data/bug-types";
import { Scenario } from "@/data/scenarios";

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  scenario: Scenario;
  hintsRevealed: number; // 1–6
  guesses: string[]; // bug IDs guessed so far
  status: GameStatus;
  submitted: boolean;
}

export function initGame(scenario: Scenario): GameState {
  return {
    scenario,
    hintsRevealed: 1,
    guesses: [],
    status: "playing",
    submitted: false,
  };
}

export function revealNextHint(state: GameState): GameState {
  if (state.hintsRevealed >= 6) return state;
  return { ...state, hintsRevealed: state.hintsRevealed + 1 };
}

export function submitGuess(state: GameState, bugId: string): GameState {
  if (state.submitted) return state;
  const correct = bugId === state.scenario.bugId;
  return {
    ...state,
    guesses: [...state.guesses, bugId],
    submitted: true,
    status: correct ? "won" : "lost",
  };
}

// Fuzzy search over canonical bug types
export function searchBugTypes(query: string): BugType[] {
  if (!query.trim()) return BUG_TYPES.slice(0, 8);
  const q = query.toLowerCase();
  return BUG_TYPES.filter(
    (b) =>
      b.label.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q)
  ).slice(0, 8);
}

export function getBugById(id: string): BugType | undefined {
  return BUG_TYPES.find((b) => b.id === id);
}

// Wordle-style share text
export function buildShareText(state: GameState): string {
  const { hintsRevealed, status, scenario } = state;
  const icon = status === "won" ? "🟢" : "🔴";
  const hintsUsed = status === "won" ? hintsRevealed : 6;
  const bars = Array.from({ length: 6 }, (_, i) =>
    i < hintsUsed ? (status === "won" && i === hintsUsed - 1 ? "🟩" : "⬛") : "⬜"
  ).join("");

  return [
    `Debugdle — ${scenario.title}`,
    `${icon} Hint ${hintsUsed}/6`,
    bars,
    "debugdle.app",
  ].join("\n");
}
