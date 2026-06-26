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
