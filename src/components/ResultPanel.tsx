import type { WordAttemptResult, WordEntry } from "../domain/types";

type ResultPanelProps = {
  word: WordEntry;
  assisted: boolean;
  result: WordAttemptResult;
  countdown: number;
};

function formatDuration(durationMs: number) {
  return `${(durationMs / 1000).toFixed(1)}s`;
}

export function ResultPanel({ word, assisted, result, countdown }: ResultPanelProps) {
  return (
    <section className="result-panel" aria-live="polite">
      <p className="result-state">{assisted ? "Completed with help" : "Clean success"}</p>
      <h2>{word.word}</h2>
      <div className="metric-strip" aria-label="Attempt metrics">
        <span>Accuracy {result.accuracyPercent}%</span>
        <span>Retries {result.wrongAttempts}</span>
        <span>Time {formatDuration(result.durationMs)}</span>
      </div>
      <p className="phonetic-line">{word.phonetic || "American pronunciation via browser voice"}</p>
      <p className="meaning-line">{word.meaningZh}</p>
      {word.example.length > 0 ? <blockquote>{word.example}</blockquote> : null}
      {word.category ? <p className="source-line">{word.category}</p> : null}
      <p className="countdown-note">Next word in {countdown}</p>
    </section>
  );
}
