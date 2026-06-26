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
