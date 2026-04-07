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

type SidebarTab = "help" | "changelog" | "about";

export function LeftSidebar({ open, onClose, isLight, toggleTheme }: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("help");

  return (
    <SidebarShell
      id="main-menu"
      side="left"
      open={open}
      onClose={onClose}
      eyebrow="utility rail"
      title="menu"
      footer={<UserPanel />}
    >
      {/* Theme toggle */}
      <div className="sidebar-theme-row">
        <span className="sidebar-theme-label">appearance</span>
        <button
          className="sidebar-theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle light or dark mode"
          type="button"
        >
          <span suppressHydrationWarning>{isLight ? "☾ dark" : "☀ light"}</span>
        </button>
      </div>

      {/* Nav tabs */}
      <div className="sidebar-tabs" role="tablist" aria-label="Menu sections">
        {(["help", "changelog", "about"] as SidebarTab[]).map((tab) => (
          <button
            key={tab}
            className={`sidebar-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "help" && (
        <div className="htp-steps">
          <div className="htp-step">
            <span className="htp-num">1</span>
            <div>
              <p className="htp-step-title">Read the hints</p>
              <p className="htp-step-desc">
                Each puzzle reveals up to 6 hints, one at a time. Every hint narrows
                the bug category before you commit to a guess.
              </p>
            </div>
          </div>
          <div className="htp-step">
            <span className="htp-num">2</span>
            <div>
              <p className="htp-step-title">Search for a bug type</p>
              <p className="htp-step-desc">
                Use the input to filter canonical bug categories. Arrow keys move
                through results and Enter confirms the selection.
              </p>
            </div>
          </div>
          <div className="htp-step">
            <span className="htp-num">3</span>
            <div>
              <p className="htp-step-title">Submit when confident</p>
              <p className="htp-step-desc">
                Wrong guesses reveal the next hint automatically. Fewer hints used
                means a better solve, and a fresh puzzle arrives daily.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "changelog" && (
        <section className="sidebar-section">
          <p className="sidebar-section-label">changelog</p>
          <p className="sidebar-section-copy">
            The shell now supports a single utility rail so supporting context stays
            in one place without splitting attention across both sides of the page.
          </p>
        </section>
      )}

      {activeTab === "about" && (
        <section className="sidebar-section">
          <p className="sidebar-section-label">about</p>
          <p className="sidebar-section-copy">
            Debugdle is a daily debugging puzzle for engineers. Read the clues, trace
            the failure mode, and commit to a guess before the final hint.
          </p>
        </section>
      )}
    </SidebarShell>
  );
}
