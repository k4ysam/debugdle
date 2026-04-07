"use client";

import { Hint } from "@/data/scenarios";

interface Props {
  hint: Hint;
  revealed: boolean;
  isLatest: boolean;
}

export function HintCard({ hint, revealed, isLatest }: Props) {
  if (!revealed) {
    return (
      <div className="hint-card hint-card--locked">
        <span className="hint-number">#{hint.number}</span>
        <span className="hint-locked-label">Locked</span>
      </div>
    );
  }

  return (
    <div
      key={`hint-${hint.number}-revealed`}
      className={`hint-card hint-card--revealed${isLatest ? " hint-card--latest" : ""}`}
    >
      <span className="hint-number">#{hint.number}</span>
      <p className="hint-text">{hint.text}</p>
    </div>
  );
}
