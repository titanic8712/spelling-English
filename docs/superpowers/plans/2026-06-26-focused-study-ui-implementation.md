# Focused Study UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a calm, focused study interface for the IELTS spelling trainer without changing the core practice logic.

**Architecture:** Keep the existing React component structure. Update screen markup only where semantic grouping and visible copy need to change, and put the visual system in `src/styles.css` using local CSS variables.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, CSS.

---

### Task 1: Lock In Focused Study Copy

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/components/TodayScreen.tsx`
- Modify: `src/components/PracticeScreen.tsx`

- [ ] **Step 1: Write failing tests**

Add expectations that the dashboard includes "Today's study plan" and that the practice screen includes "Type what you hear".

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/App.test.tsx --reporter=verbose`

Expected: FAIL because the new focused-study copy is not rendered yet.

- [ ] **Step 3: Update markup**

Add focused-study labels, metric wrappers, and accessible status copy without changing practice behavior.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/App.test.tsx --reporter=verbose`

Expected: PASS for the focused-copy tests and existing app flow tests.

### Task 2: Apply Focused Learning Visual System

**Files:**
- Modify: `src/styles.css`
- Modify: `src/components/ResultPanel.tsx`
- Modify: `src/components/SummaryScreen.tsx`

- [ ] **Step 1: Implement CSS variables and responsive layout**

Add teal, green, amber, neutral variables; improve panels, metric cards, controls, spelling cells, and mobile text wrapping.

- [ ] **Step 2: Respect reduced motion**

Add a `prefers-reduced-motion` block that disables transitions and shake movement.

- [ ] **Step 3: Verify visually**

Run the dev server and inspect `http://127.0.0.1:5190/` at mobile and desktop sizes.

### Task 3: Final Verification

**Files:**
- Read: `package.json`

- [ ] **Step 1: Run app tests**

Run: `npm test -- --reporter=verbose`

Expected: all test files pass.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: TypeScript and Vite build succeed.

- [ ] **Step 3: Run audit**

Run: `npm audit`

Expected: zero vulnerabilities.
