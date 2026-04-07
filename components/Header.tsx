"use client";

import { useState, useEffect } from "react";
import { AuthMenu } from "./AuthMenu";
import { useStreak } from "@/hooks/useStreak";

export function Header() {
  const [isLight, setIsLight] = useState(false);
  const [htpOpen, setHtpOpen] = useState(false);
  const streak = useStreak();

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const light = saved === "light";
    setIsLight(light);
    if (light) document.documentElement.classList.add("light");
    // Enable transitions after first render
    setTimeout(() => document.documentElement.classList.remove("no-transition"), 50);
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  const openHtp = () => setHtpOpen(true);
  const closeHtp = () => setHtpOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="logo">debugdle<span className="cursor">_</span></div>
        <div className="header-right">
          {streak > 0 && (
            <span className="streak" title="Current streak">
              streak {streak}
            </span>
          )}
          <AuthMenu />
          <button
            className="theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
          >
            {isLight ? "☾" : "☀"}
          </button>
          <button
            className="help-btn"
            onClick={openHtp}
            aria-label="How to play"
            aria-haspopup="dialog"
          >
            ?
          </button>
        </div>
      </header>
      <hr className="header-rule" />

      {/* How to play overlay */}
      <aside
        id="how-to-play"
        role="dialog"
        aria-modal="true"
        aria-label="How to play"
        tabIndex={-1}
        className={htpOpen ? "open" : ""}
      >
        <div className="htp-header">
          <span className="htp-title">how to play</span>
          <button className="htp-close" onClick={closeHtp}>✕ close</button>
        </div>
        <div className="htp-steps">
          <div className="htp-step">
            <span className="htp-num">1</span>
            <div>
              <p className="htp-step-title">Read the hints</p>
              <p className="htp-step-desc">
                Each puzzle reveals up to 6 hints, one at a time.
                Every hint narrows down the type of bug. You can reveal
                as many as you need before guessing.
              </p>
            </div>
          </div>
          <div className="htp-step">
            <span className="htp-num">2</span>
            <div>
              <p className="htp-step-title">Search for a bug type</p>
              <p className="htp-step-desc">
                Type in the search field to filter through 100+ canonical
                bug categories. Use arrow keys to navigate, Enter to select.
              </p>
            </div>
          </div>
          <div className="htp-step">
            <span className="htp-num">3</span>
            <div>
              <p className="htp-step-title">Submit when confident</p>
              <p className="htp-step-desc">
                Wrong guesses auto-reveal the next hint. Fewer hints used = better score.
                A new puzzle drops every day at midnight.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
