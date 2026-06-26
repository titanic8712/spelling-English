import { useEffect, useMemo, useState } from "react";
import type { WordAttemptResult, WordEntry } from "../domain/types";
import { applySpellingKey, createSpellingState, isComplete, isCorrect, resetTypedLetters } from "../domain/spellingController";
import { ResultPanel } from "./ResultPanel";
import { SpellingCells } from "./SpellingCells";

type PracticeScreenProps = {
  word: WordEntry;
  countdownSeconds: number;
  autoplayPronunciation: boolean;
  onComplete: (result: WordAttemptResult) => void;
  playPronunciation: (src: string) => Promise<unknown>;
  playSuccess: () => void;
  playError: () => void;
};

export function PracticeScreen({ word, countdownSeconds, autoplayPronunciation, onComplete, playPronunciation, playSuccess, playError }: PracticeScreenProps) {
  const [state, setState] = useState(() => createSpellingState(word.word));
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    setState(createSpellingState(word.word));
    setWrongAttempts(0);
    setHintUsed(false);
    setShowResult(false);
    setIsShaking(false);
    setCountdown(countdownSeconds);
    setAudioError(false);
  }, [word, countdownSeconds]);

  useEffect(() => {
    if (!autoplayPronunciation) return;
    playPronunciation(word.audioSrc).catch(() => setAudioError(true));
  }, [autoplayPronunciation, playPronunciation, word.audioSrc]);

  useEffect(() => {
    if (!showResult) return;
    if (countdown <= 0) {
      onComplete({
        wordId: word.id,
        cleanSuccess: wrongAttempts === 0 && !hintUsed,
        wrongAttempts,
        hintUsed,
        completedAt: new Date().toISOString(),
      });
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, hintUsed, onComplete, showResult, word.id, wrongAttempts]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (showResult) return;
      setState((current) => {
        const next = applySpellingKey(current, event.key);
        if (!isComplete(next)) return next;
        if (isCorrect(next)) {
          playSuccess();
          setShowResult(true);
          return next;
        }
        playError();
        setWrongAttempts((value) => value + 1);
        setIsShaking(true);
        window.setTimeout(() => setIsShaking(false), 350);
        return resetTypedLetters(next);
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playError, playSuccess, showResult]);

  const assisted = useMemo(() => hintUsed || wrongAttempts > 0, [hintUsed, wrongAttempts]);

  if (showResult) {
    return <ResultPanel word={word} assisted={assisted} countdown={countdown} />;
  }

  return (
    <section className="practice-panel">
      <p className="eyebrow">Listen and spell</p>
      <h1>{word.phonetic}</h1>
      {audioError ? <p role="status">Audio temporarily unavailable</p> : null}
      <div className="practice-actions">
        <button type="button" onClick={() => playPronunciation(word.audioSrc).catch(() => setAudioError(true))}>Replay pronunciation</button>
        <button type="button" onClick={() => setHintUsed(true)}>Show hint</button>
      </div>
      {hintUsed ? <p className="hint-word">{word.word}</p> : null}
      {wrongAttempts > 0 ? <p role="status">Try again</p> : null}
      <SpellingCells letters={state.letters} isShaking={isShaking} />
    </section>
  );
}
