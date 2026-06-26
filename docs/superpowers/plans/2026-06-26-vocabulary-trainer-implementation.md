# Vocabulary Trainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first offline-first IELTS vocabulary trainer described in `docs/superpowers/specs/2026-06-26-vocabulary-trainer-design.md`.

**Architecture:** Create a React/Vite/TypeScript browser app with focused domain modules for word data, practice session selection, spelling input, review scheduling, audio playback, and local persistence. Keep the first version pure frontend, with local sample data and local audio references.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, jsdom, localStorage, HTML audio.

---

## File Map

- Create: `package.json` - npm scripts and dependencies.
- Create: `index.html` - Vite HTML entry.
- Create: `tsconfig.json` - TypeScript settings.
- Create: `vite.config.ts` - Vite and Vitest config.
- Create: `src/main.tsx` - React mount entry.
- Create: `src/App.tsx` - App state orchestration.
- Create: `src/App.test.tsx` - initial render and later flow tests.
- Create: `src/styles.css` - responsive app styling.
- Create: `src/test/setup.ts` - test environment setup.
- Create: `src/domain/types.ts` - shared domain types.
- Create: `src/data/ieltsWords.ts` - embedded first-version sample word bank.
- Create: `src/domain/wordLibrary.ts` - word lookup and new-word selection.
- Create: `src/domain/wordLibrary.test.ts` - word library tests.
- Create: `src/domain/reviewScheduler.ts` - interval review rules.
- Create: `src/domain/reviewScheduler.test.ts` - scheduler tests.
- Create: `src/domain/practiceEngine.ts` - daily session builder.
- Create: `src/domain/practiceEngine.test.ts` - session selection tests.
- Create: `src/domain/storage.ts` - localStorage adapter and validation.
- Create: `src/domain/storage.test.ts` - storage tests.
- Create: `src/domain/spellingController.ts` - pure spelling-cell state logic.
- Create: `src/domain/spellingController.test.ts` - spelling interaction tests.
- Create: `src/domain/audioController.ts` - pronunciation and sound playback adapter.
- Create: `src/domain/audioController.test.ts` - audio tests with fake players.
- Create: `src/components/TodayScreen.tsx` - dashboard and settings entry.
- Create: `src/components/PracticeScreen.tsx` - active question flow.
- Create: `src/components/SpellingCells.tsx` - fixed cell display.
- Create: `src/components/ResultPanel.tsx` - post-success word details and countdown.
- Create: `src/components/SettingsPanel.tsx` - daily target, countdown, autoplay, and sound settings.
- Create: `src/components/SummaryScreen.tsx` - completed session summary.
- Create: `public/audio/ATTRIBUTION.md` - attribution for word audio files.
- Create: `public/audio/words/en-us-abandon.ogg` - local American pronunciation sample.
- Create: `public/audio/words/en-us-abate.ogg` - local American pronunciation sample.
- Create: `public/audio/words/en-us-abrupt.ogg` - local American pronunciation sample.

Use Wikimedia Commons U.S. English pronunciation files for the three sample audio files and record source file names plus license attribution in `public/audio/ATTRIBUTION.md`. Stop before implementing the audio task if legally usable local files cannot be obtained.

## Task 1: Scaffold React/Vite Test Harness

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create package and config files**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IELTS Vocabulary Trainer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

```ts
// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
  },
});
```

```ts
// src/test/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class TestAudio {
  src: string;

  constructor(src = "") {
    this.src = src;
  }

  play() {
    return Promise.resolve();
  }
}

vi.stubGlobal("Audio", TestAudio);
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 3: Write the failing smoke test**

```tsx
// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders the practice dashboard", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "IELTS Vocabulary Trainer" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Start practice" })).toBeInTheDocument();
});
```

- [ ] **Step 4: Run smoke test to verify it fails**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because `src/App.tsx` does not exist.

- [ ] **Step 5: Create minimal app entry**

```tsx
// src/App.tsx
import "./styles.css";

export default function App() {
  return (
    <main className="app-shell">
      <section className="today-panel">
        <p className="eyebrow">Offline IELTS spelling practice</p>
        <h1>IELTS Vocabulary Trainer</h1>
        <button type="button">Start practice</button>
      </section>
    </main>
  );
}
```

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```css
/* src/styles.css */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172033;
  background: #f7f8fb;
}

