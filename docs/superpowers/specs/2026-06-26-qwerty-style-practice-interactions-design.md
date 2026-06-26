# Qwerty-Style Practice Interactions Design

## Goal

Add typing-trainer interaction patterns inspired by Qwerty Learner while keeping this app focused on IELTS listening, spelling, and review.

## Interaction Requirements

- Highlight the current letter cell so learners always know where the next keypress will land.
- Light up typed cells immediately after each keypress.
- Keep the existing whole-word judgment model: the app judges correctness only when every letter has been typed.
- On a wrong full spelling, play the error feedback, shake the whole spelling row, clear the typed letters, and make the learner retype the full word.
- On success, show attempt metrics before moving to the next word:
  - accuracy percentage
  - retry count
  - typing time
- At the end of a session, show review metrics:
  - today accuracy
  - average spelling time
  - number of words that need review

## Metric Rules

- `wrongAttempts` counts full-word failed submissions.
- `typedCharacterCount` is `(wrongAttempts + 1) * word.length`.
- `accuracyPercent` is `word.length / typedCharacterCount`, rounded to the nearest integer.
- `durationMs` is measured from the time a word screen appears until the successful full spelling.

## Out Of Scope

- No virtual keyboard layout.
- No leaderboard, WPM competition, or typing rank.
- No immediate per-letter error judgment before the word is complete.
- No Qwerty Learner visual clone.
