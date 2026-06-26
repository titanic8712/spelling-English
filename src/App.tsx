import { useMemo, useState } from "react";
import "./styles.css";
import { PracticeScreen } from "./components/PracticeScreen";
import { SettingsPanel } from "./components/SettingsPanel";
import { SummaryScreen } from "./components/SummaryScreen";
import { TodayScreen } from "./components/TodayScreen";
import { ieltsWords } from "./data/ieltsWords";
import { createAudioController, createBrowserSpeechPlayer, createBrowserTonePlayer } from "./domain/audioController";
import { buildDailySession } from "./domain/practiceEngine";
import { applyReviewResult } from "./domain/reviewScheduler";
import { DEFAULT_SETTINGS, createStorage } from "./domain/storage";
import type { SessionSummary, WordAttemptResult, WordEntry, WordProgress } from "./domain/types";

const storage = createStorage(window.localStorage);
const audio = createAudioController({
  createAudio: (src) => new Audio(src),
  playTone: createBrowserTonePlayer(),
  speakWord: createBrowserSpeechPlayer(),
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
  const [practiceWords, setPracticeWords] = useState<WordEntry[]>([]);
  const [results, setResults] = useState<WordAttemptResult[]>([]);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  function handleStart() {
    setPracticeWords(session.words);
    setResults([]);
    setSummary(null);
    setActiveIndex(0);
    setScreen("practice");
  }

  function handleSaveSettings(nextSettings: typeof settings) {
    setSettings(nextSettings);
    storage.saveSettings(nextSettings);
  }

  function buildSummary(sourceResults: WordAttemptResult[]): SessionSummary {
    const completedCount = sourceResults.length;

    return {
      completedCount,
      cleanSuccessCount: sourceResults.filter((result) => result.cleanSuccess).length,
      averageAccuracyPercent: completedCount === 0
        ? 0
        : Math.round(sourceResults.reduce((sum, result) => sum + result.accuracyPercent, 0) / completedCount),
      averageDurationMs: completedCount === 0
        ? 0
        : Math.round(sourceResults.reduce((sum, result) => sum + result.durationMs, 0) / completedCount),
      retryWordIds: sourceResults.filter((result) => result.wrongAttempts > 0).map((result) => result.wordId),
      hintedWordIds: sourceResults.filter((result) => result.hintUsed).map((result) => result.wordId),
      tomorrowReviewWordIds: sourceResults.filter((result) => !result.cleanSuccess).map((result) => result.wordId),
    };
  }

  function handleWordComplete(result: WordAttemptResult) {
    const baseProgress = progressById[result.wordId] ?? createInitialProgress(result.wordId);
    const nextProgress = {
      ...progressById,
      [result.wordId]: applyReviewResult(baseProgress, result),
    };
    const nextResults = [...results, result];
    setProgressById(nextProgress);
    storage.saveProgress(nextProgress);
    setResults(nextResults);

    if (activeIndex >= practiceWords.length - 1) {
      setSummary(buildSummary(nextResults));
      setScreen("summary");
    } else {
      setActiveIndex((index) => index + 1);
    }
  }

  if (screen === "summary") {
    return (
      <main className="app-shell">
        <SummaryScreen summary={summary ?? buildSummary(results)} onRestart={() => setScreen("today")} />
      </main>
    );
  }

  if (screen === "practice") {
    const activeWord = practiceWords[activeIndex];
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
          key={activeWord.id}
          word={activeWord}
          countdownSeconds={settings.countdownSeconds}
          autoplayPronunciation={settings.autoplayPronunciation}
          onComplete={handleWordComplete}
          playPronunciation={(src, fallbackWord) => audio.playPronunciation(src, fallbackWord)}
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