button {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.today-panel {
  max-width: 960px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 8px;
  color: #526070;
  font-size: 14px;
}
```

- [ ] **Step 6: Run smoke test to verify it passes**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit scaffold**

```bash
git add package.json package-lock.json index.html tsconfig.json vite.config.ts src
git commit -m "feat: scaffold vocabulary trainer app"
```

## Task 2: Add Domain Types And Word Library

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/data/ieltsWords.ts`
- Create: `src/domain/wordLibrary.ts`
- Create: `src/domain/wordLibrary.test.ts`

- [ ] **Step 1: Write failing word library tests**

```ts
// src/domain/wordLibrary.test.ts
import { createWordLibrary } from "./wordLibrary";
import type { WordEntry, WordProgress } from "./types";

const words: WordEntry[] = [
  { id: "abandon", word: "abandon", phonetic: "/əˈbændən/", meaningZh: "放弃", example: "They had to abandon the plan.", audioSrc: "/audio/words/en-us-abandon.ogg", difficulty: "medium", order: 2 },
  { id: "abate", word: "abate", phonetic: "/əˈbeɪt/", meaningZh: "减弱", example: "The storm began to abate.", audioSrc: "/audio/words/en-us-abate.ogg", difficulty: "medium", order: 1 },
];

it("returns words by id", () => {
  const library = createWordLibrary(words);
  expect(library.getById("abate")?.word).toBe("abate");
});

it("returns new words by configured order and excludes words with progress", () => {
  const progress: Record<string, WordProgress> = {
    abate: { wordId: "abate", reviewStage: 1, nextReviewAt: "2026-06-27", wrongCount: 0, hintUsedCount: 0, lastPracticedAt: "2026-06-26", mastered: false },
  };
  const library = createWordLibrary(words);
  expect(library.getNextNewWords(progress, 5).map((word) => word.id)).toEqual(["abandon"]);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/domain/wordLibrary.test.ts`

Expected: FAIL because domain files do not exist.

- [ ] **Step 3: Add types, sample data, and library implementation**

```ts
// src/domain/types.ts
export type WordDifficulty = "easy" | "medium" | "hard";

export type WordEntry = {
  id: string;
  word: string;
  phonetic: string;
  meaningZh: string;
  example: string;
  audioSrc: string;
  difficulty: WordDifficulty;
  order: number;
};

export type WordProgress = {
  wordId: string;
  reviewStage: number;
  nextReviewAt: string | null;
  wrongCount: number;
  hintUsedCount: number;
  lastPracticedAt: string | null;
  mastered: boolean;
};

export type PracticeSettings = {
  dailyTarget: number;
  countdownSeconds: number;
  autoplayPronunciation: boolean;
  soundEffectsEnabled: boolean;
};

export type WordAttemptResult = {
  wordId: string;
  cleanSuccess: boolean;
  wrongAttempts: number;
  hintUsed: boolean;
  completedAt: string;
};

export type SessionSummary = {
  completedCount: number;
  cleanSuccessCount: number;
  retryWordIds: string[];
  hintedWordIds: string[];
  tomorrowReviewWordIds: string[];
};
```

```ts
// src/data/ieltsWords.ts
import type { WordEntry } from "../domain/types";

export const ieltsWords: WordEntry[] = [
  {
    id: "abandon",
    word: "abandon",
    phonetic: "/əˈbændən/",
    meaningZh: "放弃",
    example: "They had to abandon the plan after the storm.",
    audioSrc: "/audio/words/en-us-abandon.ogg",
    difficulty: "medium",
    order: 1,
  },
  {
    id: "abate",
    word: "abate",
    phonetic: "/əˈbeɪt/",
    meaningZh: "减弱，缓和",
    example: "The noise began to abate after midnight.",
    audioSrc: "/audio/words/en-us-abate.ogg",
    difficulty: "medium",
    order: 2,
  },
  {
    id: "abrupt",
    word: "abrupt",
    phonetic: "/əˈbrʌpt/",
    meaningZh: "突然的，唐突的",
    example: "The meeting came to an abrupt end.",
    audioSrc: "/audio/words/en-us-abrupt.ogg",
    difficulty: "medium",
    order: 3,
  },
];
```

```ts
// src/domain/wordLibrary.ts
import type { WordEntry, WordProgress } from "./types";

export function createWordLibrary(words: WordEntry[]) {
  const sortedWords = [...words].sort((left, right) => left.order - right.order);
  const byId = new Map(sortedWords.map((word) => [word.id, word]));

  return {
    all(): WordEntry[] {
      return sortedWords;
    },
    getById(id: string): WordEntry | undefined {
      return byId.get(id);
    },
    getNextNewWords(progressById: Record<string, WordProgress>, limit: number): WordEntry[] {
      return sortedWords.filter((word) => progressById[word.id] == null).slice(0, limit);
    },
  };
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm test -- src/domain/wordLibrary.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit word library**

```bash
git add src/domain/types.ts src/data/ieltsWords.ts src/domain/wordLibrary.ts src/domain/wordLibrary.test.ts
git commit -m "feat: add vocabulary word library"
```

## Task 3: Add Review Scheduler

**Files:**
- Create: `src/domain/reviewScheduler.ts`
- Create: `src/domain/reviewScheduler.test.ts`

- [ ] **Step 1: Write failing scheduler tests**

```ts
// src/domain/reviewScheduler.test.ts
import { applyReviewResult, getDueProgress, REVIEW_INTERVAL_DAYS } from "./reviewScheduler";
import type { WordProgress } from "./types";

const baseProgress: WordProgress = {
  wordId: "abandon",
  reviewStage: 0,
  nextReviewAt: null,
  wrongCount: 0,
  hintUsedCount: 0,
  lastPracticedAt: null,
  mastered: false,
};

it("advances a clean success to the next interval", () => {
  const updated = applyReviewResult(baseProgress, { wordId: "abandon", cleanSuccess: true, wrongAttempts: 0, hintUsed: false, completedAt: "2026-06-26T10:00:00.000Z" });
  expect(updated.reviewStage).toBe(1);
  expect(updated.nextReviewAt).toBe("2026-06-27");
  expect(REVIEW_INTERVAL_DAYS).toEqual([1, 3, 7, 14, 30]);
});

it("keeps stage and schedules tomorrow after wrong attempts", () => {
  const updated = applyReviewResult({ ...baseProgress, reviewStage: 2 }, { wordId: "abandon", cleanSuccess: false, wrongAttempts: 1, hintUsed: false, completedAt: "2026-06-26T10:00:00.000Z" });
  expect(updated.reviewStage).toBe(2);
  expect(updated.nextReviewAt).toBe("2026-06-27");
  expect(updated.wrongCount).toBe(1);
});

it("keeps stage and schedules tomorrow after hint use", () => {
  const updated = applyReviewResult({ ...baseProgress, reviewStage: 1 }, { wordId: "abandon", cleanSuccess: false, wrongAttempts: 0, hintUsed: true, completedAt: "2026-06-26T10:00:00.000Z" });
  expect(updated.reviewStage).toBe(1);
  expect(updated.nextReviewAt).toBe("2026-06-27");
  expect(updated.hintUsedCount).toBe(1);
});

it("finds due progress on or before today", () => {
  const progress: Record<string, WordProgress> = {
    due: { ...baseProgress, wordId: "due", nextReviewAt: "2026-06-26" },
    future: { ...baseProgress, wordId: "future", nextReviewAt: "2026-06-27" },
  };
  expect(getDueProgress(progress, "2026-06-26").map((item) => item.wordId)).toEqual(["due"]);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/domain/reviewScheduler.test.ts`

Expected: FAIL because `reviewScheduler.ts` does not exist.

- [ ] **Step 3: Implement scheduler**

```ts
// src/domain/reviewScheduler.ts
import type { WordAttemptResult, WordProgress } from "./types";

export const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14, 30] as const;

function addDays(date: Date, days: number): string {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

function toPracticeDate(completedAt: string): Date {
  return new Date(completedAt);
}

export function applyReviewResult(progress: WordProgress, result: WordAttemptResult): WordProgress {
  const practicedAt = toPracticeDate(result.completedAt);
  const wrongCount = progress.wrongCount + result.wrongAttempts;
  const hintUsedCount = progress.hintUsedCount + (result.hintUsed ? 1 : 0);

  if (!result.cleanSuccess) {
    return {
      ...progress,
      wrongCount,
      hintUsedCount,
      lastPracticedAt: result.completedAt,
      nextReviewAt: addDays(practicedAt, 1),
      mastered: false,
    };
  }

  const nextStage = Math.min(progress.reviewStage + 1, REVIEW_INTERVAL_DAYS.length);
  const intervalIndex = Math.min(nextStage - 1, REVIEW_INTERVAL_DAYS.length - 1);

  return {
    ...progress,
    reviewStage: nextStage,
    nextReviewAt: addDays(practicedAt, REVIEW_INTERVAL_DAYS[intervalIndex]),
    wrongCount,
    hintUsedCount,
    lastPracticedAt: result.completedAt,
    mastered: nextStage === REVIEW_INTERVAL_DAYS.length,
  };
}

export function getDueProgress(progressById: Record<string, WordProgress>, today: string): WordProgress[] {
  return Object.values(progressById)
    .filter((progress) => progress.nextReviewAt != null && progress.nextReviewAt <= today)
    .sort((left, right) => {
      if (left.nextReviewAt === right.nextReviewAt) return left.wordId.localeCompare(right.wordId);
      return String(left.nextReviewAt).localeCompare(String(right.nextReviewAt));
    });
}
```

- [ ] **Step 4: Run scheduler tests**

Run: `npm test -- src/domain/reviewScheduler.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit scheduler**

```bash
git add src/domain/reviewScheduler.ts src/domain/reviewScheduler.test.ts
git commit -m "feat: add interval review scheduler"
```

## Task 4: Add Daily Practice Engine

**Files:**
- Create: `src/domain/practiceEngine.ts`
- Create: `src/domain/practiceEngine.test.ts`

- [ ] **Step 1: Write failing practice engine tests**

```ts
// src/domain/practiceEngine.test.ts
import { buildDailySession } from "./practiceEngine";
import type { WordEntry, WordProgress } from "./types";

const words: WordEntry[] = [
  { id: "abandon", word: "abandon", phonetic: "/əˈbændən/", meaningZh: "放弃", example: "They had to abandon the plan.", audioSrc: "/audio/words/en-us-abandon.ogg", difficulty: "medium", order: 1 },
  { id: "abate", word: "abate", phonetic: "/əˈbeɪt/", meaningZh: "减弱", example: "The storm began to abate.", audioSrc: "/audio/words/en-us-abate.ogg", difficulty: "medium", order: 2 },
  { id: "abrupt", word: "abrupt", phonetic: "/əˈbrʌpt/", meaningZh: "突然的", example: "The meeting came to an abrupt end.", audioSrc: "/audio/words/en-us-abrupt.ogg", difficulty: "medium", order: 3 },
];

const dueProgress: WordProgress = { wordId: "abate", reviewStage: 1, nextReviewAt: "2026-06-26", wrongCount: 0, hintUsedCount: 0, lastPracticedAt: "2026-06-25", mastered: false };

it("selects due review words before new words", () => {
  const session = buildDailySession({ words, progressById: { abate: dueProgress }, today: "2026-06-26", dailyTarget: 2 });
  expect(session.words.map((word) => word.id)).toEqual(["abate", "abandon"]);
  expect(session.dueReviewCount).toBe(1);
  expect(session.newWordCount).toBe(1);
});

it("does not exceed the daily target", () => {
  const session = buildDailySession({ words, progressById: {}, today: "2026-06-26", dailyTarget: 2 });
  expect(session.words).toHaveLength(2);
});

it("returns a safe empty session when no words are available", () => {
  const session = buildDailySession({ words: [], progressById: {}, today: "2026-06-26", dailyTarget: 30 });
  expect(session.words).toEqual([]);
  expect(session.isEmpty).toBe(true);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/domain/practiceEngine.test.ts`

Expected: FAIL because `practiceEngine.ts` does not exist.

- [ ] **Step 3: Implement practice engine**

```ts
// src/domain/practiceEngine.ts
import { getDueProgress } from "./reviewScheduler";
import { createWordLibrary } from "./wordLibrary";
import type { WordEntry, WordProgress } from "./types";

export type DailySessionInput = {
  words: WordEntry[];
  progressById: Record<string, WordProgress>;
  today: string;
  dailyTarget: number;
};

export type DailySession = {
  words: WordEntry[];
  dueReviewCount: number;
  newWordCount: number;
  isEmpty: boolean;
};

export function buildDailySession(input: DailySessionInput): DailySession {
  const target = Math.max(0, input.dailyTarget);
  const library = createWordLibrary(input.words);
  const dueWords = getDueProgress(input.progressById, input.today)
    .map((progress) => library.getById(progress.wordId))
    .filter((word): word is WordEntry => word != null)
    .slice(0, target);

  const remainingSlots = Math.max(0, target - dueWords.length);
  const dueIds = new Set(dueWords.map((word) => word.id));
  const newWords = library
    .getNextNewWords(input.progressById, remainingSlots)
    .filter((word) => !dueIds.has(word.id))
    .slice(0, remainingSlots);

  const sessionWords = [...dueWords, ...newWords];

  return {
    words: sessionWords,
    dueReviewCount: dueWords.length,
    newWordCount: newWords.length,
    isEmpty: sessionWords.length === 0,
  };
}
```

- [ ] **Step 4: Run practice engine tests**

Run: `npm test -- src/domain/practiceEngine.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit practice engine**

```bash
git add src/domain/practiceEngine.ts src/domain/practiceEngine.test.ts
git commit -m "feat: add daily practice session engine"
```

## Task 5: Add Local Storage Adapter

**Files:**
- Create: `src/domain/storage.ts`
- Create: `src/domain/storage.test.ts`

- [ ] **Step 1: Write failing storage tests**

```ts
// src/domain/storage.test.ts
import { DEFAULT_SETTINGS, createStorage } from "./storage";
import type { WordProgress } from "./types";

beforeEach(() => {
  window.localStorage.clear();
});

it("loads default settings when none are saved", () => {
  const storage = createStorage(window.localStorage);
  expect(storage.loadSettings()).toEqual(DEFAULT_SETTINGS);
});

it("round-trips settings", () => {
  const storage = createStorage(window.localStorage);
  storage.saveSettings({ dailyTarget: 12, countdownSeconds: 3, autoplayPronunciation: false, soundEffectsEnabled: false });
  expect(storage.loadSettings()).toEqual({ dailyTarget: 12, countdownSeconds: 3, autoplayPronunciation: false, soundEffectsEnabled: false });
});

it("round-trips progress", () => {
  const storage = createStorage(window.localStorage);
  const progress: Record<string, WordProgress> = {
    abandon: { wordId: "abandon", reviewStage: 1, nextReviewAt: "2026-06-27", wrongCount: 0, hintUsedCount: 0, lastPracticedAt: "2026-06-26T10:00:00.000Z", mastered: false },
  };
  storage.saveProgress(progress);
  expect(storage.loadProgress()).toEqual(progress);
});

it("recovers from malformed progress and keeps a backup", () => {
  window.localStorage.setItem("vocab.progress", "{bad json");
  const storage = createStorage(window.localStorage);
  expect(storage.loadProgress()).toEqual({});
  expect(window.localStorage.getItem("vocab.progress.backup")).toBe("{bad json");
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/domain/storage.test.ts`

Expected: FAIL because `storage.ts` does not exist.

- [ ] **Step 3: Implement storage adapter**

```ts
// src/domain/storage.ts
import type { PracticeSettings, WordProgress } from "./types";

const SETTINGS_KEY = "vocab.settings";
const PROGRESS_KEY = "vocab.progress";
const PROGRESS_BACKUP_KEY = "vocab.progress.backup";

export const DEFAULT_SETTINGS: PracticeSettings = {
  dailyTarget: 30,
  countdownSeconds: 5,
  autoplayPronunciation: true,
  soundEffectsEnabled: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSettings(value: unknown): value is PracticeSettings {
  return isRecord(value)
    && typeof value.dailyTarget === "number"
    && typeof value.countdownSeconds === "number"
    && typeof value.autoplayPronunciation === "boolean"
    && typeof value.soundEffectsEnabled === "boolean";
}

function isProgressItem(value: unknown): value is WordProgress {
  return isRecord(value)
    && typeof value.wordId === "string"
    && typeof value.reviewStage === "number"
    && (typeof value.nextReviewAt === "string" || value.nextReviewAt === null)
    && typeof value.wrongCount === "number"
    && typeof value.hintUsedCount === "number"
    && (typeof value.lastPracticedAt === "string" || value.lastPracticedAt === null)
    && typeof value.mastered === "boolean";
}

function parseJson(raw: string | null): unknown {
  if (raw == null) return null;
  return JSON.parse(raw);
}

export function createStorage(storage: Storage) {
  return {
    loadSettings(): PracticeSettings {
      try {
        const parsed = parseJson(storage.getItem(SETTINGS_KEY));
        return isSettings(parsed) ? parsed : DEFAULT_SETTINGS;
      } catch {
        return DEFAULT_SETTINGS;
      }
    },
    saveSettings(settings: PracticeSettings): void {
      storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    },
    loadProgress(): Record<string, WordProgress> {
      const raw = storage.getItem(PROGRESS_KEY);
      try {
        const parsed = parseJson(raw);
        if (!isRecord(parsed)) return {};
        const entries = Object.entries(parsed);
        if (!entries.every(([, value]) => isProgressItem(value))) return {};
        return parsed as Record<string, WordProgress>;
      } catch {
        if (raw != null) storage.setItem(PROGRESS_BACKUP_KEY, raw);
        storage.removeItem(PROGRESS_KEY);
        return {};
      }
    },
    saveProgress(progress: Record<string, WordProgress>): void {
      storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    },
  };
}
```

- [ ] **Step 4: Run storage tests**

Run: `npm test -- src/domain/storage.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit storage adapter**

```bash
git add src/domain/storage.ts src/domain/storage.test.ts
git commit -m "feat: add local progress storage"
```

## Task 6: Add Spelling Controller

**Files:**
- Create: `src/domain/spellingController.ts`
- Create: `src/domain/spellingController.test.ts`

- [ ] **Step 1: Write failing spelling tests**

```ts
// src/domain/spellingController.test.ts
import { applySpellingKey, createSpellingState, isComplete, isCorrect, resetTypedLetters } from "./spellingController";

it("fills letters in order and ignores non-letter keys", () => {
  let state = createSpellingState("abate");
  state = applySpellingKey(state, "a");
  state = applySpellingKey(state, "1");
  state = applySpellingKey(state, "B");
  expect(state.letters).toEqual(["a", "B", "", "", ""]);
});

it("backspace clears the previous filled cell", () => {
  let state = createSpellingState("abate");
  state = applySpellingKey(state, "a");
  state = applySpellingKey(state, "b");
  state = applySpellingKey(state, "Backspace");
  expect(state.letters).toEqual(["a", "", "", "", ""]);
});

it("judges only when every cell is filled", () => {
  let state = createSpellingState("abate");
  for (const key of ["a", "b", "a", "t"]) state = applySpellingKey(state, key);
  expect(isComplete(state)).toBe(false);
  state = applySpellingKey(state, "e");
  expect(isComplete(state)).toBe(true);
  expect(isCorrect(state)).toBe(true);
});

it("matches case-insensitively and resets after wrong answer", () => {
  let state = createSpellingState("abate");
  for (const key of ["A", "B", "A", "T", "X"]) state = applySpellingKey(state, key);
  expect(isCorrect(state)).toBe(false);
  expect(resetTypedLetters(state).letters).toEqual(["", "", "", "", ""]);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/domain/spellingController.test.ts`

Expected: FAIL because `spellingController.ts` does not exist.

- [ ] **Step 3: Implement spelling controller**

```ts
// src/domain/spellingController.ts
export type SpellingState = {
  targetWord: string;
  letters: string[];
};

const LETTER_PATTERN = /^[a-z]$/i;

export function createSpellingState(targetWord: string): SpellingState {
  return {
    targetWord,
    letters: Array.from({ length: targetWord.length }, () => ""),
  };
}

export function applySpellingKey(state: SpellingState, key: string): SpellingState {
  if (key === "Backspace") {
    const letters = [...state.letters];
    const firstEmptyIndex = letters.findIndex((letter) => letter === "");
    const clearIndex = firstEmptyIndex === -1 ? letters.length - 1 : Math.max(0, firstEmptyIndex - 1);
    letters[clearIndex] = "";
    return { ...state, letters };
  }

  if (!LETTER_PATTERN.test(key)) return state;

  const nextIndex = state.letters.findIndex((letter) => letter === "");
  if (nextIndex === -1) return state;

  const letters = [...state.letters];
  letters[nextIndex] = key;
  return { ...state, letters };
}

export function isComplete(state: SpellingState): boolean {
  return state.letters.every((letter) => letter !== "");
}

export function isCorrect(state: SpellingState): boolean {
  return state.letters.join("").toLowerCase() === state.targetWord.toLowerCase();
}

export function resetTypedLetters(state: SpellingState): SpellingState {
  return createSpellingState(state.targetWord);
}
```

- [ ] **Step 4: Run spelling tests**

Run: `npm test -- src/domain/spellingController.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit spelling controller**

```bash
git add src/domain/spellingController.ts src/domain/spellingController.test.ts
git commit -m "feat: add spelling cell controller"
```

## Task 7: Add Audio Controller And Sample Audio Assets

**Files:**
- Create: `src/domain/audioController.ts`
- Create: `src/domain/audioController.test.ts`
- Create: `public/audio/ATTRIBUTION.md`
- Create: `public/audio/words/en-us-abandon.ogg`
- Create: `public/audio/words/en-us-abate.ogg`
- Create: `public/audio/words/en-us-abrupt.ogg`

- [ ] **Step 1: Add legally usable local audio files**

Use the U.S. English pronunciation files for `abandon`, `abate`, and `abrupt` from Wikimedia Commons, save them with the filenames listed above, and record attribution:

```md
<!-- public/audio/ATTRIBUTION.md -->
# Audio Attribution

Word pronunciation samples are bundled for offline first-version testing.

- `en-us-abandon.ogg`: Wikimedia Commons `File:En-us-abandon.ogg`, U.S. English pronunciation, https://commons.wikimedia.org/wiki/File:En-us-abandon.ogg
- `en-us-abate.ogg`: Wikimedia Commons `File:En-us-abate.ogg`, U.S. English pronunciation, https://commons.wikimedia.org/wiki/File:En-us-abate.ogg
- `en-us-abrupt.ogg`: Wikimedia Commons `File:En-us-abrupt.ogg`, U.S. English pronunciation, https://commons.wikimedia.org/wiki/File:En-us-abrupt.ogg
```

Run: `ls public/audio/words`

Expected: the three `.ogg` files are present.

- [ ] **Step 2: Write failing audio controller tests**

```ts
// src/domain/audioController.test.ts
import { createAudioController } from "./audioController";

it("plays pronunciation with the provided audio factory", async () => {
  const played: string[] = [];
  const controller = createAudioController({
    createAudio: (src) => ({ play: () => { played.push(src); return Promise.resolve(); } }),
    playTone: () => undefined,
  });

  await expect(controller.playPronunciation("/audio/words/en-us-abate.ogg")).resolves.toBeUndefined();
  expect(played).toEqual(["/audio/words/en-us-abate.ogg"]);
});

it("reports pronunciation playback failure without throwing away the app flow", async () => {
  const controller = createAudioController({
    createAudio: () => ({ play: () => Promise.reject(new Error("missing")) }),
    playTone: () => undefined,
  });

  await expect(controller.playPronunciation("/missing.ogg")).rejects.toThrow("missing");
});

it("plays success and error tones", () => {
  const tones: string[] = [];
  const controller = createAudioController({
    createAudio: (src) => ({ play: () => Promise.resolve(src) }),
    playTone: (tone) => tones.push(tone),
  });

  controller.playSuccess();
  controller.playError();
  expect(tones).toEqual(["success", "error"]);
});
```

- [ ] **Step 3: Run tests to verify failure**

Run: `npm test -- src/domain/audioController.test.ts`

Expected: FAIL because `audioController.ts` does not exist.

- [ ] **Step 4: Implement audio controller**

```ts
// src/domain/audioController.ts
type PlayableAudio = {
  play: () => Promise<unknown>;
};

type AudioControllerDeps = {
  createAudio: (src: string) => PlayableAudio;
  playTone: (tone: "success" | "error") => void;
};

export function createBrowserTonePlayer() {
  return (tone: "success" | "error") => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = tone === "success" ? 660 : 180;
    gain.gain.value = 0.06;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.16);
  };
}

export function createAudioController(deps: AudioControllerDeps) {
  return {
    playPronunciation(src: string): Promise<unknown> {
      return deps.createAudio(src).play();
    },
    playSuccess(): void {
      deps.playTone("success");
    },
    playError(): void {
      deps.playTone("error");
    },
  };
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
```

- [ ] **Step 5: Run audio tests**

Run: `npm test -- src/domain/audioController.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit audio controller and sample assets**

```bash
git add src/domain/audioController.ts src/domain/audioController.test.ts public/audio
git commit -m "feat: add local audio playback"
```

## Task 8: Build React Practice Flow

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Create: `src/components/TodayScreen.tsx`
- Create: `src/components/PracticeScreen.tsx`
- Create: `src/components/SpellingCells.tsx`
- Create: `src/components/ResultPanel.tsx`
- Create: `src/components/SettingsPanel.tsx`
- Create: `src/components/SummaryScreen.tsx`

- [ ] **Step 1: Replace smoke test with user-flow tests**

```tsx
// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

beforeEach(() => {
  window.localStorage.clear();
});

it("starts a daily session from the dashboard", async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(screen.getByText("30 total questions")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Start practice" }));

  expect(screen.getByText("/əˈbændən/")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Replay pronunciation" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show hint" })).toBeInTheDocument();
});

it("updates settings from the dashboard", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.clear(screen.getByLabelText("Daily target"));
  await user.type(screen.getByLabelText("Daily target"), "12");
  await user.clear(screen.getByLabelText("Countdown seconds"));
  await user.type(screen.getByLabelText("Countdown seconds"), "3");
  await user.click(screen.getByLabelText("Autoplay pronunciation"));
  await user.click(screen.getByLabelText("Sound effects"));
  await user.click(screen.getByRole("button", { name: "Save settings" }));

  expect(screen.getByText("12 total questions")).toBeInTheDocument();
});

it("shows a wrong attempt, clears cells, and then accepts the correct spelling", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Start practice" }));

  await user.keyboard("abandox");
  expect(screen.getByText("Try again")).toBeInTheDocument();

  await user.keyboard("abandon");
  expect(screen.getByText("放弃")).toBeInTheDocument();
  expect(screen.getByText("They had to abandon the plan after the storm.")).toBeInTheDocument();
});

it("reveals a hint and marks the word as assisted", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Start practice" }));
  await user.click(screen.getByRole("button", { name: "Show hint" }));

  expect(screen.getByText("abandon")).toBeInTheDocument();
  await user.keyboard("abandon");
  expect(screen.getByText("Completed with help")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test -- src/App.test.tsx`

Expected: FAIL because the full practice flow is not implemented.

- [ ] **Step 3: Implement UI components**

```tsx
// src/components/SpellingCells.tsx
type SpellingCellsProps = {
  letters: string[];
  isShaking: boolean;
};

export function SpellingCells({ letters, isShaking }: SpellingCellsProps) {
  return (
    <div className={isShaking ? "spelling-cells shake" : "spelling-cells"} aria-label="Spelling cells">
      {letters.map((letter, index) => (
        <span className="spelling-cell" key={`${index}-${letter}`} aria-label={`Letter ${index + 1}`}>
          {letter}
        </span>
      ))}
    </div>
  );
}
```

```tsx
// src/components/ResultPanel.tsx
import type { WordEntry } from "../domain/types";

type ResultPanelProps = {
  word: WordEntry;
  assisted: boolean;
  countdown: number;
};

export function ResultPanel({ word, assisted, countdown }: ResultPanelProps) {
  return (
    <section className="result-panel" aria-live="polite">
      <p className="result-state">{assisted ? "Completed with help" : "Clean success"}</p>
      <h2>{word.word}</h2>
      <p>{word.phonetic}</p>
      <p>{word.meaningZh}</p>
      <p>{word.example}</p>
      <p>Next word in {countdown}</p>
    </section>
  );
}
```

```tsx
// src/components/TodayScreen.tsx
import type { ReactNode } from "react";

type TodayScreenProps = {
  dailyTarget: number;
  dueReviewCount: number;
  newWordCount: number;
  settingsPanel: ReactNode;
  onStart: () => void;
};

export function TodayScreen({ dailyTarget, dueReviewCount, newWordCount, settingsPanel, onStart }: TodayScreenProps) {
  return (
    <section className="today-panel">
      <p className="eyebrow">Offline IELTS spelling practice</p>
      <h1>IELTS Vocabulary Trainer</h1>
      <div className="stats-grid">
        <span>{dailyTarget} total questions</span>
        <span>{dueReviewCount} reviews due</span>
        <span>{newWordCount} new words planned</span>
      </div>
      {settingsPanel}
      <button type="button" onClick={onStart}>Start practice</button>
    </section>
  );
}
```

```tsx
// src/components/SettingsPanel.tsx
import { useState } from "react";
import type { PracticeSettings } from "../domain/types";

type SettingsPanelProps = {
  settings: PracticeSettings;
  onSave: (settings: PracticeSettings) => void;
};

export function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [dailyTarget, setDailyTarget] = useState(String(settings.dailyTarget));
  const [countdownSeconds, setCountdownSeconds] = useState(String(settings.countdownSeconds));
  const [autoplayPronunciation, setAutoplayPronunciation] = useState(settings.autoplayPronunciation);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(settings.soundEffectsEnabled);

  function saveSettings() {
    onSave({
      dailyTarget: Math.max(1, Number(dailyTarget) || settings.dailyTarget),
      countdownSeconds: Math.max(1, Number(countdownSeconds) || settings.countdownSeconds),
      autoplayPronunciation,
      soundEffectsEnabled,
    });
  }

  return (
    <section className="settings-panel" aria-label="Practice settings">
      <label>
        Daily target
        <input
          min={1}
          type="number"
          value={dailyTarget}
          onChange={(event) => setDailyTarget(event.target.value)}
        />
      </label>
      <label>
        Countdown seconds
        <input
          min={1}
          type="number"
          value={countdownSeconds}
          onChange={(event) => setCountdownSeconds(event.target.value)}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={autoplayPronunciation}
          onChange={(event) => setAutoplayPronunciation(event.target.checked)}
        />
        Autoplay pronunciation
      </label>
      <label>
        <input
          type="checkbox"
          checked={soundEffectsEnabled}
          onChange={(event) => setSoundEffectsEnabled(event.target.checked)}
        />
        Sound effects
      </label>
      <button type="button" onClick={saveSettings}>Save settings</button>
    </section>
  );
}
```

```tsx
// src/components/SummaryScreen.tsx
import type { SessionSummary } from "../domain/types";

type SummaryScreenProps = {
  summary: SessionSummary;
  onRestart: () => void;
};

export function SummaryScreen({ summary, onRestart }: SummaryScreenProps) {
  return (
    <section className="summary-panel">
      <h1>Session complete</h1>
      <p>{summary.completedCount} completed</p>
      <p>{summary.cleanSuccessCount} clean successes</p>
      <p>{summary.retryWordIds.length} retry words</p>
      <p>{summary.hintedWordIds.length} hint words</p>
      <button type="button" onClick={onRestart}>Back to today</button>
    </section>
  );
}
```

```tsx
// src/components/PracticeScreen.tsx
import { useEffect, useMemo, useState } from "react";
import type { WordEntry, WordAttemptResult } from "../domain/types";
import { applySpellingKey, createSpellingState, isComplete, isCorrect, resetTypedLetters } from "../domain/spellingController";
import { ResultPanel } from "./ResultPanel";
import { SpellingCells } from "./SpellingCells";

type PracticeScreenProps = {
  word: WordEntry;
  countdownSeconds: number;
  autoplayPronunciation: boolean;
  onComplete: (result: WordAttemptResult) => void;
  playPronunciation: (src: string) => Promise<unknown>;
  playSuccess: () => void;
  playError: () => void;
};

export function PracticeScreen({ word, countdownSeconds, autoplayPronunciation, onComplete, playPronunciation, playSuccess, playError }: PracticeScreenProps) {
  const [state, setState] = useState(() => createSpellingState(word.word));
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    setState(createSpellingState(word.word));
    setWrongAttempts(0);
    setHintUsed(false);
    setShowResult(false);
    setIsShaking(false);
    setCountdown(countdownSeconds);
    setAudioError(false);
  }, [word, countdownSeconds]);

  useEffect(() => {
    if (!autoplayPronunciation) return;
    playPronunciation(word.audioSrc).catch(() => setAudioError(true));
  }, [autoplayPronunciation, playPronunciation, word.audioSrc]);

  useEffect(() => {
    if (!showResult) return;
    if (countdown <= 0) {
      onComplete({
        wordId: word.id,
        cleanSuccess: wrongAttempts === 0 && !hintUsed,
        wrongAttempts,
        hintUsed,
        completedAt: new Date().toISOString(),
      });
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, hintUsed, onComplete, showResult, word.id, wrongAttempts]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (showResult) return;
      setState((current) => {
        const next = applySpellingKey(current, event.key);
        if (!isComplete(next)) return next;
        if (isCorrect(next)) {
          playSuccess();
          setShowResult(true);
          return next;
        }
        playError();
        setWrongAttempts((value) => value + 1);
        setIsShaking(true);
        window.setTimeout(() => setIsShaking(false), 350);
        return resetTypedLetters(next);
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playError, playSuccess, showResult]);

  const assisted = useMemo(() => hintUsed || wrongAttempts > 0, [hintUsed, wrongAttempts]);

  if (showResult) {
    return <ResultPanel word={word} assisted={assisted} countdown={countdown} />;
  }

  return (
    <section className="practice-panel">
      <p className="eyebrow">Listen and spell</p>
      <h1>{word.phonetic}</h1>
      {audioError ? <p role="status">Audio temporarily unavailable</p> : null}
      <div className="practice-actions">
        <button type="button" onClick={() => playPronunciation(word.audioSrc).catch(() => setAudioError(true))}>Replay pronunciation</button>
        <button type="button" onClick={() => setHintUsed(true)}>Show hint</button>
      </div>
      {hintUsed ? <p className="hint-word">{word.word}</p> : null}
      {wrongAttempts > 0 ? <p role="status">Try again</p> : null}
      <SpellingCells letters={state.letters} isShaking={isShaking} />
    </section>
  );
}
```

- [ ] **Step 4: Wire app state**

```tsx
// src/App.tsx
import { useMemo, useState } from "react";
import "./styles.css";
import { TodayScreen } from "./components/TodayScreen";
import { PracticeScreen } from "./components/PracticeScreen";
import { SummaryScreen } from "./components/SummaryScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { ieltsWords } from "./data/ieltsWords";
import { applyReviewResult } from "./domain/reviewScheduler";
import { buildDailySession } from "./domain/practiceEngine";
import { createAudioController, createBrowserTonePlayer } from "./domain/audioController";
import { DEFAULT_SETTINGS, createStorage } from "./domain/storage";
import type { SessionSummary, WordAttemptResult, WordProgress } from "./domain/types";

const storage = createStorage(window.localStorage);
const audio = createAudioController({
  createAudio: (src) => new Audio(src),
  playTone: createBrowserTonePlayer(),
});

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function createInitialProgress(wordId: string): WordProgress {
  return {
    wordId,
    reviewStage: 0,
    nextReviewAt: null,
    wrongCount: 0,
    hintUsedCount: 0,
    lastPracticedAt: null,
    mastered: false,
  };
}

export default function App() {
  const [settings, setSettings] = useState(() => storage.loadSettings() ?? DEFAULT_SETTINGS);
  const [progressById, setProgressById] = useState(() => storage.loadProgress());
  const session = useMemo(() => buildDailySession({ words: ieltsWords, progressById, today: todayIsoDate(), dailyTarget: settings.dailyTarget }), [progressById, settings.dailyTarget]);
  const [screen, setScreen] = useState<"today" | "practice" | "summary">("today");
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<WordAttemptResult[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  function handleStart() {
    setResults([]);
    setSummary(null);
    setActiveIndex(0);
    setScreen("practice");
  }

  function handleSaveSettings(nextSettings: typeof settings) {
    setSettings(nextSettings);
    storage.saveSettings(nextSettings);
  }

  function handleWordComplete(result: WordAttemptResult) {
    const baseProgress = progressById[result.wordId] ?? createInitialProgress(result.wordId);
    const nextProgress = {
      ...progressById,
      [result.wordId]: applyReviewResult(baseProgress, result),
    };
    setProgressById(nextProgress);
    storage.saveProgress(nextProgress);
    const nextResults = [...results, result];
    setResults(nextResults);

    if (activeIndex >= session.words.length - 1) {
      setSummary(buildSummary(nextResults));
      setScreen("summary");
    } else {
      setActiveIndex((index) => index + 1);
    }
  }

  function buildSummary(sourceResults: WordAttemptResult[]): SessionSummary {
    return {
      completedCount: sourceResults.length,
      cleanSuccessCount: sourceResults.filter((result) => result.cleanSuccess).length,
      retryWordIds: sourceResults.filter((result) => result.wrongAttempts > 0).map((result) => result.wordId),
      hintedWordIds: sourceResults.filter((result) => result.hintUsed).map((result) => result.wordId),
      tomorrowReviewWordIds: sourceResults.filter((result) => !result.cleanSuccess).map((result) => result.wordId),
    };
  }

  if (screen === "summary") {
    return (
      <main className="app-shell">
        <SummaryScreen summary={summary ?? buildSummary(results)} onRestart={() => setScreen("today")} />
      </main>
    );
  }

  if (screen === "practice") {
    const activeWord = session.words[activeIndex];
    if (activeWord == null) {
      return (
        <main className="app-shell">
          <section className="today-panel">
            <h1>No words available today</h1>
            <button type="button" onClick={() => setScreen("today")}>Back to today</button>
          </section>
        </main>
      );
    }

    return (
      <main className="app-shell">
        <PracticeScreen
          word={activeWord}
          countdownSeconds={settings.countdownSeconds}
          autoplayPronunciation={settings.autoplayPronunciation}
          onComplete={handleWordComplete}
          playPronunciation={(src) => audio.playPronunciation(src)}
          playSuccess={() => {
            if (settings.soundEffectsEnabled) audio.playSuccess();
          }}
          playError={() => {
            if (settings.soundEffectsEnabled) audio.playError();
          }}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <TodayScreen
        dailyTarget={settings.dailyTarget}
        dueReviewCount={session.dueReviewCount}
        newWordCount={session.newWordCount}
        settingsPanel={<SettingsPanel settings={settings} onSave={handleSaveSettings} />}
        onStart={handleStart}
      />
    </main>
  );
}
```

- [ ] **Step 5: Run UI tests**

Run: `npm test -- src/App.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit practice UI**

```bash
git add src/App.tsx src/App.test.tsx src/components
git commit -m "feat: build vocabulary practice flow"
```

## Task 9: Add Responsive Styling And Final Verification

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Add responsive styles and animation**

```css
/* src/styles.css */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172033;
  background: #f7f8fb;
}

button {
  min-height: 40px;
  border: 1px solid #2f5d8c;
  border-radius: 8px;
  padding: 0 14px;
  color: #ffffff;
  background: #2f5d8c;
  font: inherit;
  cursor: pointer;
}

button:focus-visible {
  outline: 3px solid #f2c94c;
  outline-offset: 2px;
}

.app-shell {
  min-height: 100vh;
  padding: 32px;
}

.today-panel,
.practice-panel,
.summary-panel,
.result-panel {
  width: min(960px, 100%);
  margin: 0 auto;
}

.eyebrow,
.result-state {
  margin: 0 0 8px;
  color: #526070;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0;
}

.stats-grid span,
.result-panel,
.summary-panel {
  border: 1px solid #d8dee8;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}

.settings-panel {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0 0 24px;
  padding: 16px;
  border: 1px solid #d8dee8;
  border-radius: 8px;
  background: #ffffff;
}

.settings-panel label {
  display: grid;
  gap: 6px;
  color: #526070;
  font-size: 14px;
}

.settings-panel input[type="number"] {
  width: 100%;
  min-height: 38px;
  border: 1px solid #b9c3d0;
  border-radius: 8px;
  padding: 0 10px;
  font: inherit;
}

.practice-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0;
}

.hint-word {
  color: #7a3f00;
  font-size: 24px;
  font-weight: 700;
}

.spelling-cells {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.spelling-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(38px, 8vw, 56px);
  aspect-ratio: 1;
  border: 2px solid #8291a5;
  border-radius: 8px;
  background: #ffffff;
  font-size: 26px;
  font-weight: 700;
  text-transform: uppercase;
}

.shake {
  animation: shake 280ms ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

@media (max-width: 640px) {
  .app-shell {
    padding: 18px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .settings-panel {
    grid-template-columns: 1fr;
  }

  .practice-panel h1 {
    font-size: 28px;
  }
}
```

- [ ] **Step 2: Run full test suite**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: TypeScript compiles and Vite builds successfully.

- [ ] **Step 4: Start dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL such as `http://127.0.0.1:5173/`.

- [ ] **Step 5: Manual desktop check**

Open the local URL and verify:

- Dashboard shows 30 total questions.
- Start practice opens the first word.
- Pronunciation attempts to autoplay.
- Typing `abandox` shows "Try again", shakes the cells, and clears the cells.
- Typing `abandon` shows the result panel.
- The result panel countdown advances to the next word.

- [ ] **Step 6: Manual mobile-width check**

Use browser responsive mode around 390px width and verify:

- Dashboard text does not overlap.
- Spelling cells wrap or shrink without covering controls.
- Replay and hint buttons remain tappable.

- [ ] **Step 7: Commit styling and verification fixes**

```bash
git add src/styles.css
git commit -m "style: polish vocabulary trainer layout"
```

## Self-Review Checklist

- Spec coverage: Tasks cover the offline frontend app, built-in word data, local audio references, success/error sounds, daily target, 5-second countdown, local progress storage, interval review, spelling cells, hint behavior, wrong-answer retry, summary, desktop-first layout, mobile readability, and tests.
- Red flag scan: Every task contains concrete file paths, commands, and implementation details.
- Type consistency: `WordEntry`, `WordProgress`, `PracticeSettings`, `WordAttemptResult`, and `SessionSummary` are defined once in `src/domain/types.ts` and reused by later tasks.
- Scope check: Cloud sync, accounts, online fetching, full import, native mobile packaging, and custom mobile keyboard remain out of scope.
