import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Volume2 } from "lucide-react";
import type { WordAttemptResult, WordEntry } from "../domain/types";
import { applySpellingKey, createSpellingState, getActiveLetterIndex, isComplete, isCorrect, resetTypedLetters } from "../domain/spellingController";
import { ResultPanel } from "./ResultPanel";
import { SpellingCells } from "./SpellingCells";

type PracticeScreenProps = {
  word: WordEntry;
  countdownSeconds: number;
  autoplayPronunciation: boolean;
  onComplete: (result: WordAttemptResult) => void;
  playPronunciation: (src: string, fallbackWord: string) => Promise<unknown>;
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
  const [attemptResult, setAttemptResult] = useState<WordAttemptResult | null>(null);
  const startedAtRef = useRef(Date.now());
  const completionSentRef = useRef(false);

  useEffect(() => {
    setState(createSpellingState(word.word));
    setWrongAttempts(0);
    setHintUsed(false);
    setShowResult(false);
    setIsShaking(false);
    setCountdown(countdownSeconds);
    setAudioError(false);
    setAttemptResult(null);
    startedAtRef.current = Date.now();
    completionSentRef.current = false;
  }, [word, countdownSeconds]);

  useEffect(() => {
    if (!autoplayPronunciation) return;
    playPronunciation(word.audioSrc, word.word).catch(() => undefined);
  }, [autoplayPronunciation, playPronunciation, word.audioSrc, word.word]);

  async function handleReplay() {
    try {
      await playPronunciation(word.audioSrc, word.word);
      setAudioError(false);
    } catch {
      setAudioError(true);
    }
  }

  useEffect(() => {
    if (!showResult) return;
    if (countdown <= 0) {
      if (completionSentRef.current) return;
      completionSentRef.current = true;
      if (attemptResult != null) onComplete(attemptResult);
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [attemptResult, countdown, onComplete, showResult]);

  function buildAttemptResult(currentWrongAttempts: number): WordAttemptResult {
    const typedCharacterCount = word.word.length * (currentWrongAttempts + 1);
    const accuracyPercent = Math.round((word.word.length / typedCharacterCount) * 100);

    return {
      wordId: word.id,
      cleanSuccess: currentWrongAttempts === 0 && !hintUsed,
      wrongAttempts: currentWrongAttempts,
      hintUsed,
      durationMs: Math.max(0, Date.now() - startedAtRef.current),
      typedCharacterCount,
      accuracyPercent,
      completedAt: new Date().toISOString(),
    };
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (showResult) return;
      setState((current) => {
        const next = applySpellingKey(current, event.key);
        if (!isComplete(next)) return next;
        if (isCorrect(next)) {
          playSuccess();
          setAttemptResult(buildAttemptResult(wrongAttempts));
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
  }, [hintUsed, playError, playSuccess, showResult, word.id, word.word, wrongAttempts]);

  const assisted = useMemo(() => hintUsed || wrongAttempts > 0, [hintUsed, wrongAttempts]);
  const pronunciationLabel = word.phonetic.length > 0 ? word.phonetic : "American pronunciation";
  const activeLetterIndex = getActiveLetterIndex(state);

  if (showResult && attemptResult != null) {
    return <ResultPanel word={word} assisted={assisted} result={attemptResult} countdown={countdown} />;
  }

  return (
    <section className="practice-panel">
      <div className="practice-header">
        <p className="eyebrow">Listen and spell</p>
        <p className="section-label">Type what you hear</p>
        <h1>{pronunciationLabel}</h1>
      </div>

      {audioError ? <p className="status-note" role="status">Audio temporarily unavailable</p> : null}

      <div className="practice-actions" aria-label="Word actions">
        <button className="secondary-action" type="button" onClick={handleReplay}>
          <Volume2 className="button-icon" aria-hidden="true" />
          Replay pronunciation
        </button>
        <button className="quiet-action" type="button" onClick={() => setHintUsed(true)}>
          <Lightbulb className="button-icon" aria-hidden="true" />
          Show hint
        </button>
      </div>

      <div className="spelling-stage">
        {hintUsed ? <p className="hint-word">{word.word}</p> : null}
        {wrongAttempts > 0 ? <p className="status-note retry" role="status">Try again</p> : null}
        <SpellingCells letters={state.letters} activeIndex={activeLetterIndex} isShaking={isShaking} />
      </div>
    </section>
  );
}
