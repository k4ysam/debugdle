"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BugType, CATEGORY_LABELS, BugCategory } from "@/data/bug-types";
import { searchBugTypes } from "@/lib/game";

interface Props {
  onSubmit: (bugId: string) => void;
  onReveal: () => void;
  canReveal: boolean;
  hintsRevealed: number;
  guesses: string[];
  disabled?: boolean;
}

function groupByCategory(items: BugType[]): Map<BugCategory, BugType[]> {
  const map = new Map<BugCategory, BugType[]>();
  for (const item of items) {
    const group = map.get(item.category) ?? [];
    group.push(item);
    map.set(item.category, group);
  }
  return map;
}

function findNextSelectableIndex(
  items: BugType[],
  guessed: Set<string>,
  startIndex: number,
  direction: 1 | -1
) {
  let index = startIndex;

  while (index >= 0 && index < items.length) {
    if (!guessed.has(items[index].id)) {
      return index;
    }
    index += direction;
  }

  return -1;
}

export function GuessInput({ onSubmit, onReveal, canReveal, hintsRevealed, guesses, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BugType[]>([]);
  const [selected, setSelected] = useState<BugType | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const guessedSet = new Set(guesses);

  useEffect(() => {
    setResults(searchBugTypes(query));
  }, [query]);

  const selectItem = useCallback((item: BugType) => {
    setSelected(item);
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  }, []);

  const clearSelection = useCallback(() => {
    setSelected(null);
    setQuery("");
    setActiveIndex(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!selected || guessedSet.has(selected.id)) return;
    onSubmit(selected.id);
    setSelected(null);
    setQuery("");
  }, [guessedSet, onSubmit, selected]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown") {
        setOpen(true);
        setActiveIndex(findNextSelectableIndex(results, guessedSet, 0, 1));
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const start = i < 0 ? 0 : i + 1;
        return findNextSelectableIndex(results, guessedSet, start, 1);
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => {
        const start = i < 0 ? results.length - 1 : i - 1;
        return findNextSelectableIndex(results, guessedSet, start, -1);
      });
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const activeItem = results[activeIndex];
      if (activeItem && !guessedSet.has(activeItem.id)) {
        selectItem(activeItem);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!selected || disabled) return;

    const handleSelectedKeys = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const activeElement = document.activeElement;
      const withinGuessInput =
        activeElement === document.body ||
        (!!rootRef.current && !!activeElement && rootRef.current.contains(activeElement));

      if (!withinGuessInput) return;

      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleSelectedKeys);
    return () => window.removeEventListener("keydown", handleSelectedKeys);
  }, [clearSelection, disabled, handleSubmit, selected]);

  const grouped = groupByCategory(results);
  const revealLabel = canReveal ? `reveal hint ${hintsRevealed + 1}` : "all hints revealed";

  return (
    <section ref={rootRef} id="input-area" aria-label="Make a guess">
      <div className="search-wrapper">
        {selected ? (
          <div className="search-selection" aria-live="polite">
            <div className="search-selection-copy">
              <p className="search-selection-label">{selected.label}</p>
              <p className="search-selection-meta">{CATEGORY_LABELS[selected.category]}</p>
            </div>
            <button
              className="search-selection-clear"
              onClick={clearSelection}
              aria-label="Remove guess"
              type="button"
            >
              x
            </button>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="type to search bug categories"
            value={query}
            disabled={disabled}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              const nextResults = searchBugTypes(e.target.value);
              setActiveIndex(findNextSelectableIndex(nextResults, guessedSet, 0, 1));
            }}
            onFocus={() => {
              setOpen(true);
              setActiveIndex(findNextSelectableIndex(results, guessedSet, 0, 1));
            }}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search bug types"
            aria-autocomplete="list"
          />
        )}

        {open && !selected && results.length > 0 && (
          <ul className="dropdown" role="listbox">
            {Array.from(grouped.entries()).map(([cat, items]) => (
              <li key={cat} className="dropdown-group">
                <div className="dropdown-group-label">{CATEGORY_LABELS[cat]}</div>
                {items.map((item) => {
                  const flatIdx = results.indexOf(item);
                  const alreadyGuessed = guessedSet.has(item.id);
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={flatIdx === activeIndex}
                      aria-disabled={alreadyGuessed}
                      className={`dropdown-item${flatIdx === activeIndex ? " active" : ""}${alreadyGuessed ? " dropdown-item--guessed" : ""}`}
                      onMouseDown={() => {
                        if (!alreadyGuessed) {
                          selectItem(item);
                        }
                      }}
                    >
                      <span>{item.label}</span>
                      {alreadyGuessed && <span className="dropdown-flag">already guessed</span>}
                    </div>
                  );
                })}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="actions">
        <button
          className="reveal-link"
          onClick={onReveal}
          disabled={!canReveal || disabled}
          type="button"
        >
          {revealLabel}
        </button>
        <button
          className="submit-btn"
          disabled={!selected || disabled}
          onClick={handleSubmit}
          type="button"
        >
          [submit]
        </button>
      </div>
    </section>
  );
}
