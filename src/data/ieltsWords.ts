import type { WordEntry } from "../domain/types";
import { generatedIeltsVocabulary } from "./generatedIeltsVocabulary";

const localAudioSampleWords: WordEntry[] = [
  {
    id: "abandon",
    word: "abandon",
    phonetic: "/əˈbændən/",
    meaningZh: "放弃",
    example: "They had to abandon the plan after the storm.",
    audioSrc: "/audio/words/en-us-abandon.wav",
    difficulty: "medium",
    order: 1,
  },
  {
    id: "abate",
    word: "abate",
    phonetic: "/əˈbeɪt/",
    meaningZh: "减弱，缓和",
    example: "The noise began to abate after midnight.",
    audioSrc: "/audio/words/en-us-abate.wav",
    difficulty: "medium",
    order: 2,
  },
  {
    id: "abrupt",
    word: "abrupt",
    phonetic: "/əˈbrʌpt/",
    meaningZh: "突然的，唐突的",
    example: "The meeting came to an abrupt end.",
    audioSrc: "/audio/words/en-us-abrupt.wav",
    difficulty: "medium",
    order: 3,
  },
];

export const ieltsWords: WordEntry[] = [
  ...localAudioSampleWords,
  ...generatedIeltsVocabulary,
];
