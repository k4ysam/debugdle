"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useStreak } from "@/hooks/useStreak";
import { useAuthPanel } from "@/context/AuthPanelContext";
import { EditProfileForm } from "@/components/EditProfileForm";

export function UserPanel() {
  const { user, signOut } = useAuth();
  const streak = useStreak();
  const { setOpen: openAuthPanel } = useAuthPanel();
  const [editing, setEditing] = useState(false);
  const router = useRouter();

  if (editing && user) {
    return <EditProfileForm onClose={() => setEditing(false)} />;
  }

  const avatar = user?.user_metadata?.avatar as string | undefined;
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email?.[0]?.toUpperCase() ??
    null;

  return (
    <div className="sb-user-panel">
      {/* Identity row */}
      <div className="sb-identity">
        <div className="sb-identity-avatar">
          {user ? (avatar || (user.email?.[0] ?? "?").toUpperCase()) : "◯"}
        </div>
        <div className="sb-identity-info">
          <span className="sb-identity-name">
            {user ? (displayName ?? "user") : "Terminal_Guest"}
          </span>
          <span className="sb-identity-status">
            {user
              ? streak > 0 ? `🔥 ${streak} day streak` : "active"
              : "unauthorized"}
          </span>
        </div>
        {user && (
          <button
            className="sb-identity-edit"
            onClick={() => setEditing(true)}
            aria-label="Edit profile"
            title="Edit profile"
          >
            ✏
          </button>
        )}
      </div>

      {/* CTA button */}
      {user ? (
        <div className="sb-cta-row">
          <button
            className="sb-cta sb-cta--outline"
            onClick={() => router.push("/archive")}
          >
            view history
          </button>
          <button className="sb-cta-signout" onClick={signOut}>sign out</button>
        </div>
      ) : (
        <button
          className="sb-cta"
          onClick={() => openAuthPanel(true)}
        >
          sign in to archive
        </button>
      )}
    </div>
  );
}
