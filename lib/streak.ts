import type { PlayRecord } from "@/lib/plays";

export interface StreakInfo {
  streak: number;
  lastPlayed: string | null;
}

function localDate(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round(
    (new Date(a).getTime() - new Date(b).getTime()) / msPerDay
  );
}

/**
 * Pure function: compute streak from plays sorted by date descending.
 * Only counts consecutive *winning* days. A break in the chain resets.
 */
export function computeStreakFromPlays(
  plays: PlayRecord[]
): StreakInfo {
  const today = localDate();
  const wonPlays = plays
    .filter((p) => p.won)
    .sort((a, b) => b.played_date.localeCompare(a.played_date));

  if (wonPlays.length === 0) return { streak: 0, lastPlayed: null };

  const lastPlayed = wonPlays[0].played_date;
  const daysSinceLast = daysBetween(today, lastPlayed);

  // Streak broken if last win was more than 1 day ago
  if (daysSinceLast > 1) return { streak: 0, lastPlayed };

  let streak = 1;
  for (let i = 1; i < wonPlays.length; i++) {
    const gap = daysBetween(wonPlays[i - 1].played_date, wonPlays[i].played_date);
    if (gap === 1) {
      streak++;
    } else {
      break;
    }
  }

  return { streak, lastPlayed };
}
