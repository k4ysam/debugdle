"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useStreak } from "@/hooks/useStreak";
import { useAuthPanel } from "@/context/AuthPanelContext";
import { EditProfileForm } from "@/components/EditProfileForm";

export function UserPanel() {
  const { user, signOut } = useAuth();
  const streak = useStreak();
  const { setOpen: openAuthPanel } = useAuthPanel();
  const [editing, setEditing] = useState(false);

  if (!user) {
    return (
      <div className="user-panel">
        <div className="user-avatar user-avatar--guest">?</div>
        <div className="user-panel-info">
          <span className="user-panel-name">guest</span>
          <div className="user-panel-meta">
            <Link href="/archive" className="user-history-link">history</Link>
            <span className="user-panel-sep">·</span>
            <button
              className="user-signin-link"
              onClick={() => openAuthPanel(true)}
            >
              sign in →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avatar = user.user_metadata?.avatar as string | undefined;
  const displayName =
    (user.user_metadata?.display_name as string | undefined) ??
    user.email?.[0]?.toUpperCase() ??
    "?";
  const initial = (user.email?.[0] ?? "?").toUpperCase();

  if (editing) {
    return <EditProfileForm onClose={() => setEditing(false)} />;
  }

  return (
    <div className="user-panel">
      <div className="user-avatar">{avatar || initial}</div>
      <div className="user-panel-info">
        <span className="user-panel-name">{displayName}</span>
        <div className="user-panel-meta">
          {streak > 0 && (
            <>
              <span className="user-streak">🔥 {streak}</span>
              <span className="user-panel-sep">·</span>
            </>
          )}
          <Link href="/archive" className="user-history-link">history</Link>
          <span className="user-panel-sep">·</span>
          <button className="user-signout-link" onClick={signOut}>out</button>
        </div>
      </div>
      <button
        className="user-edit-btn"
        onClick={() => setEditing(true)}
        aria-label="Edit profile"
        title="Edit profile"
      >
        ✏
      </button>
    </div>
  );
}
