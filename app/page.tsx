import { getTodaysScenario } from "@/data/scenarios";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/Header";

// Daily puzzle + auth state — must be dynamic
export const dynamic = "force-dynamic";

export default function Home() {
  const scenario = getTodaysScenario();

  return (
    <div id="app">
      <Header />
      <main>
        <GameBoard scenario={scenario} />
      </main>
    </div>
  );
}
