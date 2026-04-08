"use client";

import { useEffect, useRef, useState } from "react";
import { GameState, buildShareText, getBugById } from "@/lib/game";

interface Props {
  state: GameState;
  open: boolean;
  onClose: () => void;
}

export function WinPopup({ state, open, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const correctBug = getBugById(state.scenario.bugId);
  const totalGuesses = state.guesses.length;
  const hintLabel = `${state.hintsRevealed} hint${state.hintsRevealed === 1 ? "" : "s"}`;
  const guessLabel = `${totalGuesses} guess${totalGuesses === 1 ? "" : "es"}`;
  const precisionLabel =
    state.hintsRevealed <= 2 ? "sharp read" : state.hintsRevealed <= 4 ? "solid diagnosis" : "late recovery";

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareText(state));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fallback
    }
  };

  return (
    <div className="win-popup-backdrop" role="presentation" onClick={onClose}>
      <div
        className="win-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-popup-title"
        aria-describedby="win-popup-description"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="win-popup-kicker">diagnosis confirmed</p>
        <button
          ref={closeButtonRef}
          className="win-popup-close"
          onClick={onClose}
          aria-label="Close success popup"
          type="button"
        >
          ×
        </button>

        <div className="win-popup-grid">
          <div className="win-popup-main">
            <p className="win-popup-eyebrow">{precisionLabel}</p>
            <h2 id="win-popup-title" className="win-popup-title">
              {correctBug?.label}
            </h2>
            <p id="win-popup-description" className="win-popup-copy">
              Clean solve. You isolated the failure mode before the system gave everything away.
            </p>
          </div>

          <div className="win-popup-stats" aria-label="Solve summary">
            <div className="win-popup-stat">
              <span className="win-popup-stat-label">hints used</span>
              <strong className="win-popup-stat-value">{hintLabel}</strong>
            </div>
            <div className="win-popup-stat">
              <span className="win-popup-stat-label">attempts</span>
              <strong className="win-popup-stat-value">{guessLabel}</strong>
            </div>
          </div>
        </div>

        <div className="win-popup-actions">
          <button className="win-popup-primary" onClick={onClose} type="button">
            inspect postmortem
          </button>
          <button className="win-popup-secondary" onClick={handleCopy} type="button">
            {copied ? "result copied" : "copy result"}
          </button>
        </div>
      </div>
    </div>
  );
}
