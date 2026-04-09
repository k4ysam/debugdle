// Server-side only — import from Server Components or Route Handlers
import { createClient } from "@/lib/supabase/server";
import { computeStreakFromPlays } from "@/lib/streak";
import type { PlayRecord } from "@/lib/plays";

export interface LeaderboardEntry {
  displayName: string;
  value: number;
}

export async function getTopWinners(limit = 10): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plays")
    .select("user_id, profiles(display_name)")
    .eq("won", true);

  if (!data) return [];

  const counts = new Map<string, { name: string; wins: number }>();
  for (const row of data) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const name = (profile as { display_name?: string } | null)?.display_name ?? "anon";
    const entry = counts.get(row.user_id) ?? { name, wins: 0 };
    entry.wins++;
    counts.set(row.user_id, entry);
  }

  return [...counts.values()]
    .sort((a, b) => b.wins - a.wins)
    .slice(0, limit)
    .map(({ name, wins }) => ({ displayName: name, value: wins }));
}

export async function getTopStreaks(limit = 10): Promise<LeaderboardEntry[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("plays")
    .select("user_id, played_date, won, profiles(display_name)")
    .order("played_date", { ascending: false });

  if (!data) return [];

  // Group plays by user
  const userMap = new Map<string, { name: string; plays: PlayRecord[] }>();
  for (const row of data) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    const name = (profile as { display_name?: string } | null)?.display_name ?? "anon";
    const existing = userMap.get(row.user_id) ?? { name, plays: [] };
    existing.plays.push({
      played_date: row.played_date,
      won: row.won,
      scenario_id: "",
      hints_used: 0,
      difficulty: "daily",
    });
    userMap.set(row.user_id, existing);
  }

  return [...userMap.entries()]
    .map(([, { name, plays }]) => ({
      displayName: name,
      value: computeStreakFromPlays(plays).streak,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
