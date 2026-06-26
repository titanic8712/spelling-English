import type { SessionSummary } from "../domain/types";
import { RotateCcw } from "lucide-react";

type SummaryScreenProps = {
  summary: SessionSummary;
  onRestart: () => void;
};

function formatDuration(durationMs: number) {
  return `${(durationMs / 1000).toFixed(1)}s`;
}

export function SummaryScreen({ summary, onRestart }: SummaryScreenProps) {
  return (
    <section className="summary-panel">
      <p className="eyebrow">Study session finished</p>
      <h1>Session complete</h1>
      <div className="summary-grid">
        <span>{summary.completedCount} completed</span>
        <span>{summary.cleanSuccessCount} clean successes</span>
        <span>{summary.retryWordIds.length} retry words</span>
        <span>{summary.hintedWordIds.length} hint words</span>
        <span>Today accuracy {summary.averageAccuracyPercent}%</span>
        <span>Average spelling time {formatDuration(summary.averageDurationMs)}</span>
        <span>Need review {summary.tomorrowReviewWordIds.length}</span>
      </div>
      <button className="primary-action" type="button" onClick={onRestart}>
        <RotateCcw className="button-icon" aria-hidden="true" />
        Back to today
      </button>
    </section>
  );
}
