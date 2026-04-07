"use client";

import { useEffect, useState } from "react";
import { LeftSidebar } from "./LeftSidebar";
import { SidebarShell } from "./SidebarShell";

export function Header() {
  const [isLight, setIsLight] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("theme") === "light"
  );
  const [activeSidebar, setActiveSidebar] = useState<"left" | "help" | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
    setTimeout(() => document.documentElement.classList.remove("no-transition"), 50);
  }, [isLight]);

  useEffect(() => {
    if (!activeSidebar) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSidebar(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSidebar]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  const closeSidebar = () => setActiveSidebar(null);
  const toggleSidebar = (side: "left" | "help") => {
    setActiveSidebar((current) => (current === side ? null : side));
  };

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={() => toggleSidebar("left")}
            aria-label="Open menu"
            aria-expanded={activeSidebar === "left"}
            aria-controls="main-menu"
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div className="header-center">
          <div className="logo">
            debugdle<span className="cursor">_</span>
          </div>
        </div>

        <div className="header-right">
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle light or dark mode"
            type="button"
          >
            <span className="theme-btn-icon" suppressHydrationWarning>
              {isLight ? "☾" : "☀"}
            </span>
          </button>
          <button
            className="help-btn"
            onClick={() => toggleSidebar("help")}
            aria-label="How to play"
            aria-expanded={activeSidebar === "help"}
            aria-controls="how-to-play"
            type="button"
          >
            ?
          </button>
        </div>
      </header>
      <hr className="header-rule" />

      <LeftSidebar open={activeSidebar === "left"} onClose={closeSidebar} />

      <SidebarShell
        id="how-to-play"
        side="right"
        open={activeSidebar === "help"}
        onClose={closeSidebar}
        eyebrow="reference rail"
        title="how to play"
      >
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
      </SidebarShell>
    </>
  );
}
