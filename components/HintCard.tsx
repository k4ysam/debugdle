"use client";

import { useEffect, useRef } from "react";
import { Hint } from "@/data/scenarios";

interface Props {
  hint: Hint;
  revealed: boolean;
  isLatest: boolean;
}

export function HintCard({ hint, revealed, isLatest }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLatest || !rowRef.current) return;
    const el = rowRef.current;
    el.classList.add("animating");
    const onEnd = () => el.classList.remove("animating");
    el.addEventListener("animationend", onEnd, { once: true });
    return () => el.removeEventListener("animationend", onEnd);
  }, [isLatest]);

  const label = `hint ${String(hint.number).padStart(2, "0")}`;

  if (!revealed) {
    return (
      <div className="hint-row locked" role="listitem">
        <span className="hint-label">{label}</span>
        <div className="hint-content-wrap">
          <span className="hint-placeholder">——</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={rowRef}
      className={`hint-row revealed${isLatest ? " animating" : ""}`}
      role="listitem"
    >
      <span className="hint-label">{label}</span>
      <div className="hint-content-wrap">
        <span className="hint-text">{hint.text}</span>
      </div>
    </div>
  );
}
