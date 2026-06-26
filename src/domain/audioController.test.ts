import { createAudioController } from "./audioController";

it("plays pronunciation with the provided audio factory", async () => {
  const played: string[] = [];
  const controller = createAudioController({
    createAudio: (src) => ({ play: () => { played.push(src); return Promise.resolve(); } }),
    playTone: () => undefined,
  });

  await expect(controller.playPronunciation("/audio/words/en-us-abate.ogg")).resolves.toBeUndefined();
  expect(played).toEqual(["/audio/words/en-us-abate.ogg"]);
});

it("reports pronunciation playback failure without throwing away the app flow", async () => {
  const controller = createAudioController({
    createAudio: () => ({ play: () => Promise.reject(new Error("missing")) }),
    playTone: () => undefined,
  });

  await expect(controller.playPronunciation("/missing.ogg")).rejects.toThrow("missing");
});

it("falls back to spoken en-US pronunciation when the local audio file is missing", async () => {
  const spoken: string[] = [];
  const controller = createAudioController({
    createAudio: () => ({ play: () => Promise.reject(new Error("missing")) }),
    playTone: () => undefined,
    speakWord: (word) => {
      spoken.push(word);
      return Promise.resolve();
    },
  });

  await expect(controller.playPronunciation("/missing.ogg", "abandon")).resolves.toBeUndefined();
  expect(spoken).toEqual(["abandon"]);
});

it("plays success and error tones", () => {
  const tones: string[] = [];
  const controller = createAudioController({
    createAudio: (src) => ({ play: () => Promise.resolve(src) }),
    playTone: (tone) => tones.push(tone),
  });

  controller.playSuccess();
  controller.playError();
  expect(tones).toEqual(["success", "error"]);
});
