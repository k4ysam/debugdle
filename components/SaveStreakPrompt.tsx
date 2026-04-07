"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getLocalPlayCount } from "@/lib/plays";

const DISMISSED_KEY = "debugdle_streak_prompt_dismissed";

export function SaveStreakPrompt() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) return; // signed in, no need
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;
    const count = getLocalPlayCount();
    if (count >= 3) setVisible(true);
  }, [user]);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
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
