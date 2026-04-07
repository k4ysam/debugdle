"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getUserPlays, getLocalPlays } from "@/lib/plays";
import { computeStreakFromPlays } from "@/lib/streak";

export const PLAY_RECORDED_EVENT = "debugdle:play-recorded";

export function useStreak() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    async function load() {
      if (!user) {
        const plays = getLocalPlays();
        const { streak } = computeStreakFromPlays(plays);
        setStreak(streak);
        return;
      }
      const plays = await getUserPlays(user.id);
      const { streak } = computeStreakFromPlays(plays);
      setStreak(streak);
    }

    load();
    window.addEventListener(PLAY_RECORDED_EVENT, load);
    return () => window.removeEventListener(PLAY_RECORDED_EVENT, load);
  }, [user]);

  return streak;
}
