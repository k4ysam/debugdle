"use client";

import { useState } from "react";
import Link from "next/link";
import { SCENARIOS } from "@/data/scenarios";

export default function LabPage() {
  const [idx, setIdx] = useState(0);
  const scenario = SCENARIOS[idx];

  return (
    <div id="app">
      {/* ── Lab header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1.5rem 0 0",
        borderBottom: "1px solid var(--border)",
        paddingBottom: "1rem",
        marginBottom: "2rem",
      }}>
        <Link href="/" style={{ color: "var(--ink-muted)", fontSize: "0.82rem", textDecoration: "none" }}>
          ← back
        </Link>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--ink-muted)",
          letterSpacing: "0.1em",
          border: "1px solid var(--border-mid)",
          borderRadius: 4,
          padding: "2px 8px",
        }}>
          SCENARIO LAB
        </span>
        <span style={{ color: "var(--ink-muted)", fontSize: "0.82rem" }}>
          all hints revealed — not live yet
        </span>
      </div>

      {/* ── Scenario picker ── */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            style={{
              padding: "0.35rem 0.875rem",
              borderRadius: 5,
              border: "1px solid",
              borderColor: i === idx ? "var(--accent-hex)" : "var(--border-mid)",
              background: i === idx ? "var(--accent-dim)" : "transparent",
              color: i === idx ? "var(--accent-hex)" : "var(--ink-muted)",
              fontSize: "0.78rem",
              fontFamily: "var(--font-mono)",
            }}
          >
            {i + 1}
          </button>
        ))}
        <span style={{ color: "var(--ink-muted)", fontSize: "0.78rem", marginLeft: "0.25rem" }}>
          {scenario.title}
        </span>
      </div>

      {/* ── Scenario ── */}
      <section className="scenario-section" aria-labelledby="lab-title">
        <p className="scenario-label">
          scenario ·{" "}
          <span style={{ color: scenario.difficulty === "hard" ? "var(--wrong)" : "var(--accent-hex)" }}>
            {scenario.difficulty}
          </span>
        </p>
        <h1 id="lab-title" className="scenario-title">{scenario.title}</h1>
      </section>

      {/* ── All hints revealed ── */}
      <section className="hint-section" aria-label="Hints">
        <div className="hint-panel" role="list">
          {scenario.hints.map((hint) => (
            <div key={hint.number} className="hint-row revealed" role="listitem">
              <span className="hint-label">hint {String(hint.number).padStart(2, "0")}</span>
              <div className="hint-content-wrap">
                <span className="hint-text">{hint.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Answer + explanation ── */}
      <section id="result-area" aria-label="Result" style={{ marginTop: "2rem" }}>
        <p className="result-answer-label">the bug was</p>
        <p className="result-answer correct">{scenario.bugId.replace(/_/g, " ").toLowerCase()}</p>

        <hr className="result-divider" />

        <div className="result-explanation">
          <p>{scenario.explanation}</p>
          {scenario.source && (
            <p style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--ink-muted)",
              fontStyle: "italic",
            }}>
              {scenario.source.type === "inspired_by" ? "inspired by" : "from"}{" "}
              {scenario.source.url ? (
                <a
                  href={scenario.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--ink-muted)", textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  {scenario.source.label}
                </a>
              ) : (
                scenario.source.label
              )}{" →"}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
