"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useStreak } from "@/hooks/useStreak";
import { useAuthPanel } from "@/context/AuthPanelContext";
import { EditProfileForm } from "@/components/EditProfileForm";

function getStreakDisplay(streak: number) {
  if (streak > 30) {
    return { emoji: "⭐", label: `${streak} day streak` };
  }

  if (streak > 10) {
    return { emoji: "❤️‍🔥", label: `${streak} day streak` };
  }

  if (streak > 0) {
    return { emoji: "🔥", label: `${streak} day streak` };
  }

  return { emoji: "", label: "0 day streak" };
}

export function UserPanel() {
  const { user, signOut } = useAuth();
  const streak = useStreak();
  const { setOpen: openAuthPanel } = useAuthPanel();
  const [editing, setEditing] = useState(false);

  if (editing && user) {
    return <EditProfileForm onClose={() => setEditing(false)} />;
  }

  const avatar = user?.user_metadata?.avatar as string | undefined;
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.[0]?.toUpperCase() ??
    null;
  const streakDisplay = getStreakDisplay(streak);
  const identityName = user ? (displayName ?? "user") : "Guest";
  const avatarContent = user ? (avatar || (user.email?.[0] ?? "?").toUpperCase()) : "👤";

  return (
    <div className="sb-user-panel">
      <div className="sb-identity">
        <div className={`sb-identity-avatar${user ? "" : " sb-identity-avatar--guest"}`}>
          {avatarContent}
        </div>
        <div className="sb-identity-info">
          <span className="sb-identity-name">{identityName}</span>
        </div>
        {user && (
          <button
            className="sb-identity-edit"
            onClick={() => setEditing(true)}
            aria-label="Edit profile"
            title="Edit profile"
            type="button"
          >
            ✏
          </button>
        )}
      </div>

      <div className="sb-cta-row">
        <div className="sb-cta sb-cta--outline sb-streak-pill" aria-label={streakDisplay.label}>
          <span className="sb-streak-emoji" aria-hidden="true">
            {streakDisplay.emoji}
          </span>
          <span className="sb-streak-text">{streakDisplay.label}</span>
        </div>

        {user ? (
          <button className="sb-cta-signout" onClick={signOut} type="button">
            sign out
          </button>
        ) : (
          <button className="sb-cta-signin" onClick={() => openAuthPanel(true)} type="button">
            sign in
          </button>
        )}
      </div>
    </div>
  );
}
