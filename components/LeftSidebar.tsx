"use client";

import { useState } from "react";
import { SidebarShell } from "./SidebarShell";
import { UserPanel } from "./UserPanel";

type LeftSidebarProps = {
  open: boolean;
  onClose: () => void;
  isLight: boolean;
  toggleTheme: () => void;
};

type Section = "support" | "changelog" | null;

const NAV = [
  { id: "support" as Section, icon: "?", label: "SUPPORT" },
  { id: "changelog" as Section, icon: "↻", label: "CHANGELOG" },
];

export function LeftSidebar({ open, onClose, isLight, toggleTheme }: LeftSidebarProps) {
  const [expanded, setExpanded] = useState<Section>(null);

  const toggle = (id: Section) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <SidebarShell
      id="main-menu"
      side="left"
      open={open}
      onClose={onClose}
      eyebrow="utility rail"
      title="MENU"
      footer={<UserPanel />}
    >
      <nav className="sb-nav" aria-label="Sidebar navigation">
        {NAV.map(({ id, icon, label }) => (
          <div key={id}>
            <button
              className={`sb-nav-row${expanded === id ? " sb-nav-row--open" : ""}`}
              onClick={() => toggle(id)}
              aria-expanded={expanded === id}
              type="button"
            >
              <span className="sb-nav-icon">{icon}</span>
              <span className="sb-nav-label">{label}</span>
              <span className="sb-nav-arrow">{expanded === id ? "∨" : "›"}</span>
            </button>

            {expanded === id && (
              <div className="sb-nav-content">
                {id === "support" && (
                  <p className="sb-body-copy">
                    Need help? Review the hints carefully, narrow the likely failure mode,
                    and submit once the bug category is clear.
                  </p>
                )}
                {id === "changelog" && (
                  <p className="sb-body-copy">
                    Sidebar redesigned with user panel, edit profile, and history for
                    anonymous players. Archive page now works without signing in.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="sb-nav-row sb-nav-row--disabled" aria-disabled="true">
          <span className="sb-nav-icon">ⓘ</span>
          <span className="sb-nav-label">ARCHIVE</span>
          <span className="sb-nav-tag">coming soon</span>
        </div>
      </nav>

      <div className="sb-section">
        <p className="sb-section-label">appearance</p>
        <div className="sb-appearance-card">
          <span className="sb-appearance-icon" suppressHydrationWarning>
            {isLight ? "◑" : "◐"}
          </span>
          <span className="sb-appearance-mode" suppressHydrationWarning>
            {isLight ? "light mode" : "dark mode"}
          </span>
          <button
            className={`sb-toggle${isLight ? " sb-toggle--on" : ""}`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light mode"
            type="button"
          >
            <span className="sb-toggle-thumb" />
          </button>
        </div>
      </div>
    </SidebarShell>
  );
}
