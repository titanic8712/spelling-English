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
