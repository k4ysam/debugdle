"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BugType, CATEGORY_LABELS } from "@/data/bug-types";
import { searchBugTypes } from "@/lib/game";

interface Props {
  onSubmit: (bugId: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onSubmit, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BugType[]>([]);
  const [selected, setSelected] = useState<BugType | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (query.length > 0 || open) {
      setResults(searchBugTypes(query));
    }
  }, [query, open]);

  const selectItem = useCallback((item: BugType) => {
    setSelected(item);
    setQuery(item.label);
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        setResults(searchBugTypes(query));
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
  };

  return (
    <div className="guess-input-wrapper">
      <div className="guess-combobox">
        <div className="guess-field">
          <input
            ref={inputRef}
            className="guess-input"
            type="text"
            placeholder="Type to search bug types…"
            value={query}
            disabled={disabled}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(null);
              setOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => {
              setOpen(true);
              setResults(searchBugTypes(query));
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          {selected && (
            <span className="guess-category-badge">
              {CATEGORY_LABELS[selected.category]}
            </span>
          )}
        </div>

        {open && results.length > 0 && (
          <ul ref={listRef} className="guess-dropdown" role="listbox">
            {results.map((item, i) => (
              <li
                key={item.id}
                role="option"
                aria-selected={i === activeIndex}
                className={`guess-option ${i === activeIndex ? "guess-option--active" : ""}`}
                onMouseDown={() => selectItem(item)}
              >
                <span className="guess-option-label">{item.label}</span>
                <span className="guess-option-cat">
                  {CATEGORY_LABELS[item.category]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="guess-submit-btn"
        disabled={!selected || disabled}
        onClick={handleSubmit}
      >
        Submit Guess
      </button>
    </div>
  );
}
