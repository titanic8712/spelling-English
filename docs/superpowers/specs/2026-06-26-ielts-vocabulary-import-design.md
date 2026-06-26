# IELTS Vocabulary Import Design

## Goal

Replace the three-word demo vocabulary with a larger MIT-licensed IELTS vocabulary corpus while preserving the current spelling practice flow.

## Source

Use `hefengxian/ielts-vocabulary` as the source corpus.

- Repository: `https://github.com/hefengxian/ielts-vocabulary`
- License: MIT
- Source file: `vocabulary.txt`
- Parsed entries: about 1,600 words and short phrases
- Available metadata: category, part of speech, Chinese meaning, examples for some entries

The import must include third-party notice text so the MIT license terms stay visible in this repository.

## Data Shape

Keep `WordEntry` as the app-facing type, and add optional source metadata:

- `category`
- `partOfSpeech`
- `note`
- `source`

Words that have bundled audio keep their local `audioSrc`. Imported words without local audio use an empty `audioSrc`, which tells the audio controller to use browser speech synthesis with `en-US`.

## Practice Behavior

- Existing sample words with bundled local audio stay at the start of the list.
- Imported IELTS entries follow the existing sample words.
- The app should not expose spelling for imported words before typing when phonetic data is unavailable.
- Missing local audio must not show as a broken user flow; pronunciation should fall back to browser speech synthesis.

## Out Of Scope

- No paid or proprietary vocabulary source.
- No automatic phonetic transcription generation.
- No bulk `.wav` generation for every imported word.
- No cloud sync or server-side vocabulary API.
