"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthMenu } from "./AuthMenu";
import { LeftSidebar } from "./LeftSidebar";
import { useStreak } from "@/hooks/useStreak";
import { useAuth } from "@/components/AuthProvider";

export function Header() {
  const [isLight, setIsLight] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("theme") === "light"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const streak = useStreak();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
    setTimeout(() => document.documentElement.classList.remove("no-transition"), 50);
  }, [isLight]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((current) => !current);

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={toggleSidebar}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
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
          {user && (
            <Link href="/archive" className="archive-link">history</Link>
          )}
          {streak > 0 && (
            <span className="streak" title="Current streak">
              streak {streak}
            </span>
          )}
          <AuthMenu />
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
        </div>
      </header>
      <hr className="header-rule" />

      <LeftSidebar open={sidebarOpen} onClose={closeSidebar} />
    </>
  );
}
