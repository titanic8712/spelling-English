import { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Volume2 } from "lucide-react";
import type { WordAttemptResult, WordEntry } from "../domain/types";
import { applySpellingKey, createSpellingState, isComplete, isCorrect, resetTypedLetters } from "../domain/spellingController";
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
  const completionSentRef = useRef(false);

  useEffect(() => {
    setState(createSpellingState(word.word));
    setWrongAttempts(0);
    setHintUsed(false);
    setShowResult(false);
    setIsShaking(false);
    setCountdown(countdownSeconds);
    setAudioError(false);
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
  const pronunciationLabel = word.phonetic.length > 0 ? word.phonetic : "American pronunciation";

  if (showResult) {
    return <ResultPanel word={word} assisted={assisted} countdown={countdown} />;
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
        <SpellingCells letters={state.letters} isShaking={isShaking} />
      </div>
    </section>
  );
}
