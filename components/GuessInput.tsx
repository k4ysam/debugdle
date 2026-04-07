"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BugType, BUG_TYPES, CATEGORY_LABELS, BugCategory } from "@/data/bug-types";
import { searchBugTypes } from "@/lib/game";

interface Props {
  onSubmit: (bugId: string) => void;
  onReveal: () => void;
  canReveal: boolean;
  hintsRevealed: number;
  disabled?: boolean;
}

// Group bug types by category for the dropdown
function groupByCategory(items: BugType[]): Map<BugCategory, BugType[]> {
  const map = new Map<BugCategory, BugType[]>();
  for (const item of items) {
    const group = map.get(item.category) ?? [];
    group.push(item);
    map.set(item.category, group);
  }
  return map;
}

export function GuessInput({ onSubmit, onReveal, canReveal, hintsRevealed, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BugType[]>([]);
  const [selected, setSelected] = useState<BugType | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setResults(searchBugTypes(query));
  }, [query]);

  const selectItem = useCallback((item: BugType) => {
    setSelected(item);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const clearSelection = () => {
    setSelected(null);
    setQuery("");
    setActiveIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectItem(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;
    onSubmit(selected.id);
    setSelected(null);
    setQuery("");
  };

  const grouped = groupByCategory(results);
  const revealLabel = canReveal ? `reveal hint ${hintsRevealed + 1} →` : "all hints revealed";

  return (
    <section id="input-area" aria-label="Make a guess">
      {/* Search */}
      <div className="search-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="type to search bug categories"
          value={query}
          disabled={disabled || !!selected}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-label="Search bug types"
          aria-autocomplete="list"
        />

        {open && !selected && results.length > 0 && (
          <ul className="dropdown" role="listbox">
            {Array.from(grouped.entries()).map(([cat, items], gi) => (
              <li key={cat} className="dropdown-group">
                <div className="dropdown-group-label">{CATEGORY_LABELS[cat]}</div>
                {items.map((item) => {
                  const flatIdx = results.indexOf(item);
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={flatIdx === activeIndex}
                      className={`dropdown-item${flatIdx === activeIndex ? " active" : ""}`}
                      onMouseDown={() => selectItem(item)}
                    >
                      {item.label}
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pending chip */}
      <div className="pending-chip" aria-live="polite">
        {selected && (
          <>
            [{" "}<span>{selected.label}</span>
            &nbsp;
            <button className="chip-remove" onClick={clearSelection} aria-label="Remove guess">×</button>
            {" "}]
          </>
        )}
      </div>

      {/* Actions */}
      <div className="actions">
        <button
          className="reveal-link"
          onClick={onReveal}
          disabled={!canReveal || disabled}
        >
          {revealLabel}
        </button>
        <button
          className="submit-btn"
          disabled={!selected || disabled}
          onClick={handleSubmit}
        >
          [submit]
        </button>
      </div>
    </section>
  );
}
