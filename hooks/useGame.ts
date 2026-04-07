"use client";

import { useReducer, useCallback } from "react";
import {
  GameState,
  GameStatus,
  initGame,
  revealNextHint,
  submitGuess,
} from "@/lib/game";
import { Scenario } from "@/data/scenarios";

type Action =
  | { type: "REVEAL_HINT" }
  | { type: "SUBMIT_GUESS"; bugId: string }
  | { type: "RESET"; scenario: Scenario };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "REVEAL_HINT":
      return revealNextHint(state);
    case "SUBMIT_GUESS":
      return submitGuess(state, action.bugId);
    case "RESET":
      return initGame(action.scenario);
    default:
      return state;
  }
}

export function useGame(scenario: Scenario) {
  const [state, dispatch] = useReducer(reducer, scenario, initGame);

  const revealHint = useCallback(() => {
    dispatch({ type: "REVEAL_HINT" });
  }, []);

  const guess = useCallback((bugId: string) => {
    dispatch({ type: "SUBMIT_GUESS", bugId });
  }, []);

  const reset = useCallback((newScenario: Scenario) => {
    dispatch({ type: "RESET", scenario: newScenario });
  }, []);

  return { state, revealHint, guess, reset };
}
