# IELTS Vocabulary Trainer Design

Date: 2026-06-26
Status: Draft for user review

## Goal

Build an offline-first vocabulary practice system for an English learner around
B1/B2 level who wants daily IELTS spelling practice with American pronunciation.
The first version should make the daily habit smooth: hear the word, see the
phonetic transcription, spell the word from memory, get immediate feedback, and
move through a fixed daily workload.

## First-Version Scope

The first version is a pure frontend browser app. It should work offline after
assets are loaded, prioritize desktop keyboard practice, and remain usable on
mobile browser widths. Learning progress is saved locally in the browser. Cloud
sync, accounts, online word fetching, custom word import, and complex adaptive
algorithms are later enhancements.

The app includes:

- Built-in IELTS word data.
- Built-in real American pronunciation audio for each included word.
- Built-in success and error sound effects.
- Daily practice target setting, defaulting to 30 total questions.
- Adjustable post-answer countdown, defaulting to 5 seconds.
- Local progress persistence.
- Interval review scheduling.

## Product Decisions

### Practice Mode

Use strict mixed recall. Each question initially hides the English spelling,
shows the phonetic transcription, and automatically plays the American
pronunciation once. The user spells the word from memory.

The user may click a hint control at any time to reveal the full word. If a hint
is used, the word can still be completed, but that attempt is marked as weak
mastery and the word does not advance to a longer review interval.

### Daily Workload

The daily target is a total number of questions, not separate new-word and
review-word quotas. The system fills the session by selecting due review words
first, then adds new IELTS words until the daily target is reached.

Example: if the target is 30 and 12 review words are due, the session contains
12 review words and 18 new words.

### Word Source

Use an embedded IELTS vocabulary list. Each word entry includes the spelling,
phonetic transcription, Chinese meaning, example sentence, pronunciation audio
path, difficulty, and ordering metadata.

The first-version word bank should contain single alphabetic words only. Phrases,
spaces, hyphenated words, apostrophes, and other punctuation can be added later
after the spelling-cell interaction has explicit rules for them.

For the first implementation, the word list may be a legally usable sample set
that proves the full workflow. The data model must support expanding to a full
IELTS list later without changing the practice engine.

### Pronunciation

Use local real American pronunciation audio rather than browser text-to-speech.
Each word references a local audio file. If an audio file is missing or fails to
load, the app shows a non-blocking message and still allows spelling practice.

### Platform

Support desktop and mobile browser layouts, but optimize the first version for
desktop keyboard practice. Mobile should remain readable and usable, but it does
not need a custom virtual keyboard in the first version.

### Persistence

Save progress locally in the browser. Future versions may add cloud sync and
export/import, but those are out of scope for this design.

## Core User Flow

### Today Screen

The landing screen is the actual practice dashboard, not a marketing page. It
shows:

- Today's target question count.
- Due review count.
- New words planned for today.
- Current streak or recent completion signal.
- A start-practice action.
- A compact settings entry for target count, countdown seconds, autoplay, and
  sound effects.

When practice starts, the app creates a session list. Due review words are
selected first, then new words are added until the daily target is reached or the
word bank is exhausted.

### Question Flow

For each word:

1. Load word data and pronunciation audio.
2. Display the phonetic transcription and spelling cells.
3. Automatically play the American pronunciation once.
4. Allow replay audio.
5. Allow hint reveal.
6. Capture keyboard input into the spelling cells.
7. Automatically judge the answer when the final cell is filled.
8. On success, play the congratulations sound and show the result panel.
9. On failure, shake the whole spelling row, play the error sound, clear the
   typed letters, and keep the user on the same word.
10. After success, show the word, phonetic transcription, Chinese meaning,
    example sentence, and attempt status.
11. Start the countdown. When it reaches zero, move to the next word.

### Completion Flow

At the end of the session, show a summary:

- Completed question count.
- One-try correct count.
- Words that required retries.
- Words completed after using hints.
- Words scheduled for priority review tomorrow.

## Spelling Interaction

The spelling control is a row of fixed cells based on the target word length.
It is not a normal visible text input.

Rules:

- Alphabetic keys fill the next empty cell.
- Backspace clears the previous filled cell.
- Non-letter keys are ignored.
- Letter comparison is case-insensitive.
- Leading/trailing spaces are irrelevant because typing is cell-based.
- The answer must match the word exactly after case normalization.
- When the last cell is filled, the app automatically judges the answer.

Failure behavior:

- The whole spelling row shakes horizontally.
- The error sound plays if sound effects are enabled.
- The attempt is recorded as wrong.
- The typed cells are cleared.
- The same word remains active until it is spelled correctly.

Success behavior:

- The success sound plays if sound effects are enabled.
- The app records whether this was a clean success.
- The result panel appears with meaning and example.
- The countdown starts.

A clean success means the user spelled the word correctly on the first attempt
without using a hint.

## Review Scheduling

Use an interval review ladder suitable for B1/B2 learners:

