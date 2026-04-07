import { getTodaysScenario } from "@/data/scenarios";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/Header";

export default function Home() {
  const scenario = getTodaysScenario();

  return (
    <div id="app">
      <Header />
      <main>
        <p className="scenario-label">today&apos;s scenario</p>
        <h1 className="scenario-title">{scenario.title}</h1>
        <GameBoard scenario={scenario} />
      </main>
    </div>
  );
}
