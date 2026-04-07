import { createClient } from "@/lib/supabase/client";
import { PLAY_RECORDED_EVENT } from "@/hooks/useStreak";

export interface PlayRecord {
  played_date: string; // YYYY-MM-DD (user's local date)
  scenario_id: string;
  hints_used: number;
  won: boolean;
}

const LS_KEY = "debugdle_plays";

function localDate(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
}

// ── Local storage helpers ────────────────────────────────────────────────────

export function getLocalPlays(): PlayRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveLocalPlays(plays: PlayRecord[]): void {
  localStorage.setItem(LS_KEY, JSON.stringify(plays));
}

// ── Public API ───────────────────────────────────────────────────────────────

export function hasPlayedTodayLocally(): boolean {
  const today = localDate();
  return getLocalPlays().some((p) => p.played_date === today);
}

export async function hasPlayedToday(userId: string | null): Promise<boolean> {
  const today = localDate();

  if (!userId) return hasPlayedTodayLocally();

  const supabase = createClient();
  const { data } = await supabase
    .from("plays")
    .select("id")
    .eq("user_id", userId)
    .eq("played_date", today)
    .maybeSingle();

  return !!data;
}

export async function recordPlay(
  userId: string | null,
  data: Omit<PlayRecord, "played_date">
): Promise<void> {
  const played_date = localDate();
  const record: PlayRecord = { ...data, played_date };

  if (!userId) {
    // Anonymous: store in localStorage, replacing any existing entry for today
    const plays = getLocalPlays().filter((p) => p.played_date !== played_date);
    saveLocalPlays([...plays, record]);
    window.dispatchEvent(new CustomEvent(PLAY_RECORDED_EVENT));
    return;
  }

  const supabase = createClient();
  await supabase.from("plays").upsert(
    {
      user_id: userId,
      played_date: record.played_date,
      scenario_id: record.scenario_id,
      hints_used: record.hints_used,
      won: record.won,
    },
    { onConflict: "user_id,played_date", ignoreDuplicates: true }
  );
  window.dispatchEvent(new CustomEvent(PLAY_RECORDED_EVENT));
}

export async function getUserPlays(
  userId: string
): Promise<PlayRecord[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("plays")
    .select("played_date, scenario_id, hints_used, won")
    .eq("user_id", userId)
    .order("played_date", { ascending: false })
    .limit(365);

  return (data ?? []) as PlayRecord[];
}

export async function migrateLocalPlaysToSupabase(userId: string): Promise<void> {
  const localPlays = getLocalPlays();
  if (localPlays.length === 0) return;

  const supabase = createClient();
  const rows = localPlays.map((p) => ({
    user_id: userId,
    played_date: p.played_date,
    scenario_id: p.scenario_id,
    hints_used: p.hints_used,
    won: p.won,
  }));

  const { error } = await supabase
    .from("plays")
    .upsert(rows, { onConflict: "user_id,played_date", ignoreDuplicates: true });

  if (!error) {
    localStorage.removeItem(LS_KEY);
  }
}

export function getLocalPlayCount(): number {
  return getLocalPlays().length;
}
