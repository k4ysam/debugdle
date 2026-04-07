"use client";

import { useGame } from "@/hooks/useGame";
import { Scenario } from "@/data/scenarios";
import { HintCard } from "./HintCard";
import { GuessInput } from "./GuessInput";
import { ResultScreen } from "./ResultScreen";

interface Props {
  scenario: Scenario;
}

export function GameBoard({ scenario }: Props) {
  const { state, revealHint, guess } = useGame(scenario);
  const { hintsRevealed, status, submitted } = state;
  const gameOver = submitted;
  const canReveal = hintsRevealed < 6 && !submitted;

  return (
    <div className="game-board">
      <div className="hints-list">
        {scenario.hints.map((hint) => (
          <HintCard
            key={hint.number}
            hint={hint}
            revealed={hint.number <= hintsRevealed}
            isLatest={hint.number === hintsRevealed}
          />
        ))}
      </div>

      {!gameOver && (
        <div className="game-actions">
          {canReveal && (
            <button className="reveal-btn" onClick={revealHint}>
              Reveal Hint #{hintsRevealed + 1}
              <span className="reveal-btn-cost">
                {hintsRevealed + 1 <= 3 ? "" : hintsRevealed === 5 ? " (last)" : ""}
              </span>
            </button>
          )}

          <div className="divider-or">
            <span>or submit your guess</span>
          </div>

          <GuessInput onSubmit={guess} disabled={gameOver} />

          <p className="hint-counter">
            {hintsRevealed} / 6 hints revealed
          </p>
        </div>
      )}

      {gameOver && (
        <ResultScreen state={state} />
      )}
    </div>
  );
}
