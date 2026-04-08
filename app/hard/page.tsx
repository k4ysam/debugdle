import { getTodaysHardScenario } from "@/data/scenarios";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/Header";

export const dynamic = "force-dynamic";

export default function HardPage() {
  const scenario = getTodaysHardScenario();

  return (
    <div id="app">
      <Header />
      <main>
        <GameBoard scenario={scenario} isHard />
      </main>
    </div>
  );
}
