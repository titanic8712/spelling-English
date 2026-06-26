import { applySpellingKey, createSpellingState, getActiveLetterIndex, isComplete, isCorrect, resetTypedLetters } from "./spellingController";

it("fills letters in order and ignores non-letter keys", () => {
  let state = createSpellingState("abate");
  state = applySpellingKey(state, "a");
  state = applySpellingKey(state, "1");
  state = applySpellingKey(state, "B");
  expect(state.letters).toEqual(["a", "B", "", "", ""]);
});

it("backspace clears the previous filled cell", () => {
  let state = createSpellingState("abate");
  state = applySpellingKey(state, "a");
  state = applySpellingKey(state, "b");
  state = applySpellingKey(state, "Backspace");
  expect(state.letters).toEqual(["a", "", "", "", ""]);
});

it("judges only when every cell is filled", () => {
  let state = createSpellingState("abate");
  for (const key of ["a", "b", "a", "t"]) state = applySpellingKey(state, key);
  expect(isComplete(state)).toBe(false);
  state = applySpellingKey(state, "e");
  expect(isComplete(state)).toBe(true);
  expect(isCorrect(state)).toBe(true);
});

it("matches case-insensitively and resets after wrong answer", () => {
  let state = createSpellingState("abate");
  for (const key of ["A", "B", "A", "T", "X"]) state = applySpellingKey(state, key);
  expect(isCorrect(state)).toBe(false);
  expect(resetTypedLetters(state).letters).toEqual(["", "", "", "", ""]);
});

it("tracks the active letter index for typing feedback", () => {
  let state = createSpellingState("cat");
  expect(getActiveLetterIndex(state)).toBe(0);

  state = applySpellingKey(state, "c");
  expect(getActiveLetterIndex(state)).toBe(1);

  state = applySpellingKey(state, "a");
  state = applySpellingKey(state, "t");
  expect(getActiveLetterIndex(state)).toBeNull();
});
