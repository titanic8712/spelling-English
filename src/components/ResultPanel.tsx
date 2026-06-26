import type { WordEntry } from "../domain/types";

type ResultPanelProps = {
  word: WordEntry;
  assisted: boolean;
  countdown: number;
};

export function ResultPanel({ word, assisted, countdown }: ResultPanelProps) {
  return (
    <section className="result-panel" aria-live="polite">
      <p className="result-state">{assisted ? "Completed with help" : "Clean success"}</p>
      <h2>{word.word}</h2>
      <p>{word.phonetic}</p>
      <p>{word.meaningZh}</p>
      <p>{word.example}</p>
      <p>Next word in {countdown}</p>
    </section>
  );
}
