import type { ReactNode } from "react";

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
      <p className="eyebrow">Offline IELTS spelling practice</p>
      <h1>IELTS Vocabulary Trainer</h1>
      <div className="stats-grid">
        <span>{dailyTarget} total questions</span>
        <span>{dueReviewCount} reviews due</span>
        <span>{newWordCount} new words planned</span>
      </div>
      {settingsPanel}
      <button type="button" onClick={onStart}>Start practice</button>
    </section>
  );
}
