"use client";

import { useState, useEffect } from "react";
import { GameState, getBugById, buildShareText } from "@/lib/game";

interface Props {
  state: GameState;
}

function timeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ResultScreen({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(timeUntilMidnight());

  const { scenario, status, guesses, hintsRevealed } = state;
  const won = status === "won";
  const correctBug = getBugById(scenario.bugId);
  const lastWrongId = !won && guesses.length > 0 ? guesses[guesses.length - 1] : null;
  const lastWrongBug = lastWrongId ? getBugById(lastWrongId) : null;
  const totalGuesses = won ? guesses.length : guesses.length;

  useEffect(() => {
    const id = setInterval(() => setCountdown(timeUntilMidnight()), 1_000);
    return () => clearInterval(id);
  }, []);

  const handleCopy = async () => {
    const text = buildShareText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent fallback
    }
  };

  const outcomeText = won
    ? `diagnosed in ${hintsRevealed} hint${hintsRevealed === 1 ? "" : "s"}.`
    : `missed after ${totalGuesses} guess${totalGuesses === 1 ? "" : "es"}.`;

  const correctLabel = won ? "the bug was" : "the correct answer";

  const explanationParts = Array.isArray(scenario.explanation)
    ? scenario.explanation
    : [scenario.explanation];

  return (
    <section id="result-area" aria-live="polite" aria-label="Result">
      <p className="result-outcome">{outcomeText}</p>

      {!won && lastWrongBug && (
        <div className="result-wrong-block">
          <p className="result-wrong-label">your guess</p>
          <p className="result-wrong-answer">{lastWrongBug.label}</p>
        </div>
      )}

      <p className="result-answer-label">{correctLabel}</p>
      <p className="result-answer correct">{correctBug?.label}</p>

      <hr className="result-divider" />

      <div className="result-explanation">
        {explanationParts.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="result-actions">
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "[ copied! ]" : "[ copy result ]"}
        </button>
        <p className="countdown" aria-live="off">
          next puzzle in {countdown}
        </p>
      </div>
    </section>
  );
}
