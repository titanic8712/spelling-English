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
