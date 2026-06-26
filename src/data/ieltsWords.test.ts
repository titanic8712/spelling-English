import { existsSync } from "node:fs";
import { join } from "node:path";
import { ieltsWords } from "./ieltsWords";

it("bundles a local pronunciation file for every sample word", () => {
  for (const word of ieltsWords) {
    const audioFile = join(process.cwd(), "public", word.audioSrc.replace(/^\//, ""));
    expect(existsSync(audioFile), `${word.word} audio missing at ${audioFile}`).toBe(true);
  }
});
