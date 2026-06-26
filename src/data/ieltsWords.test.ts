import { existsSync } from "node:fs";
import { join } from "node:path";
import { ieltsWords } from "./ieltsWords";

it("loads the MIT IELTS vocabulary corpus", () => {
  expect(ieltsWords.length).toBeGreaterThanOrEqual(1600);
  expect(new Set(ieltsWords.map((word) => word.id)).size).toBe(ieltsWords.length);
  expect(ieltsWords).toContainEqual(expect.objectContaining({
    category: "自然地理",
    meaningZh: "大气层；氛围",
    source: "hefengxian/ielts-vocabulary",
    word: "atmosphere",
  }));
});

it("keeps bundled pronunciation files for local-audio sample words", () => {
  const localAudioWords = ieltsWords.filter((word) => word.audioSrc.length > 0);

  expect(localAudioWords.map((word) => word.word)).toEqual(["abandon", "abate", "abrupt"]);
  for (const word of localAudioWords) {
    const audioFile = join(process.cwd(), "public", word.audioSrc.replace(/^\//, ""));
    expect(existsSync(audioFile), `${word.word} audio missing at ${audioFile}`).toBe(true);
  }
});
