"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SCENARIOS } from "@/data/scenarios";
import { GameBoard } from "@/components/GameBoard";
import { Header } from "@/components/Header";

interface PageProps {
  params: Promise<{ date: string }>;
}

export default function PlayPage({ params }: PageProps) {
  const { date } = use(params);
  const [puzzleNumber, setPuzzleNumber] = useState<number | null>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("puzzle_schedule")
      .select("puzzle_number, scenario_id")
      .eq("puzzle_date", date)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setNotFound(true); return; }
        setPuzzleNumber(data.puzzle_number);
        setScenarioId(data.scenario_id);
      });
  }, [date]);

  const scenario = scenarioId ? SCENARIOS.find((s) => s.id === scenarioId) : null;

  const today = new Date().toLocaleDateString("en-CA");
  const isToday = date === today;

  return (
    <div id="app">
      <Header />
      <main>
        {notFound && (
          <p className="scenario-label">
            No puzzle found for {date}.{" "}
            <Link href="/archive">← back to archive</Link>
          </p>
        )}

        {!notFound && !scenario && (
          <p className="scenario-label">loading…</p>
        )}

        {scenario && (
          <>
            <div className="play-meta">
              <Link href="/archive" className="archive-back">← archive</Link>
              <span className="play-puzzle-id">
                #{puzzleNumber} · {date}{isToday ? " · today" : " · archived"}
              </span>
            </div>
            <GameBoard scenario={scenario} puzzleDate={date} />
          </>
        )}
      </main>
    </div>
  );
}
