import { getDueProgress } from "./reviewScheduler";
import type { WordEntry, WordProgress } from "./types";
import { createWordLibrary } from "./wordLibrary";

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
