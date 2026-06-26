# spelling-English

Offline-first IELTS vocabulary spelling trainer for B1-B2 learners.

## Features

- Daily practice target setting
- 1,600+ MIT-licensed IELTS vocabulary entries with Chinese meanings
- American phonetics and bundled local pronunciation audio
- Keyboard-based letter-by-letter spelling cells
- Current-letter highlighting with typed-cell feedback
- Wrong-answer retry with shake feedback and error tone
- Success tone, attempt accuracy, retry count, spelling time, meaning, example sentence, and countdown to the next word
- Local progress storage with interval review scheduling
- Hint-assisted completion tracking
- Session summary with today accuracy, average spelling time, and review load
- Responsive desktop and mobile layout

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- Testing Library
- Browser `localStorage`
- HTML audio with Web Speech fallback

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Scripts

```bash
npm test
npm run build
npm audit
```

## Audio

The first sample words include bundled `.wav` pronunciation files generated with the macOS `Samantha` en_US voice:

- `public/audio/words/en-us-abandon.wav`
- `public/audio/words/en-us-abate.wav`
- `public/audio/words/en-us-abrupt.wav`

If a browser cannot play a bundled file, the app attempts an en-US `SpeechSynthesis` fallback.

Most imported IELTS vocabulary entries do not bundle local `.wav` files. They use the same en-US browser speech fallback by default.

## Vocabulary Source

The imported IELTS vocabulary corpus is derived from [`hefengxian/ielts-vocabulary`](https://github.com/hefengxian/ielts-vocabulary), licensed under MIT. See `docs/THIRD_PARTY_NOTICES.md`.

## Project Scope

This is a local-first first version. It does not include accounts, cloud sync, a full IELTS import pipeline, or native mobile packaging yet.
