"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/hooks/useGame";
import { useAuth } from "@/components/AuthProvider";
import { Scenario } from "@/data/scenarios";
import { getBugById } from "@/lib/game";
import { recordPlay } from "@/lib/plays";
import { HintCard } from "./HintCard";
import { GuessInput } from "./GuessInput";
import { ResultScreen } from "./ResultScreen";

interface Props {
  scenario: Scenario;
}

export function GameBoard({ scenario }: Props) {
  const { state, revealHint, guess } = useGame(scenario);
  const { hintsRevealed, status, submitted, guesses } = state;
  const canReveal = hintsRevealed < 6 && !submitted;
  const { user } = useAuth();
  const recordedRef = useRef(false);

  // Record play once when game ends
  useEffect(() => {
    if (!submitted || recordedRef.current) return;
    recordedRef.current = true;
    recordPlay(user?.id ?? null, {
      scenario_id: scenario.id,
      hints_used: hintsRevealed,
      won: status === "won",
    });
  }, [submitted, user, scenario.id, hintsRevealed, status]);

  return (
    <>
      {/* Hint panel */}
      <div className="hint-panel" role="list" aria-label="Hints">
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
            disabled={false}
          />

          {/* Wrong guess history */}
          {guesses.length > 0 && (
            <ol className="guess-history" aria-label="Guess history">
              {guesses.map((id, i) => {
                const bug = getBugById(id);
                return (
                  <li key={i} className="guess-history-item">
                    <span className="guess-num">{i + 1}.</span>
                    <span>{bug?.label ?? id}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}

      {/* Result — shown after game ends */}
      {submitted && <ResultScreen state={state} />}
    </>
  );
}