- Stage 0: new or weak word.
- Stage 1: review after 1 day.
- Stage 2: review after 3 days.
- Stage 3: review after 7 days.
- Stage 4: review after 14 days.
- Stage 5: review after 30 days.

Only clean success advances a word to the next stage. If the user uses a hint,
answers incorrectly at least once, or needs retries before success, the word does
not advance. It is scheduled for priority review the next day.

This keeps the rules understandable while avoiding premature mastery for words
that were only completed after assistance.

## Data Model

### Word Entry

```ts
type WordEntry = {
  id: string;
  word: string;
  phonetic: string;
  meaningZh: string;
  example: string;
  audioSrc: string;
  difficulty: "easy" | "medium" | "hard";
  order: number;
};
```

### Word Progress

```ts
type WordProgress = {
  wordId: string;
  reviewStage: number;
  nextReviewAt: string | null;
  wrongCount: number;
  hintUsedCount: number;
  lastPracticedAt: string | null;
  mastered: boolean;
};
```

### Settings

```ts
type PracticeSettings = {
  dailyTarget: number;
  countdownSeconds: number;
  autoplayPronunciation: boolean;
  soundEffectsEnabled: boolean;
};
```

Default settings:

- `dailyTarget`: 30.
- `countdownSeconds`: 5.
- `autoplayPronunciation`: true.
- `soundEffectsEnabled`: true.

### Session Result

```ts
type WordAttemptResult = {
  wordId: string;
  cleanSuccess: boolean;
  wrongAttempts: number;
  hintUsed: boolean;
  completedAt: string;
};
```

## Storage

Use browser local storage for first-version simplicity. The storage layer should
own serialization and validation so the practice engine does not depend on raw
storage APIs.

If persisted progress is malformed, the app should preserve a backup copy under
a separate key when possible and recreate default progress. This recovery should
not block starting a practice session.

## Components And Responsibilities

### Word Library

Loads the embedded word list, exposes words by ID, and returns the next available
new words by order.

### Practice Engine

Builds the daily session. It selects due review words first and fills remaining
slots with new words. It also records per-word attempt outcomes.

### Spelling Controller

Owns the active typed letters, key handling, auto-judgement, retry reset,
success state, and failure animation trigger.

### Audio Controller

Handles pronunciation playback, replay, success sound, error sound, and
non-blocking audio-load failures.

### Review Scheduler

Updates word progress after each completed word. It advances only clean
successes and schedules assisted or failed-then-correct words for tomorrow.

### Settings Store

Persists daily target, countdown seconds, autoplay, and sound effects.

## Error Handling

Audio failure:

- Show "audio temporarily unavailable" near the replay control.
- Keep spelling practice available.
- Allow replay attempts.

Empty or exhausted word bank:

- Show a calm empty state explaining that no words are available for today's
  session.
- Do not crash the dashboard.

Malformed local progress:

- Back up the raw value if possible.
- Restore default progress.
- Let the user continue.

Countdown interruption:

- If the user manually starts the next word, cancel the active countdown.
- If the component unmounts, clear the timer.

Mobile layout pressure:

- Allow spelling cells to wrap or shrink within professional responsive
  constraints.
- Avoid overlapping text, controls, and cells.

## Testing And Acceptance

### Unit Tests

Practice engine:

- Due review words are selected before new words.
- The session never exceeds the daily target.
- New words fill the remaining target slots.
- Empty word banks return a safe empty session.

Review scheduler:

- Clean success advances through the interval ladder.
- Hint use prevents advancement and schedules tomorrow.
- Wrong attempts prevent advancement and schedules tomorrow.
- The final stage stays at the maximum interval.

Spelling controller:

- Letters fill cells in order.
- Backspace removes the previous letter.
- Non-letter keys are ignored.
- Matching is case-insensitive.
- Filling the final cell triggers judgement.
- Wrong answers clear cells and allow retry.

Storage:

- Default settings load when no settings exist.
- Saved settings round-trip.
- Malformed progress recovers without crashing.

### Manual Browser Checks

Desktop:

- Start a session from the dashboard.
- Hear pronunciation autoplay.
- Type a word with physical keyboard.
- See each letter appear in a cell.
- Confirm wrong answer shake, error sound, and clear retry.
- Confirm correct answer success sound, result panel, and countdown.
- Confirm countdown advances to the next word.

Mobile width:

- Dashboard remains readable.
- Spelling cells do not overlap controls.
- Hint, replay, and settings controls remain tappable.

Audio:

- Replay works.
- Missing audio does not block spelling.

Persistence:

- Refreshing the page preserves settings and progress.

## Non-Goals For First Version

- User accounts.
- Cloud sync.
- Online IELTS word fetching.
- Full custom word-list import.
- Complex adaptive scoring beyond the interval ladder.
- Native mobile app packaging.
- Custom mobile virtual keyboard.

## Implementation Constraint

The first implementation should include a small legal sample word/audio set if a
full licensed IELTS audio corpus is not available. The app architecture should
make replacing or expanding the word data a data-only change.
