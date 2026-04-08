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

type Section = "support" | "changelog" | "about" | null;

const NAV = [
  { id: "support" as Section,   icon: "?",  label: "SUPPORT"       },
  { id: "changelog" as Section, icon: "↻",  label: "CHANGELOG"     },
  { id: "about" as Section,     icon: "ⓘ",  label: "ABOUT ARCHIVE" },
];

const STEPS = [
  { n: "01", title: "Read the hints",       sub: "INITIAL ASSESSMENT PHASE"  },
  { n: "02", title: "Search for a bug type", sub: "DIAGNOSTIC PROCEDURE"     },
  { n: "03", title: "Submit when confident", sub: "COMMIT TO DIAGNOSIS"      },
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
      {/* Nav rows */}
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
                    Need help? Read the deployment protocol below — it covers everything
                    you need to diagnose a bug from scratch.
                  </p>
                )}
                {id === "changelog" && (
                  <p className="sb-body-copy">
                    Sidebar redesigned with user panel, edit profile, and history for
                    anonymous players. Archive page now works without signing in.
                  </p>
                )}
                {id === "about" && (
                  <p className="sb-body-copy">
                    Debugdle is a daily debugging puzzle for engineers. Read the clues,
                    trace the failure mode, and commit to a guess before the final hint.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Appearance */}
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

      {/* Deployment protocol */}
      <div className="sb-section">
        <p className="sb-section-label">deployment protocol</p>
        <div className="sb-steps">
          {STEPS.map(({ n, title, sub }) => (
            <div key={n} className="sb-step">
              <span className="sb-step-n">{n}</span>
              <div>
                <p className="sb-step-title">{title}</p>
                <p className="sb-step-sub">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarShell>
  );
}
