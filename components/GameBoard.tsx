"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/components/AuthProvider";
import { Scenario } from "@/data/scenarios";
import { recordPlay } from "@/lib/plays";
import { HintCard } from "./HintCard";
import { GuessInput } from "./GuessInput";
import { ResultScreen } from "./ResultScreen";

interface Props {
  scenario: Scenario;
  puzzleDate?: string; // YYYY-MM-DD — pass for archive replays
}

export function GameBoard({ scenario, puzzleDate }: Props) {
  const { state, revealHint, guess } = useGame(scenario);
  const { hintsRevealed, status, submitted, guesses } = state;
  const canReveal = hintsRevealed < 6 && !submitted;
  const { user } = useAuth();
  const recordedRef = useRef(false);
  const hintPanelRef = useRef<HTMLDivElement>(null);
  const previousPanelHeightRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const panel = hintPanelRef.current;
    if (!panel) return;

    const nextHeight = panel.getBoundingClientRect().height;
    const previousHeight = previousPanelHeightRef.current;
    previousPanelHeightRef.current = nextHeight;

    if (previousHeight === null || Math.abs(nextHeight - previousHeight) < 1) {
      return;
    }

    let frame = 0;
    const reset = () => {
      panel.style.height = "";
      panel.style.overflow = "";
      panel.style.willChange = "";
      panel.style.transition = "";
    };

    panel.style.height = `${previousHeight}px`;
    panel.style.overflow = "clip";
    panel.style.willChange = "height";

    frame = window.requestAnimationFrame(() => {
      panel.style.transition = "height 320ms cubic-bezier(0.22, 1, 0.36, 1)";
      panel.style.height = `${nextHeight}px`;
    });

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === "height") {
        reset();
      }
    };

    panel.addEventListener("transitionend", handleTransitionEnd, { once: true });

    return () => {
      window.cancelAnimationFrame(frame);
      panel.removeEventListener("transitionend", handleTransitionEnd);
      reset();
    };
  }, [hintsRevealed]);

  // Record play once when game ends
  useEffect(() => {
    if (!submitted || recordedRef.current) return;
    recordedRef.current = true;
    recordPlay(user?.id ?? null, {
      scenario_id: scenario.id,
      hints_used: hintsRevealed,
      won: status === "won",
    }, puzzleDate);
  }, [submitted, user, scenario.id, hintsRevealed, status, puzzleDate]);

  return (
    <>
      {/* Hint panel */}
      <div ref={hintPanelRef} className="hint-panel" role="list" aria-label="Hints">
        {scenario.hints.map((hint) => (
          <HintCard
            key={hint.number}
            hint={hint}
            revealed={hint.number <= hintsRevealed}
            isLatest={hint.number === hintsRevealed}
          />
        ))}
      </div>

      {/* Input area — hidden after final submission */}
      {!submitted && (
        <>
          <GuessInput
            onSubmit={guess}
            onReveal={revealHint}
            canReveal={canReveal}
            hintsRevealed={hintsRevealed}
            guesses={guesses}
            disabled={false}
          />
        </>
      )}

      {/* Result — shown after game ends */}
      {submitted && <ResultScreen state={state} />}
    </>
  );
}
