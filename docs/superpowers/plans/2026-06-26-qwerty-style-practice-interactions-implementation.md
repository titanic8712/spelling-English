# Qwerty-Style Practice Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Qwerty-style typing feedback and study metrics to the IELTS spelling trainer.

**Architecture:** Extend the existing spelling controller with active-index helpers, extend `WordAttemptResult` and `SessionSummary` with metrics, and keep all UI changes inside the existing screen components and CSS.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library.

---

### Task 1: Add Failing Interaction Tests

**Files:**
- Modify: `src/domain/spellingController.test.ts`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Test active letter index**

Assert that a new spelling state starts with index `0`, advances after a typed key, and becomes `null` when complete.

- [ ] **Step 2: Test practice UI feedback**

Assert that the first spelling cell has `aria-current="true"` at the start, then the second cell becomes current after typing one letter.

- [ ] **Step 3: Test result and summary metrics**

Assert that a wrong attempt followed by success shows `Accuracy 50%`, `Retries 1`, and `Time`. Assert that a one-word session summary shows `Today accuracy 100%`, `Average spelling time`, and `Need review 0`.

### Task 2: Implement Metrics And Cell States

**Files:**
- Modify: `src/domain/spellingController.ts`
- Modify: `src/domain/types.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/PracticeScreen.tsx`
- Modify: `src/components/SpellingCells.tsx`
- Modify: `src/components/ResultPanel.tsx`
- Modify: `src/components/SummaryScreen.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add active-index helper**

Add `getActiveLetterIndex(state)` that returns the next empty index or `null`.

- [ ] **Step 2: Track word timing and attempt metrics**

Use a ref-based start time in `PracticeScreen`, calculate `durationMs`, `typedCharacterCount`, and `accuracyPercent` on success, and send them through `WordAttemptResult`.

- [ ] **Step 3: Render metrics**

Show accuracy, retry count, and time in `ResultPanel`; show session accuracy, average spelling time, and review count in `SummaryScreen`.

- [ ] **Step 4: Style cell states**

Add `is-active` and `is-filled` cell classes, plus a small metric grid style.

### Task 3: Verify And Publish

**Files:**
- Read: `package.json`

- [ ] **Step 1: Run tests**

Run `npm test -- --reporter=verbose`.

- [ ] **Step 2: Run build and audit**

Run `npm run build` and `npm audit`.

- [ ] **Step 3: Push to GitHub**

Commit the verified changes and update `titanic8712/spelling-English` on GitHub.
