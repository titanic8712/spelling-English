# IELTS Vocabulary Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Import the MIT-licensed IELTS vocabulary corpus and make non-local audio entries use en-US speech fallback.

**Architecture:** Generate a typed vocabulary module from the upstream `vocabulary.txt`, keep the existing three local-audio sample words first, and export one combined `ieltsWords` array. Update audio playback so an empty `audioSrc` skips local audio and speaks the word directly.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, GitHub API.

---

### Task 1: Add Failing Vocabulary Tests

**Files:**
- Modify: `src/data/ieltsWords.test.ts`
- Modify: `src/domain/audioController.test.ts`

- [ ] **Step 1: Add corpus expectations**

Assert that `ieltsWords` has at least 1,600 entries, includes `atmosphere`, preserves Chinese meaning and category metadata, and has no duplicate IDs.

- [ ] **Step 2: Add speech fallback expectation**

Assert that `playPronunciation("", "atmosphere")` calls the speech fallback without constructing local audio.

- [ ] **Step 3: Run focused tests**

Run: `npm test -- src/data/ieltsWords.test.ts src/domain/audioController.test.ts --reporter=verbose`

Expected: FAIL because the corpus and empty-src fallback are not implemented yet.

### Task 2: Generate And Export Vocabulary

**Files:**
- Create: `src/data/generatedIeltsVocabulary.ts`
- Modify: `src/data/ieltsWords.ts`
- Modify: `src/domain/types.ts`
- Create: `docs/THIRD_PARTY_NOTICES.md`
- Modify: `README.md`

- [ ] **Step 1: Fetch upstream source**

Use `gh api repos/hefengxian/ielts-vocabulary/contents/vocabulary.txt --jq '.content' | base64 --decode`.

- [ ] **Step 2: Parse entries**

Read category headings, skip `+++` and `---`, split vocabulary rows by `|`, and generate unique IDs.

- [ ] **Step 3: Export combined list**

Keep the existing local-audio sample words first, then append generated entries with empty `audioSrc`.

- [ ] **Step 4: Add license notice**

Include the MIT notice for `hefengxian/ielts-vocabulary` in `docs/THIRD_PARTY_NOTICES.md`.

### Task 3: Audio And UI Fallback

**Files:**
- Modify: `src/domain/audioController.ts`
- Modify: `src/components/PracticeScreen.tsx`
- Modify: `src/components/ResultPanel.tsx`

- [ ] **Step 1: Skip local audio when src is empty**

If `src` is empty and `fallbackWord` plus `speakWord` exist, call `speakWord(fallbackWord)` directly.

- [ ] **Step 2: Avoid exposing spelling before typing**

When `word.phonetic` is empty, show `American pronunciation` instead of the word.

- [ ] **Step 3: Preserve result review**

Result review may show the completed word, Chinese meaning, example, and optional source metadata.

### Task 4: Verification

**Files:**
- Read: `package.json`

- [ ] **Step 1: Run focused tests**

Run: `npm test -- src/data/ieltsWords.test.ts src/domain/audioController.test.ts --reporter=verbose`

Expected: PASS.

- [ ] **Step 2: Run full tests**

Run: `npm test -- --reporter=verbose`

Expected: all test files pass.

- [ ] **Step 3: Run production build and audit**

Run: `npm run build` and `npm audit`.

Expected: build succeeds and audit reports zero vulnerabilities.
