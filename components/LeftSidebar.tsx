"use client";

import { SidebarShell } from "./SidebarShell";
import { useAuth } from "./AuthProvider";

type LeftSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function LeftSidebar({ open, onClose }: LeftSidebarProps) {
  const { user, loading } = useAuth();

  const name =
    (user?.user_metadata?.display_name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "guest";

  return (
    <SidebarShell
      id="main-menu"
      side="left"
      open={open}
      onClose={onClose}
      eyebrow="utility rail"
      title="menu"
      footer={
        <div className="sidebar-user">
          <p className="sidebar-user-label">
            {loading ? "auth state" : user ? "signed in as" : "current state"}
          </p>
          <p className="sidebar-user-name" title={user?.email ?? name}>
            {loading ? "loading" : name}
          </p>
        </div>
      }
    >
      <section className="sidebar-section">
        <p className="sidebar-section-label">changelog</p>
        <p className="sidebar-section-copy">
          The shell now supports side rails so supporting context can stay nearby
          without taking the puzzle off stage.
        </p>
      </section>

      <section className="sidebar-section">
        <p className="sidebar-section-label">about</p>
        <p className="sidebar-section-copy">
          Debugdle is a daily debugging puzzle for engineers. Read the clues, trace
          the failure mode, and commit to a guess before the final hint.
        </p>
      </section>
    </SidebarShell>
  );
}
