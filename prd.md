# Product Requirements Document (PRD)

## Product Name (Working)

Bugle / Debugdle / StackTrace (TBD)

---

## 1. Overview

A lightweight, browser-based daily game where users diagnose software bugs from progressively revealed hints.

Inspired by Wordle/Doctordle, but tailored for developers:

* No heavy debugging
* No coding required
* Focus on **pattern recognition of common bugs**

Each round presents a real-world engineering issue. Users receive 6 hints and must guess the **underlying bug category**.

---

## 2. Core Value Proposition

* Fast (<30 seconds per round)
* Familiar to developers
* Streamable and shareable
* Subtly reinforces real debugging intuition

---

## 3. Target Users

### Primary

* CS students
* Early-career software engineers
* Interns preparing for technical roles

### Secondary

* Experienced engineers (casual play)
* Streamers (interactive guessing with chat)

---

## 4. Core Gameplay Loop

1. User opens daily challenge
2. Reads Hint 1
3. Types a guess → selects from dropdown suggestions
4. Proceeds through up to 6 hints
5. Submits final guess
6. Sees correct answer + explanation

---

## 5. Key Feature: Controlled Guess Input

### Problem

Free-text answers create:

* Synonym chaos (“async bug” vs “race condition”)
* Frustration due to mismatch

### Solution

**Searchable dropdown with canonical bug categories**

---

### Implementation

* User types into input field
* Autocomplete dropdown appears
* Options filtered from a predefined set (100–200 bug types)

---

### Example Options

#### Async / Timing

* Async race condition
* Missing await
* Promise not handled
* Event loop blocking

#### Frontend

* State not updating
* Infinite re-render
* Missing dependency (useEffect)
* Incorrect conditional rendering

#### Backend

* API timeout
* Incorrect response format
* Unhandled exception

#### Data / DB

* N+1 query problem
* Missing index
* Stale cache

#### Infra / Networking

* CORS issue
* Rate limit exceeded
* DNS resolution failure

---

### Design Requirement

Each bug type must map to a **canonical internal ID**, e.g.:

* ASYNC_RACE_CONDITION
* MISSING_AWAIT
* CORS_ERROR

---

## 6. Hint System

* Exactly 6 hints per scenario
* Each hint:

  * 1–2 lines
  * Introduces new information
  * Eliminates a class of bugs

### Structure

1. User-reported issue (vague)
2. System-level info (backend vs frontend)
3. Observed behavior (logs/network)
4. Code behavior
5. Subtle clue (timing/state)
6. Almost explicit

---

## 7. Answer System

### Rules

* User can guess at any time
* No correctness feedback until final submission
* Final answer must match one canonical bug type

---

## 8. Explanation System

After submission, user sees:

### Components

* Correct answer
* 2–3 paragraph explanation
* Why other common guesses were wrong (optional, later feature)

---

## 9. Content System (CRITICAL)

### Initial Strategy

* Handcrafted scenarios (10–20 high-quality cases)

### Scaling Strategy

* AI-assisted generation (reviewed manually)
* Source inspiration:

  * GitHub issues
  * StackOverflow questions
  * Real-world bugs

---

## 10. UX Requirements

### Input

* Clean text input
* Fast dropdown filtering (<100ms)

### Hint Display

* Sequential reveal
* Scroll or click to reveal next

### Mobile Support

* Fully playable on mobile
* Minimal typing required

---

## 11. Metrics of Success

### Core Metrics

* Daily retention (DAU returning)
* Completion rate per round
* Average hints used before guess

### Engagement Metrics

* Share rate (results)
* Time spent per session (<1 min target)

---

## 12. Differentiation

This is NOT:

* A coding challenge platform
* A debugging simulator

This IS:

* A **pattern recognition game for developers**
* A **lightweight daily habit product**

---

## 13. Risks

### 1. Ambiguity

Multiple valid answers → frustration

Mitigation:

* Strict canonical mapping
* Carefully designed hints

---

### 2. Content Quality Bottleneck

Weak scenarios = dead product

Mitigation:

* Prioritize scenario design over features

---

### 3. Too Niche

Non-devs won’t play

Mitigation:

* Lean into dev audience (don’t generalize)

---

## 14. V1 Scope (2-week build)

### Must Have

* 10 scenarios
* 100–150 bug types
* Hint reveal system
* Dropdown input
* Answer + explanation page

### Not Needed (yet)

* Multiplayer
* Accounts
* Leaderboards
* AI generation

---

## 15. Future Extensions

* Multiplayer / streamer mode
* Weekly hardest bugs
* User-generated scenarios
* “Guess in X hints” scoring system
* Company-specific bug packs (React, AWS, etc.)

---

## Final Note

The success of this product depends almost entirely on:
→ **how satisfying each scenario feels**

Not on tech. Not on UI.

Content is the product.
