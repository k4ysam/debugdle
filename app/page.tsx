import { getTodaysScenario } from "@/data/scenarios";
import { GameBoard } from "@/components/GameBoard";

export default function Home() {
  const scenario = getTodaysScenario();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="logo">
          Debug<span>dle</span>
        </h1>
        <span className="page-date">{today}</span>
      </header>

      <main style={{ width: "100%", maxWidth: 640 }}>
        <p className="scenario-subtitle">Today&apos;s scenario</p>
        <h2 className="scenario-title">{scenario.title}</h2>
        <GameBoard scenario={scenario} />
      </main>
    </div>
  );
}
