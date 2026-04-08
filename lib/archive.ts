import { createClient } from "@/lib/supabase/client";
import { getLocalPlays, type PlayRecord } from "@/lib/plays";

export type PuzzleStatus =
  | { kind: "unplayed" }
  | { kind: "solved";    hintsUsed: number; onTime: boolean }
  | { kind: "failed";    hintsUsed: number; onTime: boolean };

export interface PuzzleEntry {
  puzzleNumber: number;
  puzzleDate:   string; // YYYY-MM-DD
  scenarioId:   string;
  status:       PuzzleStatus;
}

function deriveStatus(
  play: (PlayRecord & { created_at?: string }) | undefined,
  puzzleDate: string
): PuzzleStatus {
  if (!play) return { kind: "unplayed" };

  // on-time = played the same calendar day as the puzzle was scheduled
  const playedDay = play.created_at
    ? play.created_at.slice(0, 10)
    : play.played_date;
  const onTime = playedDay === puzzleDate;

  return play.won
    ? { kind: "solved", hintsUsed: play.hints_used, onTime }
    : { kind: "failed", hintsUsed: play.hints_used, onTime };
}

export async function getArchive(userId: string | null): Promise<PuzzleEntry[]> {
  const supabase = createClient();
  const today = new Date().toLocaleDateString("en-CA");

  // Fetch all past puzzle schedule entries (up to and including today)
  const { data: schedule } = await supabase
    .from("puzzle_schedule")
    .select("puzzle_number, puzzle_date, scenario_id")
    .lte("puzzle_date", today)
    .order("puzzle_date", { ascending: false })
    .limit(365);

  if (!schedule || schedule.length === 0) return [];

  // Fetch plays keyed by puzzle date
  let playMap = new Map<string, PlayRecord & { created_at?: string }>();

  if (userId) {
    const { data: plays } = await supabase
      .from("plays")
      .select("played_date, scenario_id, hints_used, won, created_at")
      .eq("user_id", userId)
      .in("played_date", schedule.map((s) => s.puzzle_date));

    for (const p of plays ?? []) {
      playMap.set(p.played_date, p as PlayRecord & { created_at?: string });
    }
  } else {
    // Anonymous: use localStorage
    const local = getLocalPlays();
    for (const p of local) {
      playMap.set(p.played_date, p);
    }
  }

  return schedule.map((s) => ({
    puzzleNumber: s.puzzle_number,
    puzzleDate:   s.puzzle_date,
    scenarioId:   s.scenario_id,
    status:       deriveStatus(playMap.get(s.puzzle_date), s.puzzle_date),
  }));
}
