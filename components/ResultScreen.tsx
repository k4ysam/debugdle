"use client";

import { useState } from "react";
import { GameState, getBugById, buildShareText } from "@/lib/game";
import { CATEGORY_LABELS } from "@/data/bug-types";

interface Props {
  state: GameState;
}

export function ResultScreen({ state }: Props) {
  const [copied, setCopied] = useState(false);
  const { scenario, status, guesses, hintsRevealed } = state;
  const won = status === "won";
  const correctBug = getBugById(scenario.bugId);
  const guessedBug = guesses.length > 0 ? getBugById(guesses[guesses.length - 1]) : null;

  const handleShare = async () => {
    const text = buildShareText(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silent
    }
  };

  return (
    <div className="result-screen">
      <div className={`result-badge ${won ? "result-badge--won" : "result-badge--lost"}`}>
        {won ? "🟢 Correct!" : "🔴 Not quite"}
      </div>

      <div className="result-hints-used">
        Used {won ? hintsRevealed : 6} of 6 hints
        <span className="result-hint-dots">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={`result-dot ${
                i < (won ? hintsRevealed : 6)
                  ? won && i === hintsRevealed - 1
                    ? "result-dot--correct"
                    : "result-dot--used"
                  : "result-dot--unused"
              }`}
            />
          ))}
        </span>
      </div>

      {!won && guessedBug && (
        <div className="result-your-guess">
          <span className="result-label">Your guess</span>
          <span className="result-bug-name">{guessedBug.label}</span>
          <span className="result-bug-cat">{CATEGORY_LABELS[guessedBug.category]}</span>
        </div>
      )}

      <div className="result-answer">
        <span className="result-label">The answer</span>
        <span className="result-bug-name result-bug-name--answer">{correctBug?.label}</span>
        {correctBug && (
          <span className="result-bug-cat">{CATEGORY_LABELS[correctBug.category]}</span>
        )}
      </div>

      <div className="result-explanation">
        <h3 className="result-explanation-title">Why?</h3>
        <p className="result-explanation-text">{scenario.explanation}</p>
      </div>

      <button className="share-btn" onClick={handleShare}>
        {copied ? "✓ Copied!" : "Share Result"}
      </button>
    </div>
  );
}
