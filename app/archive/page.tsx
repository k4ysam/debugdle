"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getUserPlays, type PlayRecord } from "@/lib/plays";
import { SCENARIOS } from "@/data/scenarios";
import Link from "next/link";

function scenarioTitle(id: string): string {
  return SCENARIOS.find((s) => s.id === id)?.title ?? "Unknown puzzle";
}

export default function ArchivePage() {
  const { user } = useAuth();
  const [plays, setPlays] = useState<PlayRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getUserPlays(user.id).then((data) => {
      setPlays(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <main className="archive-page">
      <div className="archive-header">
        <Link href="/" className="archive-back">← back</Link>
        <h1 className="archive-title">your debugdles</h1>
      </div>

      {!user && (
        <p className="archive-empty">
          <Link href="/">Sign in</Link> to see your play history.
        </p>
      )}

      {user && loading && (
        <p className="archive-empty">loading…</p>
      )}

      {user && !loading && plays.length === 0 && (
        <p className="archive-empty">no plays yet — go debug something!</p>
      )}

      {user && !loading && plays.length > 0 && (
        <ul className="archive-list">
          {plays.map((play) => (
            <li key={play.played_date} className={`archive-item ${play.won ? "won" : "lost"}`}>
              <span className="archive-date">{play.played_date}</span>
              <span className="archive-scenario">{scenarioTitle(play.scenario_id)}</span>
              <span className="archive-result">{play.won ? "solved" : "unsolved"}</span>
              <span className="archive-hints">{play.hints_used} hint{play.hints_used !== 1 ? "s" : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
