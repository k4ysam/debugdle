"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getLocalPlayCount } from "@/lib/plays";

const DISMISSED_KEY = "debugdle_streak_prompt_dismissed";

export function SaveStreakPrompt() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem(DISMISSED_KEY)
  );

  const visible =
    !user &&
    !dismissed &&
    typeof window !== "undefined" &&
    getLocalPlayCount() >= 3;

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="save-streak-banner" role="alert">
      <span>sign in to save your streak across devices.</span>
      <button className="save-streak-dismiss" onClick={dismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
