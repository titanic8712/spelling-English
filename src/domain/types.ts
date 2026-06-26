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
  category?: string;
  partOfSpeech?: string;
  note?: string;
  source?: string;
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
