import type { SessionSummary } from "../domain/types";

type SummaryScreenProps = {
  summary: SessionSummary;
  onRestart: () => void;
};

export function SummaryScreen({ summary, onRestart }: SummaryScreenProps) {
  return (
    <section className="summary-panel">
      <h1>Session complete</h1>
      <p>{summary.completedCount} completed</p>
      <p>{summary.cleanSuccessCount} clean successes</p>
      <p>{summary.retryWordIds.length} retry words</p>
      <p>{summary.hintedWordIds.length} hint words</p>
      <button type="button" onClick={onRestart}>Back to today</button>
    </section>
  );
}
