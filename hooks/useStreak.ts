"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getUserPlays, getLocalPlays } from "@/lib/plays";
import { computeStreakFromPlays } from "@/lib/streak";

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
  }, [user]);

  return streak;
}
