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
