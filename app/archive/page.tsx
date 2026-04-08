"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getArchive, type PuzzleEntry, type PuzzleStatus } from "@/lib/archive";

// ── Status helpers ────────────────────────────────────────────────

function statusIcon(s: PuzzleStatus): string {
  if (s.kind === "unplayed") return "🔒";
  if (s.kind === "solved")   return s.onTime ? "✓" : "✓";
  return s.onTime ? "✕" : "✕";
}

function statusLabel(s: PuzzleStatus): string {
  if (s.kind === "unplayed") return "unplayed";
  const suffix = s.onTime ? "" : " (late)";
  if (s.kind === "solved") return `solved (${s.hintsUsed}/6)${suffix}`;
  return `failed${suffix}`;
}

function cardMod(s: PuzzleStatus): string {
  if (s.kind === "unplayed") return "puzzle-card--unplayed";
  if (s.kind === "solved" && s.onTime)  return "puzzle-card--solved";
  if (s.kind === "solved" && !s.onTime) return "puzzle-card--attempted puzzle-card--attempted-win";
  if (s.kind === "failed" && s.onTime)  return "puzzle-card--failed";
  return "puzzle-card--attempted puzzle-card--attempted-loss";
}

function iconMod(s: PuzzleStatus): string {
  if (s.kind === "unplayed") return "puzzle-icon--unplayed";
  if (s.kind === "solved")   return "puzzle-icon--solved";
  return "puzzle-icon--failed";
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  return `${months[m - 1]} ${String(d).padStart(2, "0")}, ${y}`;
}

// ── Card ──────────────────────────────────────────────────────────

function PuzzleCard({ entry }: { entry: PuzzleEntry }) {
  const { puzzleNumber, puzzleDate, status } = entry;
  return (
    <Link href={`/play/${puzzleDate}`} className={`puzzle-card ${cardMod(status)}`}>
      <div className="puzzle-card-top">
        <span className="puzzle-card-num">#{puzzleNumber}</span>
        <span className={`puzzle-card-icon ${iconMod(status)}`}>
          {statusIcon(status)}
        </span>
      </div>
      <span className="puzzle-card-date">{formatDate(puzzleDate)}</span>
      <span className="puzzle-card-label">{statusLabel(status)}</span>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────

export default function ArchivePage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<PuzzleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    getArchive(user?.id ?? null).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [user, authLoading]);

  return (
    <main className="archive-page">
      <div className="archive-header">
        <Link href="/" className="archive-back">← back</Link>
        <h1 className="archive-title">archive</h1>
      </div>

      {loading && <p className="archive-empty">loading…</p>}

      {!loading && entries.length === 0 && (
        <p className="archive-empty">no puzzles in the schedule yet.</p>
      )}

      {!loading && entries.length > 0 && (
        <div className="puzzle-grid">
          {entries.map((entry) => (
            <PuzzleCard key={entry.puzzleDate} entry={entry} />
          ))}
        </div>
      )}
    </main>
  );
}
