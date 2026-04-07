"use client";

import { useState } from "react";
import { SidebarShell } from "./SidebarShell";
import { useAuth } from "./AuthProvider";

type LeftSidebarProps = {
  open: boolean;
  onClose: () => void;
};

type SidebarTab = "help" | "changelog" | "about";

export function LeftSidebar({ open, onClose }: LeftSidebarProps) {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<SidebarTab>("help");

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
      <div className="sidebar-tabs" role="tablist" aria-label="Menu sections">
        <button
          className={`sidebar-tab ${activeTab === "help" ? "active" : ""}`}
          onClick={() => setActiveTab("help")}
          role="tab"
          aria-selected={activeTab === "help"}
          type="button"
        >
          help
        </button>
        <button
          className={`sidebar-tab ${activeTab === "changelog" ? "active" : ""}`}
          onClick={() => setActiveTab("changelog")}
          role="tab"
          aria-selected={activeTab === "changelog"}
          type="button"
        >
          changelog
        </button>
        <button
          className={`sidebar-tab ${activeTab === "about" ? "active" : ""}`}
          onClick={() => setActiveTab("about")}
          role="tab"
          aria-selected={activeTab === "about"}
          type="button"
        >
          about
        </button>
      </div>

      {activeTab === "help" ? (
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
      ) : null}

      {activeTab === "changelog" ? (
        <section className="sidebar-section">
          <p className="sidebar-section-label">changelog</p>
          <p className="sidebar-section-copy">
            The shell now supports a single utility rail so supporting context stays
            in one place without splitting attention across both sides of the page.
          </p>
        </section>
      ) : null}

      {activeTab === "about" ? (
        <section className="sidebar-section">
          <p className="sidebar-section-label">about</p>
          <p className="sidebar-section-copy">
            Debugdle is a daily debugging puzzle for engineers. Read the clues, trace
            the failure mode, and commit to a guess before the final hint.
          </p>
        </section>
      ) : null}
    </SidebarShell>
  );
}
