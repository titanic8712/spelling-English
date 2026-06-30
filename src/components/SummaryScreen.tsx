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
        <span>
          <span className="metric-num">{summary.completedCount}</span>
          <span className="metric-label">completed</span>
        </span>
        <span>
          <span className="metric-num">{summary.cleanSuccessCount}</span>
          <span className="metric-label">clean successes</span>
        </span>
        <span>
          <span className="metric-num">{summary.retryWordIds.length}</span>
          <span className="metric-label">retry words</span>
        </span>
        <span>
          <span className="metric-num">{summary.hintedWordIds.length}</span>
          <span className="metric-label">hint words</span>
        </span>
        <span>
          <span className="metric-num">{summary.averageAccuracyPercent}%</span>
          <span className="metric-label">Today accuracy</span>
        </span>
        <span>
          <span className="metric-num">{formatDuration(summary.averageDurationMs)}</span>
          <span className="metric-label">Average spelling time</span>
        </span>
        <span>
          <span className="metric-num">{summary.tomorrowReviewWordIds.length}</span>
          <span className="metric-label">Need review</span>
        </span>
      </div>
      <button className="primary-action" type="button" onClick={onRestart}>
        <RotateCcw className="button-icon" aria-hidden="true" />
        Back to today
      </button>
    </section>
  );
}
