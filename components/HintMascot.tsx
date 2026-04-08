"use client";

import type { GameStatus } from "@/lib/game";

type MascotState = "sleep" | "confused" | "engaged" | "sweaty" | "win" | "loss";

interface Props {
  hintsRevealed: number;
  status: GameStatus;
}

function getMascotState(hintsRevealed: number, status: GameStatus): MascotState {
  if (status === "won") return "win";
  if (status === "lost") return "loss";
  if (hintsRevealed <= 1) return "sleep";
  if (hintsRevealed <= 3) return "confused";
  if (hintsRevealed <= 5) return "engaged";
  return "sweaty";
}

function getMascotLabel(state: MascotState): string {
  switch (state) {
    case "sleep":
      return "asleep";
    case "confused":
      return "confused";
    case "engaged":
      return "engaged";
    case "sweaty":
      return "sweaty";
    case "win":
      return "victory";
    case "loss":
      return "faceplant";
  }
}

function FallbackArt({ state }: { state: MascotState }) {
  const art: Record<MascotState, string> = {
    sleep: "  zzz\n ( - -)\n /___\\",
    confused: "  ? ?\n (o_o)\n /___\\",
    engaged: "  ^ ^\n (o_o)\n /___\\",
    sweaty: "  * *\n (o_o)\n /_~_\\",
    win: "  \\o/\n  (^^)\n /___\\",
    loss: "  x x\n (___)\n  / \\",
  };

  return <pre className="hint-mascot-fallback" aria-hidden="true">{art[state]}</pre>;
}

function HintSprite({ state }: { state: MascotState }) {
  return (
    <svg
      className="hint-mascot-sprite"
      viewBox="0 0 48 48"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      <rect x="6" y="6" width="36" height="36" className="hm-frame" />

      {state === "loss" ? (
        <g className="hm-loss">
          <rect x="13" y="23" width="22" height="10" className="hm-body" />
          <rect x="15" y="20" width="18" height="4" className="hm-head" />
          <rect x="17" y="22" width="2" height="2" className="hm-eye" />
          <rect x="29" y="22" width="2" height="2" className="hm-eye" />
          <rect x="19" y="26" width="10" height="2" className="hm-mouth" />
          <rect x="34" y="28" width="5" height="2" className="hm-splat" />
        </g>
      ) : (
        <g className="hm-core">
          <rect x="15" y="14" width="18" height="16" className="hm-head" />
          <rect x="17" y="30" width="14" height="7" className="hm-body" />
          <rect x="13" y="20" width="3" height="2" className="hm-arm hm-arm-left" />
          <rect x="32" y="20" width="3" height="2" className="hm-arm hm-arm-right" />
        </g>
      )}

      {state === "sleep" && (
        <g>
          <rect x="18" y="21" width="3" height="1" className="hm-eye" />
          <rect x="27" y="21" width="3" height="1" className="hm-eye" />
          <rect x="31" y="11" width="4" height="2" className="hm-z" />
          <rect x="35" y="8" width="3" height="2" className="hm-z hm-z-mid" />
          <rect x="38" y="5" width="2" height="2" className="hm-z hm-z-top" />
        </g>
      )}

      {state === "confused" && (
        <g>
          <rect x="18" y="19" width="2" height="2" className="hm-eye" />
          <rect x="28" y="19" width="2" height="2" className="hm-eye" />
          <rect x="19" y="16" width="3" height="1" className="hm-brow" />
          <rect x="27" y="16" width="3" height="1" className="hm-brow" />
          <rect x="23" y="24" width="2" height="2" className="hm-mouth" />
          <rect x="34" y="13" width="3" height="3" className="hm-question" />
        </g>
      )}

      {state === "engaged" && (
        <g>
          <rect x="17" y="18" width="3" height="3" className="hm-eye" />
          <rect x="28" y="18" width="3" height="3" className="hm-eye" />
          <rect x="18" y="16" width="3" height="1" className="hm-brow" />
          <rect x="27" y="16" width="3" height="1" className="hm-brow" />
          <rect x="21" y="24" width="6" height="2" className="hm-mouth" />
          <rect x="11" y="21" width="5" height="2" className="hm-arm hm-arm-left" />
          <rect x="32" y="21" width="5" height="2" className="hm-arm hm-arm-right" />
        </g>
      )}

      {state === "sweaty" && (
        <g>
          <rect x="17" y="18" width="3" height="3" className="hm-eye" />
          <rect x="28" y="18" width="3" height="3" className="hm-eye" />
          <rect x="22" y="25" width="4" height="1" className="hm-mouth" />
          <rect x="33" y="12" width="3" height="5" className="hm-sweat" />
          <rect x="35" y="10" width="2" height="2" className="hm-sweat" />
        </g>
      )}

      {state === "win" && (
        <g>
          <rect x="17" y="18" width="3" height="3" className="hm-eye" />
          <rect x="28" y="18" width="3" height="3" className="hm-eye" />
          <rect x="22" y="24" width="4" height="2" className="hm-mouth" />
          <rect x="12" y="13" width="3" height="8" className="hm-arm hm-arm-up" />
          <rect x="10" y="11" width="2" height="2" className="hm-fist" />
          <rect x="34" y="14" width="2" height="2" className="hm-spark" />
          <rect x="37" y="17" width="2" height="2" className="hm-spark" />
          <rect x="34" y="20" width="2" height="2" className="hm-spark" />
        </g>
      )}

      {state !== "sleep" && state !== "confused" && state !== "engaged" && state !== "sweaty" && state !== "win" && (
        <g>
          <rect x="17" y="18" width="3" height="3" className="hm-eye" />
          <rect x="28" y="18" width="3" height="3" className="hm-eye" />
          <rect x="22" y="24" width="4" height="2" className="hm-mouth" />
        </g>
      )}
    </svg>
  );
}

export function HintMascot({ hintsRevealed, status }: Props) {
  const state = getMascotState(hintsRevealed, status);
  const label = getMascotLabel(state);

  return (
    <div className={`hint-mascot hint-mascot--${state}`} role="img" aria-label={`Hint mascot ${label}`}>
      <HintSprite state={state} />
      <FallbackArt state={state} />
    </div>
  );
}
