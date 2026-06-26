import type { ReactNode } from "react";
import { PlayCircle } from "lucide-react";

type TodayScreenProps = {
  dailyTarget: number;
  dueReviewCount: number;
  newWordCount: number;
  settingsPanel: ReactNode;
  onStart: () => void;
};

export function TodayScreen({ dailyTarget, dueReviewCount, newWordCount, settingsPanel, onStart }: TodayScreenProps) {
  return (
    <section className="today-panel">
      <div className="today-hero">
        <p className="eyebrow">Focused IELTS practice</p>
        <h1>IELTS Vocabulary Trainer</h1>
        <p className="lead-copy">Practice pronunciation, spelling, and recall in a quiet daily session.</p>
      </div>

      <div className="study-plan" aria-label="Today's study plan">
        <div>
          <p className="section-label">Today's study plan</p>
          <p className="study-plan-copy">Hear American pronunciation, type the word, then review meaning.</p>
        </div>
        <button className="primary-action" type="button" onClick={onStart}>
          <PlayCircle className="button-icon" aria-hidden="true" />
          Start practice
        </button>
      </div>

      <div className="stats-grid">
        <span className="metric-card">{dailyTarget} total questions</span>
        <span className="metric-card">{dueReviewCount} reviews due</span>
        <span className="metric-card">{newWordCount} new words planned</span>
      </div>

      {settingsPanel}
    </section>
  );
}
