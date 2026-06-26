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
