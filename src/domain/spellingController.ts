export type SpellingState = {
  targetWord: string;
  letters: string[];
};

const LETTER_PATTERN = /^[a-z]$/i;

export function createSpellingState(targetWord: string): SpellingState {
  return {
    targetWord,
    letters: Array.from({ length: targetWord.length }, () => ""),
  };
}

export function applySpellingKey(state: SpellingState, key: string): SpellingState {
  if (key === "Backspace") {
    const letters = [...state.letters];
    const firstEmptyIndex = letters.findIndex((letter) => letter === "");
    const clearIndex = firstEmptyIndex === -1 ? letters.length - 1 : Math.max(0, firstEmptyIndex - 1);
    letters[clearIndex] = "";
    return { ...state, letters };
  }

  if (!LETTER_PATTERN.test(key)) return state;

  const nextIndex = state.letters.findIndex((letter) => letter === "");
  if (nextIndex === -1) return state;

  const letters = [...state.letters];
  letters[nextIndex] = key;
  return { ...state, letters };
}

export function isComplete(state: SpellingState): boolean {
  return state.letters.every((letter) => letter !== "");
}

export function isCorrect(state: SpellingState): boolean {
  return state.letters.join("").toLowerCase() === state.targetWord.toLowerCase();
}

export function resetTypedLetters(state: SpellingState): SpellingState {
  return createSpellingState(state.targetWord);
}
