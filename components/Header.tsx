"use client";

import { useEffect, useState } from "react";
import { AuthMenu } from "./AuthMenu";
import { LeftSidebar } from "./LeftSidebar";
import { useTheme } from "@/hooks/useTheme";

export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLight, toggleTheme } = useTheme();

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <>
      <header className="site-header">
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
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
          <AuthMenu />
        </div>
      </header>
      <hr className="header-rule" />

      <LeftSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isLight={isLight}
        toggleTheme={toggleTheme}
      />
    </>
  );
}
