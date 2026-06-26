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
